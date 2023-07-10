import {Router} from "express";
import {Auth} from "../middleware/auth.middleware";
import {DI} from "../index";
import {Event} from "../entities/Event";
import randomstring from "randomstring";
import {EVENT_ID_LENGTH, MAX_EVENT_ID_GENERATION_RETRIES} from "./event.controller";

const router = Router({mergeParams: true});

// TODO: check which access permission should be used for the methods

router.put('/generateNewId', Auth.verifyEventOwnerAccess, async (req, res) => {
    let newEventId;
    let event = null;
    let retries = 0;
    do {
        retries++;
        newEventId = randomstring.generate(EVENT_ID_LENGTH);
        event = await DI.em.findOne(Event, {id: newEventId});
    } while (event != null || retries >= MAX_EVENT_ID_GENERATION_RETRIES);

    // Failed to generate unique id, return internal server error
    if (retries >= MAX_EVENT_ID_GENERATION_RETRIES && event != null) res.status(500).end();

    req.event!.id = newEventId;
    await DI.em.persistAndFlush(req.event!);
    return res.status(200).end();
});

//set custom ID
router.put('/id/:newId', Auth.verifyEventOwnerAccess, async (req, res) => {
    if (req.params.newId.length != EVENT_ID_LENGTH)
        return res.status(400).send("Id is not " + EVENT_ID_LENGTH + " long.");

    let event = await DI.em.findOne(Event, {id: req.params.newId});
    if (!event)
        return res.status(400).send("Another event already uses this id.");

    req.event!.id = req.params.newId;
    await DI.em.persistAndFlush(req.event!);
    return res.status(200).end();

});

//change event name
router.put('/name/:newName', Auth.verifyEventOwnerAccess, async (req, res) => {
    req.event!.name = req.params.newName;
    await DI.em.persistAndFlush(req.event!);
    return res.status(200).end();
});

// change event date
router.put('/date/:newDate', Auth.verifyEventOwnerAccess, async (req, res) => {
    // cast string to Date
    let timestamp = Date.parse(req.params.newDate);
    if (!isNaN(timestamp)) return res.status(400).end("Provided string is not a valid date.");

    // update date
    req.event!.date = new Date(timestamp);
    await DI.em.persistAndFlush(req.event!);
    return res.status(200).end();
});

// close event for new entries
router.put('/lock', Auth.verifyEventOwnerAccess, async (req, res) => {
    req.event!.locked = true;
    await DI.em.persistAndFlush(req.event!);
    return res.status(200).end();
});

// open event for new entries
router.put('/unlock', Auth.verifyEventOwnerAccess, async (req, res) => {
    req.event!.locked = false;
    await DI.em.persistAndFlush(req.event!);
    return res.status(200).end();
});

export const EventSettingsController = router;