import express from 'express';
import http from 'http';

import {EntityManager, EntityRepository, MikroORM, RequestContext} from '@mikro-orm/core';

import {TagController} from './controller/deprecated/tag.controller';
import {EventController} from "./controller/event.controller";
import {SpotifyAuthController} from "./controller/auth.spotify.controller";
import {SpotifyAuth} from "./middleware/auth.spotify.middleware";


const PORT = 4000;
const app = express();


const SPOTIFY_CLIENT_ID = "f24ef133eb1847d089085909d8891e07";
const SPOTIFY_CLIENT_SECRET = "d1119429c435479bb4a4c969eea3748c";
const SPOTIFY_REDIRECT_URI = "http://localhost:4000/account/login_response";
// TODO: add spotify client app to DI


export const DI = {} as {
    server: http.Server;
    orm: MikroORM;
    em: EntityManager;
    spotifyClientId: string;
    spotifyClientSecret: string;
    spotifyRedirectUri: string,
    //userRepository: EntityRepository<User>;
    //eventUserRepository: EntityRepository<EventUser>;
};

export const initializeServer = async () => {
    // dependency injection setup
    DI.orm = await MikroORM.init();
    DI.em = DI.orm.em;
    // TODO: DI.diaryEntryRepository = DI.orm.em.getRepository(DiaryEntry);
    // TODO: DI.diaryEntryTagRepository = DI.orm.em.getRepository(DiaryEntryTag);
    // TODO: DI.userRepository = DI.orm.em.getRepository(User);
    //DI.eventRepository = DI.orm.em.getRepository(Event);
    DI.spotifyClientId = SPOTIFY_CLIENT_ID;
    DI.spotifyClientSecret = SPOTIFY_CLIENT_SECRET;
    DI.spotifyRedirectUri = SPOTIFY_REDIRECT_URI;

    // example middleware
    app.use((req, res, next) => {
        console.info(`New request to ${req.path}`);
        next();
    });

    // global middleware
    app.use(express.json());
    app.use((req, res, next) => RequestContext.create(DI.orm.em, next));


    //app.use(Auth.prepareAuthentication);
    app.use(SpotifyAuth.prepareAuthentication);

    // routes
    app.use('/account', SpotifyAuthController);
    app.use('/events', SpotifyAuth.verifyAccess, EventController);

    DI.server = app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
};

if (process.env.environment !== 'test') {
    initializeServer();
}
