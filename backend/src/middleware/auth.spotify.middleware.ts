import {NextFunction, Request, RequestHandler, Response} from "express";
import {DI} from "../index";
import {User} from "../entities/User";

const prepareAuthentication = async (req: Request, _res: Response, next: NextFunction) => {
    const spotifyToken = req.get('Authorization');
    if (spotifyToken) req.user = await DI.em.findOne(User, {spotifyAccessToken: spotifyToken});
    else req.user = null;
    next();
};

const verifyAccess: RequestHandler = (req, res, next) => {
    if (!req.user) return res.status(401).json({errors: [`You don't have access`]});
    next();
};

export const SpotifyAuth = {
    prepareAuthentication,
    verifyAccess,
};