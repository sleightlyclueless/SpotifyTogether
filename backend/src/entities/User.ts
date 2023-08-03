import { Collection, Entity, OneToMany, PrimaryKey, Property, types } from '@mikro-orm/core';
import { EventUser } from "./EventUser";
import { v4 } from 'uuid';

@Entity()
export class User {
    @PrimaryKey({nullable: false, unique: true})
    userid: string;

    @Property()
    spotifyId: string;

    @Property({type: types.text, nullable: true })
    spotifyAccessToken: string | null;

    @Property({type: types.text, nullable: true})
    spotifyRefreshToken: string | null; // In a real application you shouldn't save the token in plain text -> Salt.

    @Property()
    expiresInMs: number;

    @Property({type: types.bigint})
    issuedAt: number;

    @OneToMany(() => EventUser, (EventUser) => EventUser.user)
    eventUsers = new Collection<EventUser>(this);

    constructor(userID: string, spotifyToken: string, SpotifyRefreshToken: string, expires_in_ms: number, issued_at: number) {
        this.userid = v4();
        this.spotifyId = userID;
        this.spotifyAccessToken = spotifyToken;
        this.spotifyRefreshToken = SpotifyRefreshToken;
        this.expiresInMs = expires_in_ms;
        this.issuedAt = issued_at;
    }
}