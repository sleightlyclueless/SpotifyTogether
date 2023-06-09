import {Collection, Entity, OneToMany, OneToOne, PrimaryKey, Property} from "@mikro-orm/core";

import {object, string} from "yup";
import {User} from "./User";
import {EventUser} from "./EventUser";
import {v4} from "uuid";

//Event:
// TrackList[Spotify-Track],
// UserList[User],
// TracksProposed[Spotify-Track],
// duration: time,
// EventID: integer(?)UNIQUE,
// Owner: User,

//@Entity()
export class Event {
    @PrimaryKey({nullable: false, unique: true})
    id: string = v4();

    @Property()
    duration: number;

    /*@OneToMany(() => User, (EventUser) => EventUser.UserID)
    UserList = new Collection<EventUser>(this);

    @OneToMany(() => SpotifyTrack, (SpotifyTrack) => SpotifyTrack.TrackID)
    TrackList = new Collection<SpotifyTrack>(this);
    */

    constructor(EventID: string, duration: number) {

        this.id = EventID
        this.duration = duration
    }
}

export const CreateSpotifyPlaylistSchema = object({
    PlayListID: string().required(),
    duration: string().required(),
    TrackList: object().notRequired(),
});
