import express from 'express';
import http from 'http';
import cors from "cors";
import 'dotenv/config';
import { EntityManager, MikroORM, RequestContext } from '@mikro-orm/core';
import { Auth } from "./middleware/auth.middleware";
import { EventController } from "./controller/event.controller";
import { SpotifyAuthController } from "./controller/auth.spotify.controller";
import { SchemaGenerator } from "@mikro-orm/postgresql";

const app = express();

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
    if (process.env.SPOTIFY_CLIENT_ID == undefined || process.env.SPOTIFY_CLIENT_SECRET == undefined || process.env.SPOTIFY_REDIRECT_URI == undefined) {
        console.log("Error: Make sure SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET and SPOTIFY_REDIRECT_URI is set in env.");
        process.exit(1);
    }

    // dependency injection setup
    DI.orm = await MikroORM.init();
    DI.em = DI.orm.em;
    DI.generator = await <SchemaGenerator>DI.orm.getSchemaGenerator();
    DI.spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
    DI.spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    DI.spotifyRedirectUri = process.env.SPOTIFY_REDIRECT_URI;
    DI.frontendUrl = "http://localhost:5173";

    await DI.generator.updateSchema();
    console.log("All database schemas updated !");

    // global middleware (useful for debug)
    app.use((req, res, next) => {
        console.info(`New request to ${req.path}`);
        next();
    });
    app.use(cors());
    app.use(express.json());
    app.use((req, res, next) => RequestContext.create(DI.orm.em, next));

    // prepare user authentication, leaving a global variable req.user (null if not authenticated)
    app.use(Auth.prepareUserAuthentication);

    // routes
    app.use('/account', SpotifyAuthController);
    app.use('/events', Auth.verifySpotifyAccess, EventController);

    // start server
    DI.server = app.listen(process.env.PORT, () => {
        console.log(`Server started on port ${process.env.PORT}`);
    });
};

initializeServer();