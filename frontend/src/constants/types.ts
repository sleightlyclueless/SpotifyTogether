export type EventTrackType = {
  track: SpotifyTrackType;
  event: EventType;
  playlists: PlaylistType[];
  status: TrackStatus;
};

export type PlaylistType = {
  id: string;
  accepted: boolean;
  event: EventType;
  eventTracks: EventTrackType[];
};

export type TrackStatus =
  | "DENIED"
  | "PROPOSED"
  | "ACCEPTED_PLAYLIST"
  | "GENERATED"
  | "ACCEPTED";

export type HeaderProps = {
  title: string;
  userName?: string;
};

export type SpotifyTrackType = {
  // Define the properties of SpotifyTrack entity if needed
  // Example:
  // id: string;
  // duration: number;
  // genre: string;
  // artist: string;
};

// Add other types as needed based on your entities
// ...

export type EventType = {
  id: string;
  name: string;
  date: string;
  locked: boolean;
  participants: Participant[];
};

export type Participant = {
  event: string;
  user: {
    spotifyId: string;
    spotifyAccessToken: string | null;
    spotifyRefreshToken: string | null;
    expiresInMs: number;
    issuedAt: string;
  };
  permission: string;
};