import {Router} from "express";
import {DI} from '../index';
import {EventUser, Permission} from "../entities/EventUser";
import {EventSettingsController} from "./events.settings.controller";
import {Event} from "../entities/Event";
import randomstring from "randomstring";
import {Auth} from "../middleware/auth.middleware";
import {PlaylistController} from "./playlist.spotify.controller";

const EVENT_ID_LENGTH: number = 6;
const MAX_EVENT_ID_GENERATION_RETRIES: number = 100;

const router = Router({mergeParams: true});

router.use(Auth.prepareEventAuthentication);

router.use("/:eventId/settings", Auth.verifyAdminAccess, EventSettingsController);
router.use("/:eventId/playlist", Auth.verifyParticipantAccess, PlaylistController);

// fetch all events of user
router.get('/', async (req, res) => {
    // TODO: only return events specific to the user

    //const allEvents = await DI.em.find(Event, {});
    //if (allEvents) return res.status(200).json(allEvents);
    //else return res.status(404).json("No Events were found");
});

// create a new event
router.post('/', async (req, res) => {
    // generate random string as eventId
    let newEventId;
    let event = null;
    let retries = 0;
    do {
        retries++;
        newEventId = randomstring.generate(EVENT_ID_LENGTH);
        event = await DI.em.findOne(Event, {id: newEventId});
    } while (event != null || retries >= MAX_EVENT_ID_GENERATION_RETRIES);

    // Failed to generate unique id, return internal server error
    if(retries >= MAX_EVENT_ID_GENERATION_RETRIES && event != null) res.status(500).end();

    // create event & add user as owner
    event = new Event(newEventId);
    const eventUser = new EventUser(Permission.OWNER, req.user!, event);
    await DI.em.persist(event).persist(eventUser).flush();
    // TODO: return formatted event data
    res.status(201).json("data");
});

// fetch all data from one event
router.get('/:eventId', async (req, res) => {
    const event = await DI.em.findOne(Event, {id: req.params.eventId});
    if(event) {
        // add user if not already existing
        if(req.eventUser == null) await DI.em.persistAndFlush(new EventUser(Permission.PARTICIPANT, req.user!, event));

        // fetch event data
        // TODO: return formatted event data
        return res.status(200).json(event);
    } else return res.status(404).send("Event not found");
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

export const EventController = router;
