import {RequestHandler} from "express";
import {DI} from "../index";
import {EventUser} from "../entities/EventUser";

const verifyParticipantAccess: RequestHandler = async (req, res, next) => {
    console.log("check participant access rights");
    console.log(req.params);
    const eventUser = await DI.em.findOne(EventUser,
        {
            event: {id: req.params.eventId},
            user: {spotifyAccessToken: req.userSpotifyAccessToken}
        }
    );
    next();
};

const verifyAdminAccess: RequestHandler = (req, res, next) => {
    // TODO: implement
    console.log("check admin access rights");
    next();
};

export const EventRoleAuth = {
    verifyParticipantAccess,
    verifyAdminAccess,
};