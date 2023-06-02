

import {Collection, Entity, ManyToOne, OneToMany, Property} from "@mikro-orm/core";

import {BaseEntity} from './BaseEntity';
import {date, object, string} from "yup";
import {SpotifyTrack} from './SpotifyTrack'
import {Event} from './Event'

//Spotify-Playlist: TrackList[Spotify-Track],duration,PlaylistID

export enum TrackStatus {
    proposed = "proposed",
    accepted = "accepted",
    generated = "generated",
    denied = "denied"
}

@Entity()
export class EventTrack extends BaseEntity {

    @Property()
    Role!: TrackStatus;

    @ManyToOne(() => SpotifyTrack)
    Track = SpotifyTrack;

    @ManyToOne(() => Event)
    Event = Event;


    constructor(role: TrackStatus) {
        super()
        this.Role = role
    }
}