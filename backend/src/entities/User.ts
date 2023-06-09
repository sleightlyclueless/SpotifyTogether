import {object, string} from 'yup';

import {Entity, PrimaryKey, Property} from '@mikro-orm/core';

import {Event} from './Event'

//User:EventList[Event],name,UserID

@Entity()
export class User {
    @PrimaryKey({nullable: false, unique: true})
    spotifyId: string;

    //@OneToMany(() => Event, (Event) => Event.EventID)
    //EventList = new Collection<Event>(this);

    @Property()
    SpotifyToken: string;

    @Property()
    SpotifyRefreshToken: string;

    @Property()
    SpotifyTokenSalt: string;

    constructor(userID: string, spotifyToken: string, SpotifyRefreshToken: string, SpotifyTokenSalt: string) {
        this.spotifyId = userID;
        this.SpotifyToken = spotifyToken;
        this.SpotifyRefreshToken = SpotifyRefreshToken;
        this.SpotifyTokenSalt = SpotifyTokenSalt;
    }
}


export const LoginSchema = object({
    email: string().required(),
    password: string().required(),
});
