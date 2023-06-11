import {Collection, Entity, OneToMany, PrimaryKey, Property} from "@mikro-orm/core";
import {object, string} from "yup";
import {SpotifyPlaylist} from "./SpotifyPlaylist";
import { Event } from "./Event"
import {v4} from "uuid";
import {EventUser} from "./EventUser";
import {EventTrack} from "./EventTrack";
//Spotify-Track: Genre, duration, Artist,isInPlaylist[PlaylistID],TrackID,isInEvent[EventID]

@Entity()
export class SpotifyTrack {
    @PrimaryKey({nullable: false, unique: true})
    id: string = v4();

    @Property()
    genre: string;

    @Property()
    duration: number;

    @Property()
    artist: string;

    @OneToMany(() => EventTrack, (EventTrack) => EventTrack.track)
    EventList = new Collection<EventUser>(this);

    @OneToMany(() => SpotifyPlaylist, (SpotifyPlaylist) => SpotifyPlaylist.TrackList)
    IsInPlaylist = new Collection<SpotifyPlaylist>(this);
    /*
    @OneToMany(() => Event, (Event) => Event.id)
    IsInEvent = new Collection<Event>(this);
    */
    constructor(trackID: string,duration: number, genre: string, artist:string, ) {

        this.id = trackID
        this.duration = duration
        this.genre = genre
        this.artist = artist
    }
}

/*export const CreateSpotifyTrackSchema = object({
    TrackID: string().required(),
    duration: string().required(),
    Genre: object().required(),
    Artist: object().required()
});*/