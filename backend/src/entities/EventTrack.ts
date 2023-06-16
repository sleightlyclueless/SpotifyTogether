import {Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property} from "@mikro-orm/core";

import {date, object, string} from "yup";
import {Event} from './Event'
import {User} from "./User";
import {SpotifyTrack} from "./SpotifyTrack";
import {Permission} from "./EventUser";

//Spotify-Playlist: TrackList[Spotify-Track],duration,PlaylistID

export enum TrackStatus {
    proposed = "proposed",
    accepted = "accepted",
    generated = "generated",
    denied = "denied"
}

@Entity()
export class EventTrack {
    @ManyToOne({entity: () => SpotifyTrack, primary: true})
    track: SpotifyTrack;

    @ManyToOne({entity: () => Event, primary: true})
    event: Event;

    @Property()
    role!: TrackStatus;

    constructor(role: TrackStatus, track: SpotifyTrack, event: Event) {
        this.role = role;
        this.track = track;
        this.event = event;
    }
}