import { useState } from "react";
import axios from "axios";

export const useGeneratePlaylist = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const generatePlaylist = async (
    eventId: string,
    onError: (error: string | null) => void
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.put(
        `http://localhost:4000/events/${eventId}/algorithm/generate`,
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
          "An error occurred while generating the playlist."
      );
      setIsLoading(false);
      onError(
        (error as Error).message ||
          "An error occurred while generating the playlist."
      );
    }
  };

  return { isLoading, error, generatePlaylist };
};
