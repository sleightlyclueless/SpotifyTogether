import axios from "axios";
import { useState } from "react";
import { EventTrack } from "../../../constants";

export const useFetchTracksOfPlaylist = () => {
  const [playlistTracks, setPlaylistTracks] = useState<EventTrack[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const fetchTracksOfPlaylist = async (
    eventId: string,
    spotifyPlaylistId: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(
        `http://localhost:4000/events/${eventId}/tracks/${spotifyPlaylistId}`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

      setPlaylistTracks(response.data);
      setIsLoading(false);
    } catch (error) {
      setError(
        (error as Error).message ||
          "An error occurred while fetching tracks of the playlist."
      );
      setIsLoading(false);
    }
  };

  return { playlistTracks, isLoading, error, fetchTracksOfPlaylist };
};
