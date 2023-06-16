import {Router} from "express";
import {DI} from '../index';
import {EventUser, Permission} from "../entities/EventUser";
import {EventSettingsController} from "./events.settings.controller";
import {Event} from "../entities/Event";
import randomstring from "randomstring";
import axios from "axios";
import {EventTrack, TrackStatus} from "../entities/EventTrack";
import {SpotifyTrack} from "../entities/SpotifyTrack";
import {SpotifyPlaylist} from "../entities/SpotifyPlaylist";
import {User} from "../entities/User";
import {Auth} from "../middleware/auth.middleware";

const EVENT_ID_LENGTH: number = 6;

const router = Router({mergeParams: true});

/*
* Get All Playlists
* */
router.get('/', async (req, res) => {
    // Get All Available Events
    const allPlaylists = await DI.em.find(SpotifyPlaylist, {});
    console.log(allPlaylists)

    for (const list of allPlaylists) {
        console.log(list.id);
        console.log(list.TrackList)
        console.log(list.duration)
    }

    //Return all Events
    if (allPlaylists) return res.status(200).json(allPlaylists);
    else return res.status(404).json("No Playlists were found");
});

/*
* Add Spotify Track to Event
* */
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

/** TODO
 * Add Spotify Playlist to Event
 * **/



/**
 * Fetch/Update Playlist form Spotify
 * **/
router.post('/:playlistId', async (req, res) => {
    axios.get(
        "https://api.spotify.com/v1/playlist/"+req.params.playlistId,
        {
            headers: {
                Authorization: `Bearer ${req.user!.spotifyAccessToken}`,
            },
        }).then(async (playlistResponse) => {
        let playlist = await DI.em.findOne(SpotifyPlaylist, playlistResponse.data.id);
        if (playlist) {
            // update playlist
            playlist.TrackList = playlistResponse.data.TrackList;
            playlist.duration = playlistResponse.data.duration;
            await DI.em.persistAndFlush(playlist);
            return res.status(200).json({error: "updated Playlist"});
        } else {
            // create new playlist
            playlist = new SpotifyPlaylist(
                playlistResponse.data.id,
                playlistResponse.data.duration,
            );
            playlist!.TrackList = playlistResponse.data.TrackList;
            await DI.em.persistAndFlush(playlist);
            return res.status(201).json({error:"created Playlist"});
        }
    }).catch(function (error: Error) {
        console.log("Spotify Playlist not found");
        console.log(error.message);
        return res.status(400).send(error); // TODO: rework error
    });
});

/**
 * Returns all data of an Playlist.
 * **/
router.get('/:playlistId', Auth.verifySpotifyAccess, async (req, res) => {
    const list = await DI.em.find(SpotifyPlaylist, {id: req.params.playlistId});
    if (list) return res.status(200).json(list);
    else return res.status(404).json("No Playlist with ID");
});

/**
 * Delete Playlist.
 * **/
/*router.delete('/:playlistId', Auth.verifySpotifyAccess, async (req, res) => {

    const playlist = await DI.em.findOne(SpotifyPlaylist,
        {id: req.params.playlistId}
    );
    const trackPlaylists = await DI.em.find(SpotifyTrack,
        {
    isInPlaylist{id:  req.params.playlistId}
        }
    )
    if (playlist) {
        if (eventUser.permission === Permission.OWNER) {
            const event = await DI.em.find(Event, {id: req.params.eventId});
            if (event) {
                await DI.em.removeAndFlush(event);
                return res.status(200).end();
            } else return res.status(404).json("Event not found.");
        } else return res.status(401).json("You are not the owner of this event.");
    } else return res.status(404).json("User is not part of this event");
});*/

export const PlaylistController = router;
