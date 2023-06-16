import {NextFunction, Request, RequestHandler, Response} from "express";
import {DI} from "../index";
import {User} from "../entities/User";
import {EventUser, Permission} from "../entities/EventUser";

// prepare check for existing user with valid spotify access_token
const prepareUserAuthentication = async (req: Request, _res: Response, next: NextFunction) => {
    const spotifyToken = req.get('Authorization');
    if (spotifyToken) {
        const user = await DI.em.findOne(User, {spotifyAccessToken: spotifyToken});
        if (user && Date.now() <= user.issuedAt + user.expiresInMs) req.user = user;
        else req.user = null;
    } else req.user = null;
    next();
};

// prepare check if user is part of event
const prepareEventAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user == null)
        return res.status(403).json({errors: ["You don't have access"]});
    if (req.params.eventId != undefined) {
        const eventUser = await DI.em.findOne(EventUser,
            {
                event: {id: req.params.eventId},
                user: {spotifyAccessToken: req.user.spotifyAccessToken}
            }
        );
        if (eventUser) req.eventUser = eventUser;
        else req.eventUser = null;
    }
    next();
};

// checks if user is logged in with a valid spotify access_token
const verifySpotifyAccess: RequestHandler = (req, res, next) => {
    if (req.user == null)
        return res.status(401).json({errors: ["You don't have access"]});
    next();
};

// check whether if the user is part of this event
const verifyEventAccess: RequestHandler = (req, res, next) => {
    if(req.eventUser == null)
        return res.status(403).json({errors: ["You don't have access"]});
    next();
};


const verifyParticipantAccess: RequestHandler = async (req, res, next) => {
    if(req.eventUser == null)
        return res.status(403).json({errors: ["You don't have access"]});
    if(req.eventUser.permission >= Permission.PARTICIPANT)
        return res.status(403).json({errors: ["You must be at least a participant."]});
    next();
};

const verifyAdminAccess: RequestHandler = async (req, res, next) => {
    if(req.eventUser == null)
        return res.status(403).json({errors: ["You don't have access"]});
    if(req.eventUser.permission >= Permission.ADMIN)
        return res.status(403).json({errors: ["You must be at least a participant."]});
    next();
};

const verifyOwnerAccess: RequestHandler = async (req, res, next) => {
    if(req.eventUser == null)
        return res.status(403).json({errors: ["You don't have access"]});
    if(req.eventUser.permission >= Permission.OWNER)
        return res.status(403).json({errors: ["You must be at least a participant."]});
    next();
};

export const Auth = {
    prepareUserAuthentication,
    prepareEventAuthentication,
    verifySpotifyAccess,
    verifyEventAccess,
    verifyParticipantAccess,
    verifyAdminAccess,
    verifyOwnerAccess,
};
