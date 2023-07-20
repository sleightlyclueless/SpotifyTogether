import {Router} from "express";
import {DI} from "../index";
import {Event} from "../entities/Event";
import randomstring from "randomstring";
import {EVENT_ID_LENGTH, MAX_EVENT_ID_GENERATION_RETRIES} from "./event.controller";

const router = Router({mergeParams: true});

router.put('/generateNewId', async (req, res) => {
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
router.put('/id/:newId', async (req, res) => {
    if (req.params.newId.length != EVENT_ID_LENGTH)
        return res.status(400).send({message: "Id is not " + EVENT_ID_LENGTH + " long."});

    let event = await DI.em.findOne(Event, {id: req.params.newId});
    if (event)
        return res.status(400).json({message: "Another event already uses this id."});

    req.event!.id = req.params.newId;
    await DI.em.persistAndFlush(req.event!);
    return res.status(200).end();

});

//change event name
router.put('/name/:newName', async (req, res) => {
    req.event!.name = req.params.newName;
    await DI.em.persistAndFlush(req.event!);
    return res.status(200).end();
});

// change event date
router.put('/date/:newDate', async (req, res) => {
    // cast string to Date
    console.log("1" + req.params.newDate);
    let timestamp = Date.parse(req.params.newDate);
    console.log("2" + timestamp);
    if (isNaN(timestamp)) return res.status(400).json({message: "Provided string is not a valid date."});

    // update date
    req.event!.date = new Date(timestamp);
    console.log(req.event!.date);
    await DI.em.persistAndFlush(req.event!);
    return res.status(200).end();
});

// close event for new entries
router.put('/lock', async (req, res) => {
    req.event!.locked = true;
    await DI.em.persistAndFlush(req.event!);
    return res.status(200).end();
});

// open event for new entries
router.put('/unlock', async (req, res) => {
    req.event!.locked = false;
    await DI.em.persistAndFlush(req.event!);
    return res.status(200).end();
});

export const EventSettingsController = router;