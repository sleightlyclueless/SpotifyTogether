import { useState } from "react";
import axios from "axios";
import { EventType } from "../../constants";

export const useCreateEvent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const createEvent = async (
    eventName: string,
    eventDate: Date | null,
    onError: (error: string | null) => void // Callback function to handle the error in the component
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!eventName || !eventDate) {
        throw new Error("Event Name or Date is not set!");
      }

      const eventData: EventType = {
        id: "",
        name: eventName,
        date: eventDate.toISOString(),
        locked: false,
        participants: [],
      };

      await axios.post("http://localhost:4000/events", eventData, {
        headers: {
          Authorization: accessToken,
        },
      });

      setIsLoading(false);
      onError(null);
    } catch (error) {
      setError(
        (error as Error).message ||
          "An error occurred while creating the event."
      );
      setIsLoading(false);
      onError(
        (error as Error).message ||
          "An error occurred while creating the event."
      );
    }
  };

  return { isLoading, error, createEvent };
};
