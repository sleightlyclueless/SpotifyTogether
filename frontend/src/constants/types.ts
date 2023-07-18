export type HeaderProps = {
  title: string;
  userName?: string;
};

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
