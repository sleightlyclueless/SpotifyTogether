import { Options } from '@mikro-orm/core';
import { User } from './entities/User';
import { Event } from './entities/Event';
import { EventUser } from './entities/EventUser';
import { EventTrack } from './entities/EventTrack';
import { SpotifyTrack } from './entities/SpotifyTrack';
import { Playlist } from './entities/Playlist';

// Connection to the database
const options: Options = {
    type: 'postgresql',
    entities: [User , Event, EventUser, EventTrack, SpotifyTrack, Playlist],
    dbName: 'spotifyDB',
    password: 'fweSS22',
    user: 'spotifyDBUser',
    debug: true,
};

export default options;
