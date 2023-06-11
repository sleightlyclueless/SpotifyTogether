import {object, string} from 'yup';

import {Collection, Entity, OneToMany, PrimaryKey, Property, types} from '@mikro-orm/core';

import {Event} from './Event'
import {EventUser} from "./EventUser";

//User:EventList[Event],name,UserID

@Entity()
export class User {
    @PrimaryKey()
    spotifyId: string;

    // TODO: additional user profile info
    //@Property({type: types.text})
    //display_name: string;
    //@Property({type: types.text})
    //image_url: string;

    @Property({type: types.text})
    spotifyAccessToken: string;

    @Property({type: types.text})
    spotifyRefreshToken: string;

    //@Property({type: types.text})
    //spotifyTokenSalt: string; // TODO: encrypt tokens to safely store them

    @OneToMany(() => EventUser, (EventUser) => EventUser.user)
    EventList = new Collection<EventUser>(this);

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