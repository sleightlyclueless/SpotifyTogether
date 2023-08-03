export type HeaderProps = {
  userName?: string;
};

export type Event = {
  id: string;
  name: string;
  date: string; // Date is represented as a string here, you can convert it to a JavaScript Date object if needed
  locked: boolean;
  participants: Participant[];
  eventTracks: EventTrack[];
  playlists: Playlist[];
};

export type Participant = {
  event: string;
  user: {
    userid: string;
    spotifyId: string;
    spotifyAccessToken: string | null;
    spotifyRefreshToken: string | null;
    expiresInMs: number;
    issuedAt: string;
  };
  permission: string;
};

export type EventTrack = {
  track: SpotifyTrack;
  event: Event;
  playlists: Playlist[];
  status: TrackStatus;
};

export enum TrackStatus {
  DENIED,
  PROPOSED,
  ACCEPTED_PLAYLIST,
  GENERATED,
  ACCEPTED,
}

export type Playlist = {
  id: string;
  accepted: boolean;
  event: Event;
  eventTracks: EventTrack[];
};

export type SpotifyTrack = {
  id: string;
  name: string;
  genre: string;
  duration: number;
  artist: string;
  artistName: string;
  eventTracks: EventTrack[];
  albumImage: string;
};
