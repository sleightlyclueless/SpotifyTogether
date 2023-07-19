import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useCheckAndRefreshToken } from "../account/useCheckAndRefreshToken";

export const useJoinEvent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | undefined>(
    localStorage.getItem("accessToken") || undefined
  );
  useCheckAndRefreshToken(setAccessToken); // Move the useCheckAndRefreshToken hook call outside of useJoinEvent hook

  const joinEvent = async (eventID: string | null, onSuccess: () => void) => {
    try {
      setIsLoading(true);

      if (!eventID) {
        throw new Error("Event code is null");
      }

      await axios.get(`http://localhost:4000/events/${eventID}`, {
        headers: {
          Authorization: accessToken,
        },
      });

      setIsLoading(false);
      onSuccess(); // Call the callback function on successful join
    } catch (error) {
      setIsLoading(false);
      toast.error("Event code is invalid!");
    }
  };

  return { isLoading, joinEvent };
};