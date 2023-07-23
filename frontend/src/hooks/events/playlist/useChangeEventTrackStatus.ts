import axios from "axios";
import { useState } from "react";
import { TrackStatus } from "../../../constants";

export const useChangeEventTrackStatus = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const changeEventTrackStatus = async (
    eventId: string,
    spotifyTrackId: string,
    newStatus: TrackStatus,
    onError: (error: string | null) => void
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.put(
        `http://localhost:4000/events/${eventId}/tracks/${spotifyTrackId}/${newStatus}`,
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
          "An error occurred while changing the event track status."
      );
      setIsLoading(false);
      onError(
        (error as Error).message ||
          "An error occurred while changing the event track status."
      );
    }
  };

  return { isLoading, error, changeEventTrackStatus };
};