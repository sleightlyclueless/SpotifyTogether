import {NextFunction, Request, RequestHandler, Response} from "express";







const prepareAuthentication = async (req: Request, _res: Response, next: NextFunction) => {
    console.log("Spotify Authentication");

    const authHeader = req.get('Authorization');

    if (authHeader) {
        try {
            // verify if spotify token is still valid
            // case 1: valid -> next()
            // case 2: invalid -> else





        } catch (e) {
            console.error(e);
        }
    } else {
        req.user = null;
        req.token = null;
    }

    next();
};



const verifyAccess: RequestHandler = (req, res, next) => {
    console.log("Check if spotify user logged in");
    /*if (!req.user) {
        return res.status(401).json({errors: [`You don't have access`]});
    }*/
    next();
};



// exports
export const SpotifyAuth = {
    prepareAuthentication,
    verifyAccess,
};
