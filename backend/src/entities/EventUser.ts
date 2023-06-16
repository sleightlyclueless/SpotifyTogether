import {Entity, ManyToOne, PrimaryKey, Property} from "@mikro-orm/core";
import {User} from './User'
import {Event} from './Event'

//Spotify-Playlist: TrackList[Spotify-Track],duration,PlaylistID

// hierarchical order, top to bottom, every level has all rights of all levels above
export enum Permission {
    PARTICIPANT = "participant",
    ADMIN = "admin",
    OWNER = "owner",
}

@Entity()
export class EventUser {

    @ManyToOne({entity: () => Event, primary: true})
    event!: Event;

    @ManyToOne({entity: () => User, primary: true})
    user!: User;

    @Property()
    permission!: Permission;

    constructor(permission: Permission, user: User, event: Event) {
        this.permission = permission;
        this.user = user;
        this.event = event;
    }
}
