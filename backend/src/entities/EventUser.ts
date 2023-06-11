import {Entity, ManyToOne, PrimaryKey, Property} from "@mikro-orm/core";

import {User} from './User'
import {Event} from './Event'

//Spotify-Playlist: TrackList[Spotify-Track],duration,PlaylistID

export enum UserStatus {
    OWNER = "owner",
    ADMIN = "admin",
    PARTICIPANT = "participant",
    GUEST = "guest"
}

@Entity()
export class EventUser {

    @ManyToOne({entity: () => Event, primary: true})
    @PrimaryKey()
    Event: Event;

    constructor(role: UserStatus, user: User, event: Event) {

        this.Role = role;
        //this.User = user;
        //this.Event = event;
    }*/
}
