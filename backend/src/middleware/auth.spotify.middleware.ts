import {NextFunction, Request, RequestHandler, Response} from "express";
import {DI} from "../index";
import {User} from "../entities/User";

const prepareAuthentication = async (req: Request, _res: Response, next: NextFunction) => {
    const spotifyToken = req.get('Authorization');
    if (spotifyToken) {
        const user = await DI.em.findOne(User, {spotifyAccessToken: spotifyToken});
        if (user) req.userSpotifyAccessToken = spotifyToken;
        else req.userSpotifyAccessToken = null;
    } else req.userSpotifyAccessToken = null;
    next();
};

const verifyAccess: RequestHandler = (req, res, next) => {
    if (req.userSpotifyAccessToken === null) return res.status(401).json({errors: [`You don't have access`]});
    next();
};

export const SpotifyAuth = {
    prepareAuthentication,
    verifyAccess,
};