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

    @ManyToOne({entity: () => Event, primary: true })
    event!: Event;

    @ManyToOne({entity: () => User, primary: true})
    user!: User;

    @Property()
    role!: UserStatus;

    constructor(role: UserStatus, user: User, event: Event) {
        this.role = role;
        this.user = user;
        this.event = event;
    }
}
