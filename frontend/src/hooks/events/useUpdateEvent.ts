// TODO - missing route / broken?

import axios from "axios";
import { useState } from "react";
import { EventType } from "../../constants/types";

export const useUpdateEvent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateEvent = async (eventID: string, updatedEvent: EventType, accessToken: string | undefined) => {
    try {
      setIsLoading(true);
      setError(null);

      await axios.put(`http://localhost:4000/events/${eventID}`, updatedEvent, {
        headers: {
          Authorization: accessToken,
        },
      });

      setIsLoading(false);
    } catch (error) {
      setError("An error occurred while updating the event.");
      setIsLoading(false);
    }
  };

  return { isLoading, error, updateEvent };
};