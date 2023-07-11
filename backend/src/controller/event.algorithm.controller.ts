import {Router} from "express";
import {Event} from "../entities/Event";
import {User} from "../entities/User";
import {EventUser, Permission} from "../entities/EventUser";
import {DI} from "../index";
import axios from "axios";
import {SpotifyTrack} from "../entities/SpotifyTrack";
import {EventTrack, TrackStatus} from "../entities/EventTrack";

const RELATED_ARTIST_WEIGHT = 1;
const FOLLOWED_ARTIST_WEIGHT = 6;
const TOP_ARTIST_WEIGHT = 15;

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

const router = Router({mergeParams: true});

// TODO: remove
router.get('/sample', async (req, res) => {
    const event = new Event("eventId", "eventName", new Date());
    const user1 = new User("id1", "Test1", "", 60 * 60 * 1000, Date.now());
    const user2 = new User("id2", "Test2", "", 60 * 60 * 1000, Date.now());
    const eventUser1 = new EventUser(Permission.OWNER, user1, event);
    const eventUser2 = new EventUser(Permission.ADMIN, user2, event);
    await DI.em.persist(user1).persist(user2);
    await DI.em.persist(eventUser1).persist(eventUser2);
    await DI.em.persistAndFlush(event);
    res.status(200).end();
});

// TODO: add comment
router.put('/generate', async (req, res) => {
    // TODO: lock event
    const eventUserOwner = await DI.em.findOne(EventUser,
        {
            event: {id: req.event!.id},
            permission: Permission.OWNER
        },
        {
            populate: ['user']
        }
    );
    if (eventUserOwner) {
        // fetch owner info
        const owner = eventUserOwner.user;
        let owner_access_token = await generateAccessToken(owner);
        if (owner_access_token == null)
            return res.status(500).send("Server failed to generate new token for owner");

        // fetch event users
        const eventUsers = await DI.em.find(EventUser,
            {
                event: {id: req.event!.id},
            },
            {
                populate: ['user']
            }
        );
        if (eventUsers) {
            // data structures
            let artists = new Map<string, number>();
            let genres = new Map<string, number>();

            // collect data for every user
            for (const eventUser of eventUsers) {
                // generate new access_token (old one is not invalidated)
                const access_token = (eventUser.permission != Permission.OWNER)
                    ? await generateAccessToken(eventUser.user)
                    : owner_access_token;
                if (access_token == null) continue;

                // fetch user top & followed artists
                const userArtists: Map<string, Artist> = await fetchUserArtists(access_token);
                await evaluateUserArtists(artists, genres, userArtists);

                // fetch user top tracks (intersections more difficult)
                // -> collect genres ? no duplicates ? set ? weight: 10 ?
            }

            // sort artists and genres by weight
            const sortedArtists: [string, number][] = [...artists.entries()]
                .sort(
                    (
                        [artistId1, artistWeight1],
                        [artistId2, artistWeight2]
                    ) => {
                        if (artistWeight1 < artistWeight2) return 1;
                        else if (artistWeight1 > artistWeight2) return -1;
                        else return 0;
                    }
                );
            const sortedGenres: [string, number][] = [...genres.entries()]
                .sort(
                    (
                        [genreId1, genreWeight1],
                        [genreId2, genreWeight2]
                    ) => {
                        if (genreWeight1 < genreWeight2) return 1;
                        else if (genreWeight1 > genreWeight2) return -1;
                        else return 0;
                    }
                );


            // fetch top tracks for top artist with the largest weight ?
            // -> add to playlist
            // get & add new songs to event
            await addArtistTopTracksToEvent(req.event!, sortedArtists, owner_access_token);

            // get recommendations from spotify for top 5 artists and genres
            await getRecommendation(req.event!, owner_access_token, sortedArtists, sortedGenres);

            // export playlist to spotify
            const playlistResult = await createSpotifyPlaylistFromEvent(req.event!, owner);
            if (playlistResult) return res.status(200).end();
            else return res.status(400).json({message: "Failed to create playlist."});
        } else return res.status(404).json({message: "Failed to load event users."});
    }

});

async function generateAccessToken(user: User): Promise<string | null> {
    let access_token: string | null = null;
    axios.post(
        'https://accounts.spotify.com/api/token',
        {
            grant_type: 'refresh_token',
            refresh_token: user.spotifyRefreshToken
        },
        {
            headers: {
                'Authorization': 'Basic ' + (Buffer.from(DI.spotifyClientId + ':' + DI.spotifyClientSecret).toString('base64')),
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }).then((tokenResponse) => {
        access_token = tokenResponse.data.access_token;
    }).catch(function (error: Error) {
        console.log(error.message);
    });
    return access_token;
}

async function fetchUserArtists(user_access_token: string): Promise<Map<string, Artist>> {
    let userArtists = new Map<string, Artist>();

    // fetch top artists
    await axios.get(
        "https://api.spotify.com/v1/me/top/artists?limit=50",
        {
            headers: {
                Authorization: 'Bearer ' + user_access_token,
            },
        }
    ).then(async (response) => {
        for (const artist of response.data.items)
            if (!userArtists.has(artist.name))
                userArtists.set(artist.name, new Artist(artist.name, TOP_ARTIST_WEIGHT, artist.genres));
    }).catch(function (error) {
        console.log("fetchUserArtists: " + error.message);
    });

    // fetch followed artists
    await axios.get(
        "https://api.spotify.com/v1/me/following?type=artist&limit=50",
        {
            headers: {
                Authorization: 'Bearer ' + user_access_token,
            },
        }
    ).then(async (response) => {
        console.log(response.data.items);
        for (const artist of response.data.items)
            if (!userArtists.has(artist.name))
                userArtists.set(artist.name, new Artist(artist.name, FOLLOWED_ARTIST_WEIGHT, artist.genres));
    }).catch(function (error) {
        console.log(error.message);
    });

    // TODO: fetch related artists for top artists ? or else remove
    // -> collect names -> weight: RELATED_ARTIST_WEIGHT
    // -> collect genre -> weight: 1

    return userArtists;
}

async function evaluateUserArtists(artists: Map<string, number>, genres: Map<string, number>, userArtists: Map<string, Artist>) {
    // add user artist names to artists map
    for (const [id, artist] of userArtists) {
        if (artists.has(artist.id)) artists.set(artist.id, (artists.get(artist.id) ?? 0) + artist.highestWeight)
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

async function addArtistTopTracksToEvent(event: Event, sortedArtists: [string, number][], owner_access_token: string) {
    // if less than 20 artists use all, else only top 20%
    const percentage = (sortedArtists.length <= 20) ? 1 : 0.2;

    for (let i = 0; i < sortedArtists.length * percentage; i++) {
        await axios.get(
            "https://api.spotify.com/v1/artists/" + sortedArtists.at(i)?.at(0) + "/top-tracks?limit=10",
            {
                headers: {
                    Authorization: 'Bearer ' + owner_access_token,
                },
            }
        ).then(async (trackResponse) => {
            for (const track of trackResponse.data.tracks) {
                await addTrackToEvent(event, track.id, track.duration, track.genre, track.artist)
            }
        }).catch(function (error: Error) {
            console.log(error.message);
        });
    }
}

async function getRecommendation(event: Event, owner_access_token: string, sortedArtists: [string, number][], sortedGenres: [string, number][]) {
    // get top 5 artists
    let toBeRecommendedArtists = new Array<string>();
    for (const artist of sortedArtists.slice(0, (sortedArtists.length < 5) ? sortedArtists.length : 5)) {
        const test: string = artist[0];
        if (test) toBeRecommendedArtists.push(test)
    }

    // get top 5 genres
    let toBeRecommendedGenres = new Array<string>();
    for (const genre of sortedGenres.slice(0, (sortedGenres.length < 5) ? sortedGenres.length : 5)) {
        const test: string = genre[0];
        if (test) toBeRecommendedGenres.push(test)
    }

    await axios.get(
        "https://api.spotify.com/v1/recommendations"
        + "?seed_artists=" + toBeRecommendedArtists.toString()
        + "?seed_genres=" + toBeRecommendedGenres.toString()
        + "?limit=50",
        {
            headers: {
                Authorization: 'Bearer ' + owner_access_token,
            }
        }
    ).then(async function (response) {
        for (const track of response.data.tracks) {
            await addTrackToEvent(event, track.id, track.duration, track.genre, track.artist)
        }
    }).catch(function (error) {
        console.log(error.message);
    });
}

async function addTrackToEvent(event: Event, trackId: string, duration: number, genres: string, artist: string) {
    // check if track exists
    let topTrack = await DI.em.findOne(SpotifyTrack,
        {
            id: trackId
        },
    );

    // else create new track
    if (!topTrack) {
        topTrack = new SpotifyTrack(
            trackId,
            duration,
            genres.toString(),
            artist);
        await DI.em.persist(topTrack);
    }

    // check if event track exists
    let trackInEvent = await DI.em.findOne(EventTrack,
        {
            event: {id: event.id},
            track: {id: topTrack.id}
        },
    );

    if (!trackInEvent) {
        let insertEventTrack = new EventTrack(TrackStatus.GENERATED, topTrack, event);
        await DI.em.persist(insertEventTrack);
    } else {
        if (trackInEvent.status != TrackStatus.DENIED
            && trackInEvent.status < TrackStatus.GENERATED)
            trackInEvent.status = TrackStatus.GENERATED;
    }
}

async function createSpotifyPlaylistFromEvent(event: Event, owner: User): Promise<boolean> {
    let success: boolean = false;
    await axios.post(
        "https://api.spotify.com/v1/users/" + owner.spotifyId + "/playlists",
        {
            headers: {
                Authorization: 'Bearer ' + owner.spotifyAccessToken,
            },
            body: {
                name: event.name,
                description: "Automatically generated by FWE Spotify App.",
            }
        }
    ).then(function (response) {
        if (event.eventTracks.isInitialized()) event.eventTracks.init();
        const playlistId = response.data.id;
        let batch = new Array<string>();
        for (const batchTrack of event.eventTracks) {
            if (batchTrack.status == TrackStatus.GENERATED
                || batchTrack.status == TrackStatus.ACCEPTED_PLAYLIST
                || batchTrack.status == TrackStatus.ACCEPTED)
                batch.push("spotify:track:" + batchTrack.track.id);
            if (batch.length >= 100) pushTracksToSpotifyPlaylist(owner, playlistId, batch);
        }
        if (batch.length > 0) pushTracksToSpotifyPlaylist(owner, playlistId, batch);
        success = true;
    }).catch(function (error) {
        console.log(error.message);
        success = false;
    });
    return success;
}

async function pushTracksToSpotifyPlaylist(owner: User, playlistId: string, trackBatch: Array<string>) {
    await axios.post(
        "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks",
        {
            headers: {
                Authorization: 'Bearer ' + owner.spotifyAccessToken,
            },
            body: {
                uris: trackBatch.toString(),
            }
        }
    ).then(function (response) {

    }).catch(function (error) {
        console.log(error.message);
    });
}

export const EventAlgorithmController = router;