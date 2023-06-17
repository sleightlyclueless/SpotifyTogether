import {Router} from "express";
import {DI} from '../index';
import {Event} from "../entities/Event";
import axios from "axios";
import {EventTrack, TrackStatus} from "../entities/EventTrack";
import {SpotifyTrack} from "../entities/SpotifyTrack";
import {SpotifyPlaylist} from "../entities/SpotifyPlaylist";
import {Auth} from "../middleware/auth.middleware";

const EVENT_ID_LENGTH: number = 6;

const router = Router({mergeParams: true});

// create a few random playlist & song samples to allow easier testing
/*router.get('/create_samples', async (req, res) => {

    const playlist1 = new SpotifyPlaylist("random_id");

    playlist1.eventTracks.add(new SpotifyTrack("", 123, "", "Uhrensohn der II"));

    return res.status(200).end();
});*/

/*
* Get All Playlists
* */
router.get('/', async (req, res) => {
    // Get All Available Events
    const allPlaylists = await DI.em.find(SpotifyPlaylist, {});
    console.log(allPlaylists)

    for (const list of allPlaylists) {
        console.log(list.id);
        console.log(list.tracks)
        console.log(list.duration)
    }

    //Return all Events
    if (allPlaylists) return res.status(200).json(allPlaylists);
    else return res.status(404).json("No Playlists were found");
});

/*
* Add Spotify Track to Event
* */
// TODO: should be post ?
router.get('/suggest/:trackId', Auth.verifyParticipantAccess, async (req, res) => {
    axios.get(
        "https://api.spotify.com/v1/tracks" + req.params.trackId,
        {
            headers: {
                Authorization: `Bearer ${req.user!.spotifyAccessToken}`,
            },
        }).then(async (trackResponse) => {
        let track = await DI.em.findOne(SpotifyTrack, trackResponse.data.id);
        if (track) {
            //track was found in list
            console.log("track is already in Database");
        } else {
            // insert track to Database
            track = new SpotifyTrack(trackResponse.data.id, trackResponse.data.genre, trackResponse.data.genre, trackResponse.data.artist);
            await DI.em.persistAndFlush(track);
        }
        //push track to Eventlist
        //let track2 = await DI.em.findOne(SpotifyTrack, req.params.trackId);
        let event = await DI.em.findOne(Event, req.params.eventId);
        if (event) {
            //write Track to EventTrack list
            const insertEventTrack = new EventTrack(TrackStatus.proposed, track, event);
            await DI.em.persistAndFlush(insertEventTrack);
            console.log("track was added to EventList");
        } else {
            // event was not found
            return res.status(400).json({error: "Did not find Event"});// TODO: rework error
        }
        return res.status(201).json({information: "Track was added to Playlist"});
    }).catch(function (error: Error) {
        return res.status(400).send(error); // TODO: rework error
    });
});

/**
 * Add Spotify Playlist to Event
 * **/
// TODO: should be post ?
router.get('/suggest/:playlistId', Auth.verifyParticipantAccess, async (req, res) => {
    /* axios.get(
         "https://api.spotify.com/v1/playlists" + req.params.trackId,
         {
             headers: {
                 Authorization: `Bearer ${req.user!.spotifyAccessToken}`,
             },
         }).then(async (playlistResponse) => {
         let list = await DI.em.findOne(SpotifyPlaylist, playlistResponse.data.id);
         if (list) {
             //track was found in list
             console.log("playlist is already in Database");
         } else {
             // insert playlist to Database
             list = new SpotifyPlaylist(playlistResponse.data.id, 0);
             //for each
             for (const track of playlistResponse.data.tracks.items) {

             }
             //list.eventTracks = playlistResponse.data.TrackList;


             await DI.em.persistAndFlush(list);
         }
         //push playlist to Eventlist
         /*let event = await DI.em.findOne(Event, req.params.eventId);
         let eventTracks = await DI.em.find(EventTrack, {event: event});
         if (event) {
             for (const track of list.eventTracks) {


                 // sample code
                 for (const eventTrack of event.eventTracks) {
                     if (eventTrack.track.id == track.id) {
                         const insertEventTrack = new EventTrack(TrackStatus.proposed, track, event);
                         await DI.em.persist(insertEventTrack);
                     }
                 }


             }
             await DI.em.flush();
             //write Track to EventTrack list
             console.log("playlist was added to EventList");
         } else {
             // event was not found
             return res.status(400).json({error: "Did not find Event"});// TODO: rework error
         }
         return res.status(201).json({information: "Track was added to Playlist"});
     }).catch(function (error: Error) {
         return res.status(400).send(error); // TODO: rework error
     });*/
});


/**
 * Fetch/Update Playlist form Spotify
 * **/
router.post('/:playlistId', async (req, res) => {
    axios.get(
        "https://api.spotify.com/v1/playlist/" + req.params.playlistId,
        {
            headers: {
                Authorization: `Bearer ${req.user!.spotifyAccessToken}`,
            },
        }).then(async (playlistResponse) => {
        let playlist = await DI.em.findOne(SpotifyPlaylist, playlistResponse.data.id);
        if (playlist) {
            // update playlist
            playlist.tracks = playlistResponse.data.eventTracks;
            playlist.duration = playlistResponse.data.duration;
            await DI.em.persistAndFlush(playlist);
            return res.status(200).json({error: "updated Playlist"});
        } else {
            // create new playlist
            playlist = new SpotifyPlaylist(
                playlistResponse.data.id,
                playlistResponse.data.duration,
            );
            playlist!.tracks = playlistResponse.data.tracks;
            await DI.em.persistAndFlush(playlist);
            return res.status(201).json({error: "created Playlist"});
        }
    }).catch(function (error: Error) {
        console.log("Spotify Playlist not found");
        console.log(error.message);
        return res.status(400).send(error); // TODO: rework error
    });
});

/**
 * Returns all data of a Playlist.
 * **/
// TODO: spotify access makes no sense, user auth is already handled by middleware in front of /events route, /events/:eventId/playlist also checks for participant access
router.get('/:playlistId', Auth.verifySpotifyAccess, async (req, res) => {
    const list = await DI.em.find(SpotifyPlaylist, {id: req.params.playlistId});
    if (list) return res.status(200).json(list);
    else return res.status(404).json("No Playlist with ID");
});

/**
 * Delete Playlist.
 * **/
// TODO: spotify access makes no sense, user auth is already handled by middleware in front of /events route, /events/:eventId/playlist also checks for participant access
router.delete('/:playlistId', Auth.verifySpotifyAccess, async (req, res) => {
    const playlist = await DI.em.findOne(SpotifyPlaylist,
        {id: req.params.playlistId}, {populate: ["tracks"]}
    );
    if (playlist) {
        for (const track of playlist.tracks) {
            // check if in event
            if (track.eventTracks.length <= 1) await DI.em.remove(track);
        }
        await DI.em.removeAndFlush(playlist);
        return res.status(200).end();
    } else return res.status(404).json("Playlist not found.");

});

export const PlaylistController = router;