import express from 'express';
import http from 'http';
import {EntityManager, MikroORM, RequestContext} from '@mikro-orm/core';
import {Auth} from "./middleware/auth.middleware";
import {EventController} from "./controller/event.controller";
import {SpotifyAuthController} from "./controller/auth.spotify.controller";
import cors from "cors";
import {SchemaGenerator} from "@mikro-orm/postgresql";

const PORT = 4000;// TODO: move into env file
const app = express();

// TODO: move into env file
const SPOTIFY_CLIENT_ID = "b241ae6416a3481dad98e6899b7be0b4";
const SPOTIFY_CLIENT_SECRET = "4807da9be0f144b9bbab888217e5e969";
const SPOTIFY_REDIRECT_URI = "http://localhost:4000/account/login_response";

export const DI = {} as {
    server: http.Server;
    orm: MikroORM;
    em: EntityManager;
    generator: SchemaGenerator;
    spotifyClientId: string;
    spotifyClientSecret: string;
    spotifyRedirectUri: string;
    frontendUrl: string;
};

export const initializeServer = async () => {
    // dependency injection setup
    DI.orm = await MikroORM.init();
    DI.em = DI.orm.em;
    DI.generator = await <SchemaGenerator>DI.orm.getSchemaGenerator();
    DI.spotifyClientId = SPOTIFY_CLIENT_ID;
    DI.spotifyClientSecret = SPOTIFY_CLIENT_SECRET;
    DI.spotifyRedirectUri = SPOTIFY_REDIRECT_URI;
    DI.frontendUrl = "http://localhost:5173";

    if (process.env.environment == 'test') {
        await DI.generator.dropSchema();
    }

    await DI.generator.updateSchema();
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
