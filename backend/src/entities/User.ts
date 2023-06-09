import {object, string} from 'yup';

import {Collection, Entity, OneToMany, Property} from '@mikro-orm/core';

import {Event} from './Event'

//User:EventList[Event],name,UserID

@Entity()
export class User extends BaseEntity {
    @Property({nullable: false, unique: true})
    UserID: string;

    @OneToMany(() => Event, (Event) => Event.EventID)
    EventList = new Collection<Event>(this);

    @Property()
    SpotifyToken: string;

    @Property()
    SpotifyRefreshToken: string;

    @Property()
    SpotifyTokenSalt: string;

    constructor(userID: string, spotifyToken: string, SpotifyRefreshToken: string, SpotifyTokenSalt: string) {
        super();
        this.UserID = userID;
        this.SpotifyToken = spotifyToken;
        this.SpotifyRefreshToken = SpotifyRefreshToken;
        this.SpotifyTokenSalt = SpotifyTokenSalt;
    }
}


export const LoginSchema = object({
    email: string().required(),
    password: string().required(),
});
