import axios from "axios";
import { useState } from "react";

export const useRemovePlaylist = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const removePlaylist = async (
    eventId: string,
    spotifyPlaylistId: string,
    onError: (error: string | null) => void
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.put(
        `http://localhost:4000/events/${eventId}/tracks/${spotifyPlaylistId}/remove`,
        null,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

      setIsLoading(false);
      onError(null);
    } catch (error) {
      setError(
        (error as Error).message ||
          "An error occurred while removing the playlist."
      );
      setIsLoading(false);
      onError(
        (error as Error).message ||
          "An error occurred while removing the playlist."
      );
    }
  };

  return { isLoading, error, removePlaylist };
};
