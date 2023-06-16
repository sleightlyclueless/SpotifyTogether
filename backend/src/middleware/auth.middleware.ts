import {NextFunction, Request, RequestHandler, Response} from "express";
import {DI} from "../index";
import {User} from "../entities/User";
import {EventUser, Permission} from "../entities/EventUser";
import {bool} from "yup";

// checks for existing user with valid spotify access_token
const prepareAuthentication = async (req: Request, _res: Response, next: NextFunction) => {
    const spotifyToken = req.get('Authorization');
    if (spotifyToken) {
        const user = await DI.em.findOne(User, {spotifyAccessToken: spotifyToken});
        if (user && Date.now() <= user.issuedAt + user.expiresInMs) req.user = user;
        else req.user = null;
    } else req.user = null;
    next();
};

const verifySpotifyAccess: RequestHandler = (req, res, next) => {
    if (req.user === null) return res.status(401).json({errors: [`You don't have access`]});
    next();
};

const verifyGuestAccess: RequestHandler = async (req, res, next) => {
    if (req.params.eventId != undefined) {
        const eventUser = await DI.em.findOne(EventUser,
            {
                event: {id: req.params.eventId},
                user: {spotifyAccessToken: req.userSpotifyAccessToken}
            }
        );
        if (eventUser) {
            console.log(eventUser.permission >= Permission.PARTICIPANT);
            next();
        } else return res.status(401).send("User is not part of this event.");
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
            if (eventUser.permission == Permission.OWNER
                || eventUser.permission == Permission.ADMIN
                || eventUser.permission == Permission.PARTICIPANT) next();
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
            if (eventUser.permission == Permission.OWNER || eventUser.permission == Permission.ADMIN) next();
            else return res.status(403).send("User not authorized.");
        } else return res.status(401).send("User is not part of this event.");
    }
};

export const Auth = {
    prepareAuthentication,
    verifySpotifyAccess,
    verifyGuestAccess,
    verifyParticipantAccess,
    verifyAdminAccess,
};
