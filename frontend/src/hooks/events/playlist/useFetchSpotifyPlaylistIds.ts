import axios from "axios";
import { useState } from "react";
import { PlaylistType } from "../../../constants";

export const useFetchSpotifyPlaylistIds = () => {
  const [spotifyPlaylistIds, setSpotifyPlaylistIds] = useState<PlaylistType[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const fetchSpotifyPlaylistIds = async (eventId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(
        `http://localhost:4000/events/${eventId}/tracks/spotifyPlaylistIds`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

      setSpotifyPlaylistIds(response.data);
      setIsLoading(false);
    } catch (error) {
      setError(
        (error as Error).message ||
          "An error occurred while fetching Spotify playlist ids."
      );
      setIsLoading(false);
    }
  };

  return { spotifyPlaylistIds, isLoading, error, fetchSpotifyPlaylistIds };
};
