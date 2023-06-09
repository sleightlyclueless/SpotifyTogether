import {Router} from "express";
import {DI} from '../index';
import {Auth} from "../middleware/auth.middleware";
import {UserStatus} from "../entities/EventUser";

const router = Router({mergeParams: true});

//router.use("/edit", Authge, handler)

/*router.get('/:eventId', async (req, res) => {

        DI.EventRepository.find({
            Event: {"EventID": Number(req.params.id)},
        }).then(Event => {
            return res.status(200).json(Event);
        }).catch(reason => {
            return res.status(400).json({message: reason});

    });

});*/

router.post('/:eventId/join/:spotifyToken', async (req, res) => {
    res.status(200).send("Hello World !"); // returns all information for one event
});

router.post('/:eventId/leave/:spotifyToken', async (req, res) => {
    res.status(200).send("Hello World !"); // returns all information for one event
});

/*router.post('/:spotifyToken/create', Auth.optionalAuthenticate, async (req, res) => {
    res.status(200).send("Hello World !");
});

router.post('/:eventId/delete/:spotifyToken', Auth.optionalAuthenticate, async (req, res) => {
    res.status(200).send("Hello World !");
});*/

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

/*
    User of Event
*/

// Show Users of Event
router.get('/events/:userToken/:eventToken/settings/participants', async (req, res) => {
    DI.eventUserRepository.find({
        Event: {"EventID": Number(req.params.eventToken)},
        User: req.params.userToken
    }).then(eventUsers => {
        return res.status(200).json(eventUsers);
    }).catch(reason => {
        return res.status(400).json({message: reason});
    })
});

// Kick User out of Event
router.put('/events/:userToken/:eventToken/settings/participants/:targetUserToken', async (req, res) => {
    DI.eventUserRepository.nativeDelete({
        Event: {"EventID": Number(req.params.eventToken)},
        User: req.params.userToken
    }).then(value => {
        if (value > 1)
            return res.status(200);
        else
            return res.status(404);
    }).catch(reason => {
        return res.status(400).json({message: reason});
    });
});

// Change user role
router.put('/events/:userToken/:eventToken/settings/participants/:targetUserToken/:roleId', async (req, res) => {
    DI.eventUserRepository.nativeUpdate({
        Event: {"EventID": Number(req.params.eventToken)},
        User: req.params.userToken
    }, {
        Role: req.params.roleId as UserStatus
    }).then(value => {
        if (value > 1)
            return res.status(200);
        else
            return res.status(404);
    }).catch(reason => {
        return res.status(400).json({message: reason});
    });
});*/

export const EventController = router;
