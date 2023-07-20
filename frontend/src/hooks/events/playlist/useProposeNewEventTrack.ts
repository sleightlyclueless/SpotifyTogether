import axios from "axios";
import { useState } from "react";

export const useProposeNewEventTrack = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const proposeNewEventTrack = async (
    eventId: string,
    spotifyTrackId: string,
    onError: (error: string | null) => void
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(
        `http://localhost:4000/events/${eventId}/tracks/${spotifyTrackId}`,
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
          "An error occurred while proposing a new event track."
      );
      setIsLoading(false);
      onError(
        (error as Error).message ||
          "An error occurred while proposing a new event track."
      );
    }
  };

  return { isLoading, error, proposeNewEventTrack };
};
