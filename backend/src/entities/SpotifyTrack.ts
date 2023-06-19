import {Collection, Entity, OneToMany, PrimaryKey, Property} from "@mikro-orm/core";
import {SpotifyPlaylist} from "./SpotifyPlaylist";
import {v4} from "uuid";
import {EventTrack} from "./EventTrack";

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
    eventTracks = new Collection<EventTrack>(this);

    @OneToMany(() => SpotifyPlaylist, (SpotifyPlaylist) => SpotifyPlaylist.tracks)
    isInPlaylist = new Collection<SpotifyPlaylist>(this);

    /*
    @OneToMany(() => Event, (Event) => Event.id)
    IsInEvent = new Collection<Event>(this);
    */
    constructor(trackID: string, duration: number, genre: string, artist: string) {
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