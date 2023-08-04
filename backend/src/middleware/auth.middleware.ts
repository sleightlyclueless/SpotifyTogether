import { NextFunction, Request, RequestHandler, Response } from "express";
import { DI } from "../index";
import { User } from "../entities/User";
import { Permission } from "../entities/EventUser";

// prepare check for existing user with valid spotify access_token
const prepareUserAuthentication = async (req: Request, _res: Response, next: NextFunction) => {
    const userID = req.get('Authorization');
    if (userID) {
        const user = await DI.em.findOne(User, {userid: userID});
        if (user && Date.now() <= user.issuedAt + user.expiresInMs) req.user = user;
        else req.user = null;
    } else req.user = null;
    next();
};

// checks if user is logged in with a valid spotify access_token
const verifySpotifyAccess: RequestHandler = (req, res, next) => {
    if (req.user == null)
        return res.status(401).json({errors: ["verifySpotifyAccess(): You don't have access"]});
    next();
};

// check whether if the user is part of this event
const verifyEventAccess: RequestHandler = (req, res, next) => {
    if(req.eventUser == null)
        return res.status(403).json({errors: ["verifyEventAccess(): You don't have access"]});
    next();
};

// checks if user is at least a participant
const verifyEventAndParticipantAccess: RequestHandler = async (req, res, next) => {
    if(req.eventUser == null)
        return res.status(403).json({errors: ["verifyEventAndParticipantAccess(): You don't have access"]});
    if(castPermissionToInt(req.eventUser.permission.toLowerCase()) < castPermissionToInt(Permission.PARTICIPANT))
        return res.status(403).json({errors: ["verifyEventAndParticipantAccess(): Insufficient access rights."]});
    next();
};

// checks if user is at least a admin
const verifyEventAndAdminAccess: RequestHandler = async (req, res, next) => {
    if(req.eventUser == null)
        return res.status(403).json({errors: ["verifyEventAndAdminAccess(): You don't have access"]});
    if (castPermissionToInt(req.eventUser.permission.toLowerCase()) < castPermissionToInt(Permission.ADMIN))
        return res.status(403).json({errors: ["verifyEventAndAdminAccess(): Insufficient access rights."]});
    next();
};

// checks if user is the owner
const verifyEventAndOwnerAccess: RequestHandler = async (req: Request, res, next) => {
    if(req.eventUser == null)
        return res.status(403).json({errors: ["verifyEventAndOwnerAccess(): You don't have access"]});
    if(castPermissionToInt(req.eventUser.permission.toLowerCase()) < castPermissionToInt(Permission.OWNER))
        return res.status(403).json({errors: ["verifyEventAndOwnerAccess(): Insufficient access rights."]});
    next();
};

// checks if user is at least a participant and event is not locked
const verifyUnlockedEvent: RequestHandler = async (req, res, next) => {
    if (req.eventUser == null || req.event == null)
        return res.status(403).json({errors: ["verifyUnlockedEvent(): Missing event authentication."]});
    if (req.event!.locked)
        return res.status(403).json({errors: ["verifyUnlockedEvent(): Event locked for participant."]});
    next();
};

export const Auth = {
    prepareUserAuthentication,
    verifySpotifyAccess,
    verifyEventAccess,
    verifyEventAndParticipantAccess,
    verifyEventAndAdminAccess,
    verifyEventAndOwnerAccess,
    verifyUnlockedEvent,
};

function castPermissionToInt(permission: string): number {
    switch (permission.toLowerCase()) {
        case "owner": return 4;
        case "admin": return 3;
        case "participant": return 2;
        case "guest": return 1;
        default: return 0;
    }
}