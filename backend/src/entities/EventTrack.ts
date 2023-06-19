import {Entity, ManyToOne, Property} from "@mikro-orm/core";
import {Event} from './Event'
import {SpotifyTrack} from "./SpotifyTrack";

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
    status!: TrackStatus;

    constructor(status: TrackStatus, track: SpotifyTrack, event: Event) {
        this.status = status;
        this.track = track;
        this.event = event;
    }
}