export interface Device {
  id: string;
  name: string;
}

export interface DevicesMap {
  [key: string]: Device[];
}

export interface Playlist {
  id: string;
  name: string;
  href: string;
}

export interface PlaylistsMap {
  [key: string]: Playlist[];
}

export interface Track {
  id: string;
  track: Song;
}

export interface Data {
  tracks: {
    items: Track[];
  };
}

export interface Song {
  id: string;
  href: string;
  name: string;
  duration_ms: number;
  artists: Artist[];
}

export interface Artist {
  name: string;
}

export interface CurrentTracksMap {
  [key: string]: string[];
}
