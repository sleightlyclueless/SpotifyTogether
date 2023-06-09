import {Entity, ManyToOne, PrimaryKey, Property} from "@mikro-orm/core";

import {User} from './User'
import {Event} from './Event'

//Spotify-Playlist: TrackList[Spotify-Track],duration,PlaylistID

export enum UserStatus {
    admin = "admin",
    moderator = "moderator",
    user = "user",
    guest = "Guest"
}

//@Entity()
export class EventUser{

    /*@Property()
    Role!: UserStatus;

    @PrimaryKey({nullable: false, unique: true})
    id: string = v4();

    @ManyToOne({entity: () => Event, primary: true})
    @PrimaryKey()
    Event: Event;

    constructor(role: UserStatus, user: User, event: Event) {

        this.Role = role;
        //this.User = user;
        //this.Event = event;
    }*/
}
