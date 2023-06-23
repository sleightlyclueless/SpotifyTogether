import express, {Router} from "express";
import {DI} from "../index";
import {EventUser, Permission} from "../entities/EventUser";
import {TrackStatus} from "../entities/EventTrack";

const router = Router({mergeParams: true});

// fetch event participants
router.get('/', async (req: express.Request<{ eventId: string }>, res) => {
    const allUsers = await DI.em.find(EventUser,
        {
            event: {id: req.params.eventId},
            user: {spotifyAccessToken: req.user!.spotifyAccessToken}
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
    } else return res.status(400).json({error: "Did not find EventUsers"});// TODO: rework error
});

// kick user out of event
router.put('/:spotifyUserId', async (req: express.Request<{
    eventId: string,
    spotifyUserId: string
}>, res) => {
    const targetUser = await DI.em.findOne(EventUser, {
        user: {spotifyId: req.params.spotifyUserId},
        event: {id: req.params.eventId}
    });
    if (targetUser) {
        if (targetUser.permission == Permission.OWNER)
            return res.status(400).json({errors: "Owner cant be kicked."});
        if (targetUser.permission == Permission.ADMIN && req.eventUser!.permission == Permission.ADMIN)
            return res.status(403).json({errors: "Admins cant kick other admins."});
        await DI.em.removeAndFlush(targetUser);
        return res.status(204).send("User successfully removed.");
    } else return res.status(404).json({errors: "The target user was not found."});
});

// change user permissions
router.put('/:spotifyUserId/:permissions', async (req: express.Request<{
    eventId: string,
    spotifyUserId: string,
    permissions: Permission
}>, res) => {
    const requestingUser = req.eventUser!;
    const targetUser = await DI.em.findOne(EventUser, {
        user: {spotifyId: req.params.spotifyUserId},
        event: {id: req.params.eventId}
    });
    if (targetUser) {
        if (targetUser.permission == Permission.OWNER)
            return res.status(400).json({errors: "Owner cant be modified."});
        if (targetUser.permission == Permission.ADMIN && requestingUser.permission == Permission.ADMIN)
            return res.status(403).json({errors: "Admins cant be updated by other Admins."});
        const newPermissions = TrackStatus[req.params.permissions.toUpperCase() as keyof typeof TrackStatus];
        if (newPermissions != undefined) {
            targetUser.permission = req.params.permissions;
            await DI.em.persistAndFlush(targetUser);
            return res.status(204).send({errors: "User successfully updated."});
        } else res.status(400).send("Failed to cast status to enum type.");
    } else return res.status(404).json({errors: "The target user was not found."});
});

export const EventParticipantsController = router;