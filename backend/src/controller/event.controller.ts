import {Router} from "express";
import {DI} from '../index';
import {EventUser, UserStatus} from "../entities/EventUser";
import {EventSettingsController} from "./events.settings.controller";
import {EventRoleAuth} from "../middleware/auth.role.middleware";
import {Event} from "../entities/Event";
import randomstring from "randomstring";
import axios from "axios";
import {EventTrack, TrackStatus} from "../entities/EventTrack";
import {SpotifyTrack} from "../entities/SpotifyTrack";
import {User} from "../entities/User";

const EVENT_ID_LENGTH: number = 6;

const router = Router({mergeParams: true});

router.use("/:eventId/settings", EventRoleAuth.verifyAdminAccess, EventSettingsController);

/*
* Get All events
* */
router.get('/', async (req, res) => {
    // Get All Available Events
    const allEvents = await DI.em.find(Event,{});
    console.log(allEvents)

    for (const event of allEvents) {
        console.log(event.id);
        console.log(event.UserList)
        console.log(event.duration)
        console.log(event.TrackList)
    }

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
        const eventUser = new EventUser(UserStatus.OWNER, user, event);
        await DI.em.persist(event);
        await DI.em.persist(eventUser);
        await DI.em.flush();
        res.status(201).json("TODO FORMAT NEW EVENT DATA");// TODO:
    } else res.status(404).send("TODO FORMAT NEW EVENT DATA");// TODO:
});

/**
 * Returns all data of an event.
 * **/
router.get('/:eventId', EventRoleAuth.verifyGuestAccess, async (req, res) => {
    // TODO: add user to event
    const event = await DI.em.find(Event, {id: req.params.eventId});
    //TODO: currently all fields are returned.....
    if (event) return res.status(200).json(Event);
    else return res.status(404).json("");
});

/**
 * Removes the user form the event.
 * Owner can not leave event. He should delete instead.
 * **/
router.put('/:eventId', EventRoleAuth.verifyGuestAccess, async (req, res) => {
    const eventUser = await DI.em.findOne(EventUser,
        {
            event: {id: req.params.eventId},
            user: {spotifyAccessToken: req.userSpotifyAccessToken}
        }
    );
    if (eventUser) {
        if (eventUser.role != UserStatus.OWNER) {
            await DI.em.removeAndFlush(eventUser);
            res.status(200).json("todo data");
        }
        else res.status(400).send("Owner cant leave event, delete event instead.");
    } else res.status(404).send("User not part of event.");
});

/**
 * Delete event.
 * **/
router.delete('/:eventId', EventRoleAuth.verifyGuestAccess, async (req, res) => {
    const eventUser = await DI.em.findOne(EventUser,
        {
            event: {id: req.params.eventId},
            user: {spotifyAccessToken: req.userSpotifyAccessToken}
        }
    );
    if (eventUser) {
        if(eventUser.role === UserStatus.OWNER) {
            const event = await DI.em.find(Event, {id: req.params.eventId});
            if (event) {
                await DI.em.removeAndFlush(event);
                return res.status(200).end();
            } else return res.status(404).json("Event not found.");
        } else return res.status(401).json("You are not the owner of this event.");
    } else return res.status(404).json("User is not part of this event");
});

/*
* Add Spotify Track to Event
* */
router.get('/:eventId/suggest/:trackId', EventRoleAuth.verifyParticipantAccess, async (req, res) => {
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
