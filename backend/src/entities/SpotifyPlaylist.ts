import {Collection, Entity, ManyToOne, PrimaryKey, Property} from "@mikro-orm/core";
import {object, string} from "yup";
import {v4} from "uuid";
import {SpotifyTrack} from "./SpotifyTrack";

@Entity()
export class SpotifyPlaylist {

    @PrimaryKey({nullable: false, unique: true})
    id: string = v4();

    @Property()
    duration: number;

    @ManyToOne({entity: () => SpotifyTrack, primary: true})
    tracks = new Collection<SpotifyTrack>(this);

    constructor(playListID: string, duration: number = 0) {
        this.id = playListID
        this.duration = duration
    }
}

export const CreateSpotifyPlaylistSchema = object({
    PlayListID: string().required(),
    duration: string().required(),
    TrackList: object().notRequired(),
});