import {Router} from "express";
import {DI} from '../index';
import {EventUser, Permission} from "../entities/EventUser";
import {EventSettingsController} from "./events.settings.controller";
import {Event} from "../entities/Event";
import randomstring from "randomstring";
import axios from "axios";
import {EventTrack, TrackStatus} from "../entities/EventTrack";
import {SpotifyTrack} from "../entities/SpotifyTrack";
import {User} from "../entities/User";
import {Auth} from "../middleware/auth.middleware";

const EVENT_ID_LENGTH: number = 6;

const router = Router({mergeParams: true});

router.use("/:eventId/settings", Auth.verifyAdminAccess, EventSettingsController);
router.use("/:eventId/playlist", Auth.verifyParticipantAccess, PlaylistController);

// fetch all events of user
router.get('/', async (req, res) => {
    // TODO: only return events specific to the user

    //const allEvents = await DI.em.find(Event, {});
    //if (allEvents) return res.status(200).json(allEvents);
    //else return res.status(404).json("No Events were found");
});

    //Return all Events
    if (allEvents) return res.status(200).json(allEvents);
    else return res.status(404).json("No Events were found");
});

/**
 * Creates a new event.
 * **/
router.post('/', async (req, res) => {
    const user = await DI.em.findOne(User, {spotifyAccessToken: req.userSpotifyAccessToken});

    

    if (user) {
        let newEventId;
        let event = null;
        do {
            newEventId = randomstring.generate(EVENT_ID_LENGTH);
            event = await DI.em.findOne(Event, {id: newEventId});
        } while (event != null);
        event = new Event(newEventId);
        const eventUser = new EventUser(Permission.OWNER, user, event);
        await DI.em.persist(event);
        await DI.em.persist(eventUser);
        await DI.em.flush();
        res.status(201).json("TODO FORMAT NEW EVENT DATA");// TODO:
    } else res.status(404).send("TODO FORMAT NEW EVENT DATA");// TODO:
});

/**
 * Returns all data of an event.
 * **/
router.get('/:eventId', Auth.verifyGuestAccess, async (req, res) => {
    // TODO: add user to event
    const event = await DI.em.find(Event, {id: req.params.eventId});
    //TODO: currently all fields are returned.....
    if (event) return res.status(200).json(Event);
    else return res.status(404).json("");
});

// leave event (except owner)
router.put('/:eventId', Auth.verifyEventAccess, async (req, res) => {
    if (req.eventUser!.permission == Permission.OWNER)
        return res.status(400).send("Owner cant leave event, delete event instead.");
    await DI.em.removeAndFlush(req.eventUser);
    res.status(200).end();
});

// delete one event
router.delete('/:eventId', Auth.verifyOwnerAccess, async (req, res) => {
    const event = await DI.em.find(Event, {id: req.params.eventId});
    if (event) {
        await DI.em.removeAndFlush(event);
        return res.status(200).end();
    } else return res.status(404).json("Event not found.");
});

/*
* Add Spotify Track to Event
* */
router.get('/:eventId/suggest/:trackId', Auth.verifyParticipantAccess, async (req, res) => {
    axios.get(
        "https://api.spotify.com/v1/tracks" + req.params.trackId,
        {
            headers: {
                Authorization: `Bearer ${req.userSpotifyAccessToken}`,
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

export const EventController = router;
