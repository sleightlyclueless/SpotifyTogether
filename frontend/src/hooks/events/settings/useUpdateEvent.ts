import axios from "axios";
import { useState } from "react";

export const useUpdateEvent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const regenerateEventId = async (eventID: string) => {
    try {
      setIsLoading(true);

      await axios.put(
        `http://localhost:4000/events/${eventID}/settings/generateNewId`,
        {},
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const setCustomEventId = async (eventID: string, newEventId: string) => {
    try {
      setIsLoading(true);

      await axios.put(
        `http://localhost:4000/events/${eventID}/settings/id/${newEventId}`,
        {},
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const updateEventName = async (eventID: string, newName: string) => {
    try {
      setIsLoading(true);

      await axios.put(
        `http://localhost:4000/events/${eventID}/settings/name/${newName}`,
        {},
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const updateEventDate = async (eventID: string, newDate: string) => {
    try {
      setIsLoading(true);

      // Ensure the date string is in ISO 8601 format before making the API call
      const eventDateString = new Date(newDate).toISOString();

      await axios.put(
        `http://localhost:4000/events/${eventID}/settings/date/${eventDateString}`,
        {},
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const lockEvent = async (eventID: string) => {
    try {
      setIsLoading(true);

      await axios.put(
        `http://localhost:4000/events/${eventID}/settings/lock`,
        {},
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const unlockEvent = async (eventID: string) => {
    try {
      setIsLoading(true);

      await axios.put(
        `http://localhost:4000/events/${eventID}/settings/unlock`,
        {},
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    setCustomEventId,
    regenerateEventId,
    updateEventName,
    updateEventDate,
    lockEvent,
    unlockEvent,
  };
};
