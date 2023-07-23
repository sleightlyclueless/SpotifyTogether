import { useState } from "react";
import axios from "axios";
import { EventTrackType } from "../../../constants";

export const useFetchEventTracks = () => {
  const [eventTracks, setEventTracks] = useState<EventTrackType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const fetchEventTracks = async (eventId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(
        `http://localhost:4000/events/${eventId}/tracks`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

      setEventTracks(response.data);
      setIsLoading(false);
    } catch (error) {
      setError(
        (error as Error).message ||
          "An error occurred while fetching event tracks."
      );
      setIsLoading(false);
    }
  };

  return { eventTracks, isLoading, error, fetchEventTracks };
};
