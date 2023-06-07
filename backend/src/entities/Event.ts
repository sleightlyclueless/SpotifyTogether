import {Collection, Entity, OneToMany, OneToOne, Property} from "@mikro-orm/core";

import {BaseEntity} from './BaseEntity';
import {object, string} from "yup";
import {SpotifyTrack} from './SpotifyTrack'
import {User} from "./User";

//Event:
// TrackList[Spotify-Track],
// UserList[User],
// TracksProposed[Spotify-Track],
// duration: time,
// EventID: integer(?)UNIQUE,
// Owner: User,

@Entity()
export class Event extends BaseEntity {
    @Property({nullable: false, unique: true})
    EventID: number;

    @Property()
    duration: number;

    @OneToMany(() => User, (User) => User.UserID)
    UserList = new Collection<User>(this);

    @OneToMany(() => SpotifyTrack, (SpotifyTrack) => SpotifyTrack.TrackID)
    TrackList = new Collection<SpotifyTrack>(this);

    @OneToOne(() => User)
    Owner = User;

    constructor(EventID: number, duration: number) {
        super()
        this.EventID = EventID
        this.duration = duration
    }
}

export const CreateSpotifyPlaylistSchema = object({
    PlayListID: string().required(),
    duration: string().required(),
    TrackList: object().notRequired(),
});
