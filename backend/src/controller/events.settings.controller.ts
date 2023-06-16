import express, {Router} from "express";
import {DI} from "../index";
import {EventUser, Permission} from "../entities/EventUser";
import {EventRoleAuth} from "../middleware/auth.role.middleware";

type EventRequest= express.Request<{ eventId: string }>;

const router = Router({mergeParams: true});

// /events/asdiufh/settings/participants

/*
* Get Participants of Event
* */
router.get('/participants', async (req: EventRequest, res) => {
    console.log(req.params.eventId);

    const allUsers = await DI.em.find(EventUser,
        {
            event: {id: req.params.eventId},
            user: {spotifyAccessToken: req.userSpotifyAccessToken}
        });
    if (allUsers) {
        //event was found
        for (const user of allUsers) {
            console.log(user.user.spotifyId);
            console.log(user.permission);
            // TODO: name, img
        }
        console.log("EventUsers found");
        return res.status(200).json({allUsers});
    } else {
        // event was not found
        return res.status(400).json({error: "Did not find EventUsers"});// TODO: rework error
    }
});


// Kick User out of Event
router.put('/participants/:spotifyUserId', async (req: express.Request<{
    eventId: string,
    spotifyUserId: string
}>, res) => {
    const requestingUser = await DI.em.findOne(EventUser, {
        user: {spotifyAccessToken: req.userSpotifyAccessToken},
        event: {id: req.params.eventId}
    });
    if (requestingUser) {
        const targetUser = await DI.em.findOne(EventUser, {
            user: {spotifyId: req.params.spotifyUserId},
            event: {id: req.params.eventId}
        });
        if (targetUser) {
            if (targetUser.permission == Permission.OWNER) return res.status(403).json({errors: "Owner cant be kicked."});
            if (targetUser.permission == Permission.ADMIN && requestingUser.permission == Permission.ADMIN)
                return res.status(403).json({errors: "Admins cant be kicked."});
            await DI.em.removeAndFlush(targetUser);
            return res.status(204).send({errors: "User successfully Removed."});
        } else return res.status(404).json({errors: "The target user was not found."});
    } else return res.status(404).json({errors: "The requesting user was not found."});
});

// Change user role
router.put('/participants/:spotifyUserId/:permissions', async (req: express.Request<{
    eventId: string,
    spotifyUserId: string,
    permissions: Permission
}>, res) => {

    const requestingUser = await DI.em.findOne(EventUser, {
        user: {spotifyAccessToken: req.userSpotifyAccessToken},
        event: {id: req.params.eventId}
    });
    if (requestingUser) {
        const targetUser = await DI.em.findOne(EventUser, {
            user: {spotifyId: req.params.spotifyUserId},
            event: {id: req.params.eventId}
        });
        if (targetUser) {
            if (targetUser.permission == Permission.OWNER) return res.status(403).json({errors: "Owner cant be modified."});
            if (targetUser.permission == Permission.ADMIN && requestingUser.permission == Permission.ADMIN)
                return res.status(403).json({errors: "Admins cant be updated by other Admins."});
            // TODO: how about some type checking ??? permissions can be any string lol
            targetUser.permission = req.params.permissions;
            await DI.em.persistAndFlush(targetUser);
            return res.status(204).send({errors: "User successfully updated."});
        } else return res.status(404).json({errors: "The target user was not found."});
    } else return res.status(404).json({errors: "The requesting user was not found."});
});

export const EventSettingsController = router;