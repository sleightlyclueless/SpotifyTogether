import {RequestHandler} from "express";
import {DI} from "../index";
import {EventUser, UserStatus} from "../entities/EventUser";

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
            if (eventUser.role == UserStatus.OWNER
                || eventUser.role == UserStatus.ADMIN
                || eventUser.role == UserStatus.PARTICIPANT) next();
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
            if (eventUser.role == UserStatus.OWNER || eventUser.role == UserStatus.ADMIN) next();
            else return res.status(403).send("User not authorized.");
        } else return res.status(401).send("User is not part of this event.");
    }
};

export const EventRoleAuth = {
    verifyGuestAccess,
    verifyParticipantAccess,
    verifyAdminAccess,
};