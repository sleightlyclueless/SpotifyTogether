import {Router} from "express";
import {Event} from "../entities/Event";
import {User} from "../entities/User";
import {EventUser, Permission} from "../entities/EventUser";
import {DI} from "../index";
import axios from "axios";
import {SpotifyTrack} from "../entities/SpotifyTrack";
import {EventTrack, TrackStatus} from "../entities/EventTrack";
import supertest from "supertest";

const router = Router({mergeParams: true});

router.get('/sampleEvent', async (req, res) => {
    const event = new Event("eventId", "eventName", new Date());
    const access_token1: string = "";
    const access_token2: string = "";
    const user1 = new User("id1", access_token1, "", 0, 0);
    const user2 = new User("id2", access_token2, "", 0, 0);
    const eventUser1 = new EventUser(Permission.ADMIN, user1, event);
    const eventUser2 = new EventUser(Permission.ADMIN, user2, event);
    await DI.em.persist(user1).persist(user2);
    await DI.em.persist(eventUser1).persist(eventUser2);
    await DI.em.persistAndFlush(event);
});

//algorithm
// for each user in EventUser assigned to event: Get/me/top/artists or tracks. set limit for returned Objects(20?)
//  - responseArtists/respnseTracks are saved in Datastructure responseObject.items.ArtistObject.id
// sort the entries by frequency
//
router.get('/generate', async (req, res) => {
    const eventUserOwner = await DI.em.findOne(EventUser,
        {
            event: {id: "eventId"}, // TODO:
            permission: Permission.OWNER
        },
        {
            populate: ['user']
        }
    );
    if (eventUserOwner) {
        // fetch owner info
        const owner = eventUserOwner.user;
        const owner_access_token = await generateAccessToken(owner);
        if (owner_access_token == null)
            return res.status(500).send("Server failed to generate new token for owner");

        // fetch event users
        const eventUsers = await DI.em.find(EventUser,
            {
                event: {id: "eventId"}, // TODO:
            },
            {
                populate: ['user']
            }
        );
        if (eventUsers) {
            // data structures
            let artists = new Map<string, number>();
            // TODO let genres = new Map<string, number>();

            // collect data for every user
            for (const eventUser of eventUsers) {
                // generate new access_token (old one is not invalidated)
                const access_token = await generateAccessToken(eventUser.user);
                if (access_token == null) continue;

                await fetchUserTopArtists(eventUser.user, artists);

                const RELATED_ARTIST_WEIGHT = 1;
                const FOLLOWED_ARTIST_WEIGHT = 6;
                const TOP_ARTIST_WEIGHT = 15;

                // { id, weight, genres }
                // { name, type, amount??? }


                // fetch top artists
                // -> collect names -> weight: TOP_ARTIST_WEIGHT
                // -> collect genre -> weight: 15

                // fetch all followed artists
                // -> collect names -> weight: FOLLOWED_ARTIST_WEIGHT
                // -> collect genre -> weight: 6

                // fetch related artists for top artists ?
                // -> collect names -> weight: RELATED_ARTIST_WEIGHT
                // -> collect genre -> weight: 1


                // fetch user top tracks (intersections more difficult)
                // -> collect genres ? no duplicates ? set ? weight: 10 ?

                // ===================================

                // fetch top tracks for top artist with the largest weight ?
                // -> add to playlist

                // call spotify get recommendation with artists & genres with the largest weight ?
                // -> add to playlist
            }

            console.log(artists);

            // TODO evaluate data
            //  ...
            let artistSorted = new Map([...artists.entries()].sort());

            // get & add new songs to event
            await assignTopTracksToEvent(req.event!, artistSorted, owner_access_token);

            // export playlist to spotify
            const playlistResult = await createSpotifyPlaylistFromEvent(req.event!, owner);
            if(playlistResult) return res.status(200).end();
            else return res.status(400).send("Failed to create playlist."); // TODO: return better error
        } else return res.status(404).send("Failed to load event users");
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
        console.log(error);
    });
    return access_token;
}

async function fetchUserTopArtists(user: User, artists: Map<string, number>) {
    await axios.get(
        "https://api.spotify.com/v1/me/top/artists?limit=50",
        {
            headers: {
                Authorization: 'Bearer ' + user.spotifyAccessToken, // TODO: use generated access_token
            },
        }
    ).then(async (artistResponse) => {
        console.log("successful artist request");
        // reformat artists
        for (const artist of artistResponse.data.items) {
            if (artists.has(artist.name)) {
                let artistCounter = artists.get(artist.name);
                if (artistCounter) artistCounter++;
            } else artists.set(artist.name, 1);
        }
    }).catch(function (error) {
        console.log(error.message);
    });
}

async function assignTopTracksToEvent(event: Event, artistSorted: Map<string, number>, owner_access_token: string) {
    // fetch top Tracks from Artist add to SpotifyTrack-Table push to playlist
    for (const artist of artistSorted) {
        await axios.get(
            "https://api.spotify.com/v1/artists/" + artist + "/top-tracks",
            {
                headers: {
                    Authorization: 'Bearer ' + owner_access_token,
                },
            }
        ).then(async (trackResponse) => {
            let topTrack = await DI.em.findOne(SpotifyTrack,
                {
                    id: trackResponse.data.tracks.id
                },
            );
            if (!topTrack) {
                topTrack = new SpotifyTrack(
                    trackResponse.data.tracks.id,
                    trackResponse.data.tracks.duration,
                    trackResponse.data.tracks.genre,
                    trackResponse.data.tracks.artist);
                await DI.em.persist(topTrack);
            }
            let insertEventTrack = new EventTrack(TrackStatus.GENERATED, topTrack, event);
            await DI.em.persist(insertEventTrack);
        }).catch(function (error: Error) {
            console.log(error);
        });

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
        if(batch.length > 0) pushTracksToSpotifyPlaylist(owner, playlistId, batch);
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
                //["spotify:track:4iV5W9uYEdYUVa79Axb7Rh","spotify:track:1301WleyT98MSxVHPZCA6M", "spotify:episode:512ojhOuo1ktJprKbVcKyQ"]
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