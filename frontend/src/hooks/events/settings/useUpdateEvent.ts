import axios from "axios";
import { useState } from "react";

export const useUpdateEvent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userID = localStorage.getItem("userID") || undefined;

  const setCustomEventId = async (
    eventID: string,
    newEventId: string,
    newName: string,
    newDate: string
  ) => {
    try {
      setIsLoading(true);

      await axios.put(
        `http://localhost:4000/events/${eventID}/settings/id/${newEventId}`,
        { newName, newDate }, // Include newName and newDate in the request body
        {
          headers: {
            Authorization: userID,
          },
        }
      );

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const updateEventName = async (
    eventID: string,
    newName: string,
    currentName: string
  ) => {
    // Only update the name if it's different from the current name
    if (newName !== currentName) {
      try {
        setIsLoading(true);

        await axios.put(
          `http://localhost:4000/events/${eventID}/settings/name/${newName}`,
          {},
          {
            headers: {
              Authorization: userID,
            },
          }
        );

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
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
            Authorization: userID,
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
            Authorization: userID,
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
            Authorization: userID,
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
    updateEventName,
    updateEventDate,
    lockEvent,
    unlockEvent,
  };
};
