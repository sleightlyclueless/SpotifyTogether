import {Collection, Entity, OneToMany, PrimaryKey, Property} from "@mikro-orm/core";

import {object, string} from "yup";
import {EventUser} from "./EventUser";
import {EventTrack} from "./EventTrack";

//Event:
// TrackList[Spotify-Track],
// UserList[User],
// TracksProposed[Spotify-Track],
// duration: time,
// EventID: integer(?)UNIQUE,
// Owner: User,

@Entity()
export class Event {
    @PrimaryKey({nullable: false, unique: true})
    id: string;

    @Property()
    duration: number = 0;

    @OneToMany(() => EventUser, (EventUser) => EventUser.event)
    users = new Collection<EventUser>(this);

    @OneToMany(() => EventTrack, (EventTrack) => EventTrack.event)
    eventTracks = new Collection<EventTrack>(this);

    constructor(EventID: string) {
        this.id = EventID;
    }
}

export const CreateSpotifyPlaylistSchema = object({
    PlayListID: string().required(),
    duration: string().required(),
    TrackList: object().notRequired(),
});
