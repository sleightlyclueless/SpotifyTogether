import { Collection, Entity, ManyToMany, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { EventTrack } from "./EventTrack";
import { Event } from "./Event";

@Entity()
export class Playlist {

    @PrimaryKey({nullable: false, unique: true})
    id: string;

    @Property()
    accepted: boolean;

    @ManyToOne({entity: () => Event})
    event!: Event;

    @ManyToMany(() => EventTrack, eventTrack => eventTrack.playlists)
    eventTracks = new Collection<EventTrack>(this);

    constructor(playListID: string) {
        this.id = playListID;
        this.accepted = false;
    }
}