import {Collection, Entity, OneToMany, Property} from "@mikro-orm/core";

import {object, string} from "yup";
import {SpotifyPlaylist} from "./SpotifyPlaylist";
import { Event } from "./Event"
//Spotify-Track: Genre, duration, Artist,isInPlaylist[PlaylistID],TrackID,isInEvent[EventID]

@Entity()
export class SpotifyTrack extends BaseEntity {
    @Property({nullable: false, unique: true})
    TrackID!: number;

    @Property()
    Genre: string;

    @Property()
    Duration: number;

    @Property()
    Artist: string;

    @OneToMany(() => SpotifyPlaylist, (SpotifyPlaylist) => SpotifyPlaylist.PlayListID)
    IsInPlaylist = new Collection<SpotifyPlaylist>(this);

    @OneToMany(() => Event, (Event) => Event.EventID)
    IsInEvent = new Collection<Event>(this);

    constructor(trackID: number,duration: number, genre: string, artist:string, ) {
        super()
        this.TrackID = trackID
        this.Duration = duration
        this.Genre = genre
        this.Artist = artist
    }
}

export const CreateSpotifyTrackSchema = object({
    TrackID: string().required(),
    duration: string().required(),
    Genre: object().required(),
    Artist: object().required()
});