import {Router} from "express";

const router = Router({mergeParams: true});

router.use("/edit", Authge, handler)

router.get('/:eventId', async (req, res) => {
    res.status(200).send("Hello World !"); // returns all information for one event
});

router.post('/:eventId/join/:spotifyToken', async (req, res) => {
    res.status(200).send("Hello World !"); // returns all information for one event
});

router.post('/:eventId/leave/:spotifyToken', async (req, res) => {
    res.status(200).send("Hello World !"); // returns all information for one event
});

router.post('/:spotifyToken/create',  Auth.optionalAuthenticate, async (req, res) => {
    res.status(200).send("Hello World !");
});

router.post('/:eventId/delete/:spotifyToken',  Auth.optionalAuthenticate, async (req, res) => {
    res.status(200).send("Hello World !");
});

router.get('/:spotifyToken/list', async (req, res) => {
    res.status(200).send("Hello World !"); // returns list of events
});


router.get('/:eventId/settings/', async (req, res) => {
    res.status(200).send("Hello World !"); // returns list of events
});

router.get('/:eventId/settings/', async (req, res) => {
    res.status(200).send("Hello World !"); // returns list of events
});

router.get('/:eventId/settings/suggestions/', async (req, res) => {
    res.status(200).send("Hello World !"); // returns list of events
});

router.get('/:eventId/settings/participants/', async (req, res) => {
    res.status(200).send("Hello World !"); // returns list of events
});



export const EventController = router;