import express from 'express';
import http from 'http';
import {EntityManager, MikroORM, RequestContext} from '@mikro-orm/core';
import {Auth} from "./middleware/auth.middleware";
import {EventController} from "./controller/event.controller";
import {SpotifyAuthController} from "./controller/auth.spotify.controller";
import cors from "cors";

const PORT = 4000;// TODO: move into env file
const app = express();

// TODO: move into env file
const SPOTIFY_CLIENT_ID = "f24ef133eb1847d089085909d8891e07";
const SPOTIFY_CLIENT_SECRET = "d1119429c435479bb4a4c969eea3748c";
const SPOTIFY_REDIRECT_URI = "http://localhost:4000/account/login_response";

export const DI = {} as {
    server: http.Server;
    orm: MikroORM;
    em: EntityManager;
    spotifyClientId: string;
    spotifyClientSecret: string;
    spotifyRedirectUri: string,
};

export const initializeServer = async () => {
    // dependency injection setup
    DI.orm = await MikroORM.init();
    DI.em = DI.orm.em;
    DI.spotifyClientId = SPOTIFY_CLIENT_ID;
    DI.spotifyClientSecret = SPOTIFY_CLIENT_SECRET;
    DI.spotifyRedirectUri = SPOTIFY_REDIRECT_URI;

    app.all('/*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });
    app.use(cors({
        origin: '*', preflightContinue: true, optionsSuccessStatus: 200
    }));

    // example middleware
    app.use((req, res, next) => {
        console.info(`New request to ${req.path}`);
        next();
    });

    // global middleware
    app.use(express.json());
    app.use((req, res, next) => RequestContext.create(DI.orm.em, next));

    // prepare user authentication
    app.use(Auth.prepareUserAuthentication);

    // routes
    app.use('/account', SpotifyAuthController);
    app.use('/events', Auth.verifySpotifyAccess, EventController);

    DI.server = app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
};

// TODO: create env file
if (process.env.environment !== 'test') {
    initializeServer();
}
