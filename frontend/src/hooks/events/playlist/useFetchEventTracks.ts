import { useState, useEffect } from "react";
import axios from "axios";
import { EventTrack, Event } from "../../../constants";

type UseFetchEventTracksProps = {
  eventId: string;
};

export const useFetchEventTracks = ({ eventId }: UseFetchEventTracksProps) => {
  const [eventTracks, setEventTracks] = useState<EventTrack[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem("accessToken") || undefined;

  useEffect(() => {
    const fetchEventTracks = async () => {
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

    fetchEventTracks();
  }, [eventId, accessToken]);

  return { eventTracks, isLoading, error };
};
