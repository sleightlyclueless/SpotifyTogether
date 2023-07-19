import { useState } from "react";
import axios from "axios";
import { EventType } from "../../constants/types";

export const useCreateEvent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createEvent = async (
    eventName: string,
    eventDate: Date | null,
    accessToken: string | undefined,
    onError: (error: string | null) => void // Callback function to handle the error in the component
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!eventName || !eventDate) {
        throw new Error("Event Name or Date is not set!");
      }

      const eventData: EventType = {
        id: "", // You can generate the id here or leave it empty to be set on the server side
        name: eventName,
        date: eventDate.toISOString(),
        locked: false, // Set other properties as needed
        participants: [], // Set other properties as needed
      };

      await axios.post("http://localhost:4000/events", eventData, {
        headers: {
          Authorization: accessToken,
        },
      });

      setIsLoading(false);
      onError(null); // Call the callback with no error (success)
    } catch (error) {
      setError((error as Error).message || "An error occurred while creating the event.");
      setIsLoading(false);
      onError((error as Error).message || "An error occurred while creating the event."); // Call the callback with the error
    }
  };

  return { isLoading, error, createEvent };
};