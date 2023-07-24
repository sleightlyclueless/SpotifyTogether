import { Router } from "express";
import { Event } from "../entities/Event";
import { User } from "../entities/User";
import { EventUser, Permission } from "../entities/EventUser";
import { DI } from "../index";
import axios from "axios";
import { SpotifyTrack } from "../entities/SpotifyTrack";
import { EventTrack, TrackStatus } from "../entities/EventTrack";
import util from "util";

const RELATED_ARTIST_WEIGHT = 1;
const FOLLOWED_ARTIST_WEIGHT = 6;
const TOP_ARTIST_WEIGHT = 15;

const AMOUNT_ARTISTS = 10;
const AMOUNT_TRACKS_PER_ARTIST = 3;
const AMOUNT_RECOMMENDATIONS = 2;

class Artist {
  id: string;
  highestWeight: number;
  genres: Array<string>;

  constructor(id: string, startWeight: number, genres: Array<string>) {
    this.id = id;
    this.highestWeight = startWeight;
    this.genres = genres;
  }
}

const router = Router({ mergeParams: true });

// TODO: add comment
router.put("/generate", async (req, res) => {
  // TODO: lock event
  req.event = await DI.em.findOne(Event, { id: req.event!.id });
  if (!req.event) return res.status(404).json({ message: "Event not found." });

  // Clear before new run
  await req.event!.eventTracks.init();
  req.event!.eventTracks.removeAll();
  await DI.em.persist(req.event!);

  const eventUserOwner = await DI.em.findOne(
    EventUser,
    {
      event: { id: req.event!.id },
      permission: Permission.OWNER,
    },
    {
      populate: ["user"],
    }
  );
  if (eventUserOwner) {
    // fetch owner info
    const owner = eventUserOwner.user;
    const owner_access_token = await generateAccessToken(owner);
    if (owner_access_token == null)
      return res
        .status(500)
        .send("Server failed to generate new token for owner");

    // fetch event users
    const eventUsers = await DI.em.find(
      EventUser,
      {
        event: { id: req.event!.id },
      },
      {
        populate: ["user"],
      }
    );
    console.log(
      "1: Generating playlist for event " +
        req.event!.id +
        " from owner " +
        eventUserOwner.user.spotifyId +
        " with " +
        eventUsers.length +
        " users."
    );

    if (eventUsers) {
      // data structures
      let artists = new Map<string, number>();
      let genres = new Map<string, number>();

      // collect data for every user
      for (const eventUser of eventUsers) {
        // generate new access_token (old one is not invalidated)
        let access_token = owner_access_token;
        if (eventUser.permission != Permission.OWNER)
          access_token = await generateAccessToken(eventUser.user);
        if (access_token == null) continue;

        // fetch user top & followed artists
        const userArtists: Map<string, Artist> = new Map();
        await fetchUserArtists(access_token, userArtists);
        await evaluateUserArtists(artists, genres, userArtists);
      }

      // sort artists and genres by weight
      const sortedArtists: [string, number][] = [...artists.entries()].sort(
        ([artistId1, artistWeight1], [artistId2, artistWeight2]) => {
          if (artistWeight1 < artistWeight2) return 1;
          else if (artistWeight1 > artistWeight2) return -1;
          else return 0;
        }
      );
      console.log(
        "2: Artists: " + util.inspect(sortedArtists, { maxArrayLength: null })
      );

      const sortedGenres: [string, number][] = [...genres.entries()].sort(
        ([genreId1, genreWeight1], [genreId2, genreWeight2]) => {
          if (genreWeight1 < genreWeight2) return 1;
          else if (genreWeight1 > genreWeight2) return -1;
          else return 0;
        }
      );
      console.log(
        "3: Genres: " + util.inspect(sortedGenres, { maxArrayLength: null })
      );

      // fetch top tracks for top artist with the largest weight ?
      // -> add to playlist
      // get & add new songs to event
      await addArtistTopTracksToEvent(
        req.event!,
        sortedArtists,
        owner_access_token
      );

      // get recommendations from spotify for top 5 artists and genres
      await getRecommendation(
        req.event!,
        owner_access_token,
        sortedArtists,
        sortedGenres
      );

      // export playlist to spotify
      const playlistResult = await createSpotifyPlaylistFromEvent(
        req.event!,
        owner
      );
      return res.status(200).end();
    } else
      return res.status(404).json({ message: "Failed to load event users." });
  }
});

function generateAccessToken(user: User): Promise<string> {
  return axios
    .post(
      "https://accounts.spotify.com/api/token",
      {
        grant_type: "refresh_token",
        refresh_token: user.spotifyRefreshToken,
      },
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              DI.spotifyClientId + ":" + DI.spotifyClientSecret
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then((tokenResponse) => {
      return tokenResponse.data.access_token;
    })
    .catch((error) => {
      console.log("generateAccessToken() " + error.message);
      return "undefined";
    });
}

async function fetchUserArtists(
  user_access_token: string,
  mainUserArtists: Map<string, Artist> // Additional parameter to accumulate artists
): Promise<void> {
  await axios
    .get("https://api.spotify.com/v1/me/top/artists?limit=" + AMOUNT_ARTISTS, {
      headers: {
        Authorization: "Bearer " + user_access_token,
      },
    })
    .then(async (response) => {
      for (const artist of response.data.items) {
        const artistId = artist.id;
        const startWeight = mainUserArtists.has(artistId) // Use mainUserArtists instead of userArtists
          ? mainUserArtists.get(artistId)!.highestWeight
          : RELATED_ARTIST_WEIGHT;
        const genres = artist.genres || [];
        if (!mainUserArtists.has(artistId)) {
          mainUserArtists.set(
            artistId,
            new Artist(artistId, startWeight, genres)
          );
        } else {
          const existingArtist = mainUserArtists.get(artistId)!;
          existingArtist.genres = [
            ...new Set(existingArtist.genres.concat(genres)),
          ];
          if (startWeight > existingArtist.highestWeight) {
            existingArtist.highestWeight = startWeight;
          }
        }
      }
    })
    .catch((error) => {
      console.log("fetchUserArtists() " + error.message);
    });

  await axios
    .get("https://api.spotify.com/v1/me/following?type=artist&limit=" + AMOUNT_ARTISTS, {
      headers: {
        Authorization: "Bearer " + user_access_token,
      },
    })
    .then(async (response) => {
      for (const artist of response.data.items) {
        const artistId = artist.id;
        const startWeight = mainUserArtists.has(artistId) // Use mainUserArtists instead of userArtists
          ? mainUserArtists.get(artistId)!.highestWeight
          : RELATED_ARTIST_WEIGHT;
        const genres = artist.genres || [];
        if (!mainUserArtists.has(artistId)) {
          mainUserArtists.set(
            artistId,
            new Artist(artistId, startWeight, genres)
          );
        } else {
          const existingArtist = mainUserArtists.get(artistId)!;
          existingArtist.genres = [
            ...new Set(existingArtist.genres.concat(genres)),
          ];
          if (startWeight > existingArtist.highestWeight) {
            existingArtist.highestWeight = startWeight;
          }
        }
      }
    })
    .catch((error) => {
      console.log("fetchUserArtists() " + error.message);
    });

  // TODO: fetch related artists for top artists? or else remove
  // -> collect names -> weight: RELATED_ARTIST_WEIGHT
  // -> collect genre -> weight: 1
}

async function evaluateUserArtists(
  artists: Map<string, number>,
  genres: Map<string, number>,
  userArtists: Map<string, Artist>
) {
  // add user artist names to artists map
  for (const [id, artist] of userArtists) {
    if (artists.has(artist.id))
      artists.set(
        artist.id,
        (artists.get(artist.id) ?? 0) + artist.highestWeight
      );
    else artists.set(artist.id, artist.highestWeight);
  }

  // collect user genres, filter duplicates, find the highest weight
  const userGenres = new Map<string, number>();
  for (const [artistId, artist] of userArtists) {
    for (const genreId of artist.genres) {
      if (userGenres.has(genreId)) {
        let userGenreWeight = userGenres.get(genreId);
        if (userGenreWeight && userGenreWeight < artist.highestWeight)
          userGenreWeight = artist.highestWeight;
      } else userGenres.set(genreId, artist.highestWeight);
    }
  }

  // add user genres & highest weights to collected genre data
  for (const [userGenreId, userHighestWeight] of userGenres) {
    if (genres.has(userGenreId)) {
      let genreWeight = genres.get(userGenreId);
      if (genreWeight) genreWeight += userHighestWeight;
    } else genres.set(userGenreId, userHighestWeight);
  }
}

async function addArtistTopTracksToEvent(
  event: Event,
  sortedArtists: [string, number][],
  owner_access_token: string
) {
  // if less than 10 artists use all, else only top 20%
  const percentage = sortedArtists.length <= 10 ? 1 : 0.2;

  console.log("4: Adding 3 Songs for each Artist");
  for (let i = 0; i < sortedArtists.length * percentage; i++) {
    const artistId = sortedArtists[i][0];
    const artistDetails = await getArtistDetails(artistId, owner_access_token);

    if (artistDetails) {
      const genres = artistDetails.genres?.join(",") || "Unknown";

      await axios
        .get(
          "https://api.spotify.com/v1/artists/" +
            artistId +
            "/top-tracks?country=DE&limit=" + AMOUNT_TRACKS_PER_ARTIST,
          {
            headers: {
              Authorization: "Bearer " + owner_access_token,
            },
          }
        )
        .then(async (trackResponse) => {
          for (const track of trackResponse.data.tracks) {
            await addTrackToEvent(
              event,
              track.id,
              track.duration_ms,
              genres,
              track.artists[0].name
            );
          }
        })
        .catch(function (error: Error) {
          console.log("addArtistTopTracksToEvent() " + error.message);
        });
    }
  }
}

function getArtistDetails(artistId: string, access_token: string) {
  return axios
    .get("https://api.spotify.com/v1/artists/" + artistId, {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("getArtistDetails=" + error.message);
      return null;
    });
}
async function getRecommendation(
  event: Event,
  owner_access_token: string,
  sortedArtists: [string, number][],
  sortedGenres: [string, number][]
) {
  // get top 2 artists
  let toBeRecommendedArtists = new Array<string>();
  for (const artist of sortedArtists.slice(
    0,
    sortedArtists.length < 2 ? sortedArtists.length : 2
  )) {
    const test: string = artist[0];
    if (test) toBeRecommendedArtists.push(test);
  }

  // get top 3 genres
  let toBeRecommendedGenres = new Array<string>();
  for (const genre of sortedGenres.slice(
    0,
    sortedGenres.length < 3 ? sortedGenres.length : 3
  )) {
    const test: string = genre[0];
    if (test) toBeRecommendedGenres.push(test);
  }

  const formattedGenres = toBeRecommendedGenres.map((genre) =>
    genre.replace(/\s+/g, "+")
  );

  console.log(
    "5: Getting 5 Recommendations for " +
      toBeRecommendedArtists.length +
      " Artists and " +
      formattedGenres.length +
      " Genres"
  );
  // Construct the query with the correct URL
  const query =
    "https://api.spotify.com/v1/recommendations" +
    "?seed_artists=" +
    toBeRecommendedArtists.join("%2C") +
    "&seed_genres=" +
    formattedGenres.join("%2C") +
    "&limit=" + AMOUNT_RECOMMENDATIONS;

  await axios
    .get(query, {
      headers: {
        Authorization: "Bearer " + owner_access_token,
      },
    })
    .then(async function (response) {
      for (const track of response.data.tracks) {
        // Get the first artist's ID from the track data
        const artistId = track.artists[0].id;

        // Make a new API call to get the artist's details
        const artistResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${artistId}`,
          {
            headers: {
              Authorization: "Bearer " + owner_access_token,
            },
          }
        );
        const artistGenres = artistResponse.data.genres.join(",") || "Unknown";

        await addTrackToEvent(
          event,
          track.id,
          track.duration_ms,
          artistGenres,
          track.artists[0].name
        );
      }
    })
    .catch(function (error) {
      console.log("getRecommendation() " + error.message);
    });
}

async function addTrackToEvent(
  event: Event,
  trackId: string,
  duration: number,
  genres: string,
  artist: string
) {
  // check if track exists
  let topTrack = await DI.em.findOne(SpotifyTrack, {
    id: trackId,
  });

  // else create new track
  if (!topTrack) {
    topTrack = new SpotifyTrack(trackId, duration, genres.toString(), artist);
    await DI.em.persist(topTrack);
  }

  // check if event track exists
  let trackInEvent = await DI.em.findOne(EventTrack, {
    event: { id: event.id },
    track: { id: topTrack.id },
  });

  if (!trackInEvent) {
    let insertEventTrack = new EventTrack(
      TrackStatus.GENERATED,
      topTrack,
      event
    );
    event.eventTracks.add(insertEventTrack);
    await DI.em.persist(insertEventTrack);
  } else {
    if (
      trackInEvent.status != TrackStatus.DENIED &&
      trackInEvent.status < TrackStatus.GENERATED
    )
      trackInEvent.status = TrackStatus.GENERATED;
  }
}

async function createSpotifyPlaylistFromEvent(
  event: Event,
  owner: User
): Promise<boolean> {
  let success: boolean = false;
  console.log(
    "6: Creating Playlist for Event " +
      event.id +
      " from owner " +
      owner.spotifyId
  );
  const query =
    "https://api.spotify.com/v1/users/" + owner.spotifyId + "/playlists";

  // Initialize the eventTracks collection before querying the database
  await event.eventTracks.init();

  axios
    .post(
      query,
      {
        name: event.name,
        description: "Automatically generated by FWE Spotify App.",
        public: true,
      },
      {
        headers: {
          Authorization: "Bearer " + owner.spotifyAccessToken,
        },
      }
    )
    .then(async function (response) {
      const playlistId = response.data.id;
      let batch = new Array<string>();
      for (const batchTrack of event.eventTracks) {
        if (
          batchTrack.status == TrackStatus.GENERATED ||
          batchTrack.status == TrackStatus.ACCEPTED_PLAYLIST ||
          batchTrack.status == TrackStatus.ACCEPTED
        )
          batch.push("spotify:track:" + batchTrack.track.id);
        if (batch.length >= 25)
          await pushTracksToSpotifyPlaylist(owner, playlistId, batch);
      }
      if (batch.length > 0)
        await pushTracksToSpotifyPlaylist(owner, playlistId, batch);

      success = true;
    })
    .catch(function (error) {
      console.log("createSpotifyPlaylistFromEvent() " + error.message);
      success = false;
    });
  console.log("createSpotifyPlaylistFromEvent(): Done! " + success);

  return success;
}

async function pushTracksToSpotifyPlaylist(
  owner: User,
  playlistId: string,
  trackBatch: Array<string>
) {
  const query =
    "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";

  axios
    .post(
      query,
      {
        uris: trackBatch,
      },
      {
        headers: {
          Authorization: "Bearer " + owner.spotifyAccessToken,
        },
      }
    )
    .then(function (response) {
      //console.log("Tracks successfully added to the playlist.");
    })
    .catch(function (error) {
      //console.log("pushTracksToSpotifyPlaylist() " + error.message);
    });
}

export const EventAlgorithmController = router;
