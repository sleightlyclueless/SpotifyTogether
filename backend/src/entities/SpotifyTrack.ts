import {Collection, Entity, OneToMany, PrimaryKey, Property} from "@mikro-orm/core";

import {object, string} from "yup";
import {SpotifyPlaylist} from "./SpotifyPlaylist";
import { Event } from "./Event"
import {v4} from "uuid";
//Spotify-Track: Genre, duration, Artist,isInPlaylist[PlaylistID],TrackID,isInEvent[EventID]

//@Entity()
export class SpotifyTrack {
    @PrimaryKey({nullable: false, unique: true})
    id: string = v4();

    @Property()
    Genre: string;

    @Property()
    Duration: number;

    @Property()
    Artist: string;

    /*
    @OneToMany(() => SpotifyPlaylist, (SpotifyPlaylist) => SpotifyPlaylist.PlayListID)
    IsInPlaylist = new Collection<SpotifyPlaylist>(this);

    @OneToMany(() => Event, (Event) => Event.EventID)
    IsInEvent = new Collection<Event>(this);*/

    constructor(trackID: string,duration: number, genre: string, artist:string, ) {

        this.id = trackID
        this.Duration = duration
        this.Genre = genre
        this.Artist = artist
    }
}

/*export const CreateSpotifyTrackSchema = object({
    TrackID: string().required(),
    duration: string().required(),
    Genre: object().required(),
    Artist: object().required()
});*/