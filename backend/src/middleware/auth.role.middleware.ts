import {RequestHandler} from "express";
import {DI} from "../index";
import {EventUser, Permission} from "../entities/EventUser";

// TODO: verify middleware is working

const verifyGuestAccess: RequestHandler = async (req, res, next) => {
    if (req.params.eventId != undefined) {
        const eventUser = await DI.em.findOne(EventUser,
            {
                event: {id: req.params.eventId},
                user: {spotifyAccessToken: req.userSpotifyAccessToken}
            }
        );
        if (eventUser) next();
        else return res.status(401).send("User is not part of this event.");
    }
};

const verifyParticipantAccess: RequestHandler = async (req, res, next) => {
    if (req.params.eventId != undefined) {
        const eventUser = await DI.em.findOne(EventUser,
            {
                event: {id: req.params.eventId},
                user: {spotifyAccessToken: req.userSpotifyAccessToken}
            }
        );
        if (eventUser) {
            if (eventUser.role == Permission.OWNER
                || eventUser.role == Permission.ADMIN
                || eventUser.role == Permission.PARTICIPANT) next();
            else return res.status(403).send("User not authorized.");
        } else return res.status(401).send("User is not part of this event.");
    }
};

const verifyAdminAccess: RequestHandler = async (req, res, next) => {
    if (req.params.eventId != undefined) {
        const eventUser = await DI.em.findOne(EventUser,
            {
                event: {id: req.params.eventId},
                user: {spotifyAccessToken: req.userSpotifyAccessToken}
            }
        );
        if (eventUser) {
            if (eventUser.role == Permission.OWNER || eventUser.role == Permission.ADMIN) next();
            else return res.status(403).send("User not authorized.");
        } else return res.status(401).send("User is not part of this event.");
    }
};

export const EventRoleAuth = {
    verifyGuestAccess,
    verifyParticipantAccess,
    verifyAdminAccess,
};