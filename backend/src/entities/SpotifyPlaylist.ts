import {Collection, Entity, OneToMany, PrimaryKey, Property} from "@mikro-orm/core";

import {date, object, string} from "yup";
import {v4} from "uuid";

//Spotify-Playlist: TrackList[Spotify-Track],duration,PlaylistID

//@Entity()
export class SpotifyPlaylist {

    @PrimaryKey({nullable: false, unique: true})
    id: string = v4();

    @Property()
    duration: number;

    /*@OneToMany(() => SpotifyTrack, (SpotifyTrack) => SpotifyTrack.TrackID)
    TrackList = new Collection<SpotifyTrack>(this);
    */
    constructor(playListID: string, duration: number) {

        this.id = playListID
        this.duration = duration
    }
}

export const CreateSpotifyPlaylistSchema = object({
    PlayListID: string().required(),
    duration: string().required(),
    TrackList: object().notRequired(),
});