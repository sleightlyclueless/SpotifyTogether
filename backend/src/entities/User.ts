import {object, string} from 'yup';

import {Entity, PrimaryKey, Property, types} from '@mikro-orm/core';

import {Event} from './Event'

//User:EventList[Event],name,UserID

@Entity()
export class User {
    @PrimaryKey({nullable: false})
    spotifyId: string;

    @Property({type: types.text})
    spotifyAccessToken: string;

    @Property({type: types.text})
    spotifyRefreshToken: string;

    //@Property({type: types.text})
    //spotifyTokenSalt: string; // TODO: encrypt tokens to safely store them

    //@OneToMany(() => Event, (Event) => Event.EventID)
    //EventList = new Collection<Event>(this);

    constructor(userID: string, spotifyToken: string, SpotifyRefreshToken: string) {
        this.spotifyId = userID;
        this.spotifyAccessToken = spotifyToken;
        this.spotifyRefreshToken = SpotifyRefreshToken;
    }
}


export const LoginSchema = object({
    email: string().required(),
    password: string().required(),
});
