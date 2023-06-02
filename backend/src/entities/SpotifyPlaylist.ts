import {Collection, Entity, OneToMany, Property} from "@mikro-orm/core";

import {BaseEntity} from './BaseEntity';
import {date, object, string} from "yup";
import {SpotifyTrack} from './SpotifyTrack'

//Spotify-Playlist: TrackList[Spotify-Track],duration,PlaylistID

@Entity()
export class SpotifyPlaylist extends BaseEntity {
    @Property({nullable: false, unique: true})
    PlayListID!: number;

    @Property()
    duration: number;

    @OneToMany(() => SpotifyTrack, (SpotifyTrack) => SpotifyTrack.TrackID)
    TrackList = new Collection<SpotifyTrack>(this);

    constructor(playListID: number, duration: number) {
        super()
        this.PlayListID = playListID
        this.duration = duration
    }
}

export const CreateSpotifyPlaylistSchema = object({
    PlayListID: string().required(),
    duration: string().required(),
    TrackList: object().notRequired(),
});