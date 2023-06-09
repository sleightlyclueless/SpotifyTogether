import {Router} from "express";
import {DI} from '../index';
import {Auth} from "../middleware/auth.middleware";
import {UserStatus} from "../entities/EventUser";
import {User} from "../entities/User";

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
    // find User with :spotify-token
   /* const existingUser = await DI.UserRepository.find({
        User: {"SpotifyToken": req.params.spotifyToken},
    });
    if (!existingUser) {
        return res.status(403).json({errors: [`Didnt find User with given SpotifyToken`]});
    }
    // find Event with :EventID
    const existingEvent = await DI.EventRepository.find({
        Event: {"id": req.params.eventId},
    });
    if (!existingEvent) {
        return res.status(403).json({errors: [`Didnt find Event with given EventID`]});
    }

    // wäre geil wenn das funktionieren würde
    await DI.EventRepository.existingEvent.UserList.add(existingUser).flush();

    res.status(200).send("added User to Event !");
    */
});

router.post('/:eventId/leave/:spotifyToken', async (req, res) => {
    // find User with :spotify-token
    /* const existingUser = await DI.UserRepository.find({
         User: {"SpotifyToken": req.params.spotifyToken},
     });
     if (!existingUser) {
         return res.status(403).json({errors: [`Didnt find User with given SpotifyToken`]});
     }
     // find Event with :EventID
     const existingEvent = await DI.EventRepository.find({
         Event: {"id": req.params.eventId},
     });
     if (!existingEvent) {
         return res.status(403).json({errors: [`Didnt find Event with given EventID`]});
     }

     // wäre geil wenn das funktionieren würde
     await DI.EventRepository.existingEvent.UserList.remove(existingUser).flush();

     res.status(200).send("removed User from Event !");
     */
});

/*router.post('/:spotifyToken/create', Auth.optionalAuthenticate, async (req, res) => {
    res.status(200).send("Hello World !");
});

router.post('/:eventId/delete/:spotifyToken', Auth.optionalAuthenticate, async (req, res) => {
    res.status(200).send("Hello World !");
});*/

router.get('/:spotifyToken/list', async (req, res) => {
    /*
    // Entry laden
    const existingEntry = await DI.UserRepository.find({
        User: req.params.spotifyToken
    });
    if (!existingEntry) {
        return res.status(403).json({errors: [`No User with Token found`]});
    }
    await DI.UserRepository.populate(User, { populate: ['User.EventList'] });
    return res.status(200).json(existingEntry); //returns User with Populated EventList
      */
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
/*router.get('/events/:userToken/:eventToken/settings/participants', async (req, res) => {
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

    //------Björn hat neu gemacht
    // Entry laden
    const existingEntry = await DI.eventUserRepository.find({
        Event: {"EventID": Number(req.params.eventToken)},
        User: req.params.userToken
    });
    if (!existingEntry) {
        return res.status(403).json({errors: [`You can't delete this id`]});
    }
    await DI.eventUserRepository.remove(existingEntry).flush();
    return res.status(204).send({});

    //------- bis hier

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

    //------Björn hat neu gemacht
    // Entry laden
    const existingEntry = await DI.eventUserRepository.find({
        Event: {"EventID": Number(req.params.eventToken)},
        User: req.params.userToken
    });
    if (!existingEntry) {
        return res.status(403).json({errors: [`You can't update this id; no entry`]});
    }else{
        existingEntry.User.Role: req.params.roleId as UserStatus
    }


    await DI.eventUserRepository.update(existingEntry).flush();
    return res.status(200.send({});

    //------- bis hier


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
