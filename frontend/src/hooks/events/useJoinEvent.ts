import { useState } from "react";
import axios from "axios";
import { HOME } from "../../constants/routes";
import { toast } from "react-toastify";

export const useJoinEvent = () => {
  // Provide a loading state to the component
  const [joinEventisLoading, setjoinEventisLoading] = useState<boolean>(false);
  const accessToken = localStorage.getItem("accessToken") || undefined;

  // Provide a callback function to be called when the event is successfully joined (closeModal in component)
  const joinEvent = async (eventID: string | null) => {
    try {
      setjoinEventisLoading(true);

      if (!eventID) {
        toast.error("No eventID provided");
        return;
      }

      // If a new / not logged in user tries to join an event, save the eventID in localstorage and have him login (joinEventByQr.ts)
      // Note: Thats why we need the window.location reloads in the hook, because we have two types of join
      if (accessToken === undefined) {
        localStorage.setItem("autojoinevent", eventID);
        window.location.href = "http://localhost:4000/account/login";
      }

      const response = await axios.get(
        `http://localhost:4000/events/${eventID}`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

      if (response.status === 200) {
        setjoinEventisLoading(false);
        window.location.href = HOME;
      } else {
        console.error("Error fetching event:", response.status);
        toast.error("Error joining event: Invalid event ID");
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error("Error joining event: Invalid event ID");
    }
  };

  return { joinEvent, joinEventisLoading };
};
