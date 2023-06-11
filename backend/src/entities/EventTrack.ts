import {Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property} from "@mikro-orm/core";

import {date, object, string} from "yup";
import {Event} from './Event'

//Spotify-Playlist: TrackList[Spotify-Track],duration,PlaylistID

export enum TrackStatus {
    proposed = "proposed",
    accepted = "accepted",
    generated = "generated",
    denied = "denied"
}

//@Entity()
export class EventTrack{

    /*@ManyToOne(() => SpotifyTrack)
    @PrimaryKey()
    Track = SpotifyTrack;

    @ManyToOne(() => Event)
    @PrimaryKey()
    Event = Event;

    @Property()
    Role!: TrackStatus;

    constructor(role: TrackStatus) {
        super()
        this.Role = role
    }*/
}