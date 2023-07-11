import {Collection, Entity, ManyToMany, ManyToOne, Property} from "@mikro-orm/core";
import {Event} from './Event'
import {SpotifyTrack} from "./SpotifyTrack";
import {Playlist} from "./Playlist";

// hierarchical order, top to bottom, every level has all rights of all levels above
export enum TrackStatus {
    DENIED,
    PROPOSED,
    ACCEPTED_PLAYLIST,
    GENERATED,
    ACCEPTED,
}

@Entity()
export class EventTrack {
    @ManyToOne({entity: () => SpotifyTrack, primary: true})
    track: SpotifyTrack;

    @ManyToOne({entity: () => Event, primary: true})
    event: Event;

    @ManyToMany(() => Playlist, 'eventTracks', {owner: true})
    playlists = new Collection<Playlist>(this);

    @Property()
    status!: TrackStatus;

    constructor(status: TrackStatus, track: SpotifyTrack, event: Event) {
        this.status = status;
        this.track = track;
        this.event = event;
    }
}