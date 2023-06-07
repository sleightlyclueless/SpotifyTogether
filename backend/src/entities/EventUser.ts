import {Entity, ManyToOne, Property} from "@mikro-orm/core";

import {BaseEntity} from './BaseEntity';
import {User} from './User'
import {Event} from './Event'

//Spotify-Playlist: TrackList[Spotify-Track],duration,PlaylistID

export enum UserStatus {
    admin = "admin",
    moderator = "moderator",
    user = "user",
    guest = "Guest"
}

@Entity()
export class EventUser extends BaseEntity {

    @Property()
    Role!: UserStatus;

    @ManyToOne({entity: () => User, primary: true})
    User: User;

    @ManyToOne({entity: () => Event, primary: true})
    Event: Event;


    constructor(role: UserStatus, user: User, event: Event) {
        super();
        this.Role = role;
        this.User = user;
        this.Event = event;
    }
}
