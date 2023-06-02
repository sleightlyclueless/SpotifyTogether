
import {Collection, Entity, ManyToOne, OneToMany, Property} from "@mikro-orm/core";

import {BaseEntity} from './BaseEntity';
import {date, object, string} from "yup";
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

    @ManyToOne(() => User)
    User = User;

    @ManyToOne(() => Event)
    Event = Event;


    constructor(role: UserStatus) {
        super()
        this.Role = role
    }
}