import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { HOME } from "../../constants";

export const useJoinEventByQr = (eventID: string | null) => {
  const accessToken = localStorage.getItem("accessToken") || undefined;
  const [isUserJoined, setIsUserJoined] = useState(false);

  useEffect(() => {
    if (!isUserJoined && accessToken && eventID) {
      axios
        .get(`http://localhost:4000/events/${eventID}`, {
          headers: {
            Authorization: accessToken,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setIsUserJoined(true); // Set the state to indicate user is joined
            window.location.href = HOME;
          } else if (res.status === 401) {
            toast.error("Sorry, you don't have access!");
          } else if (res.status === 404) {
            toast.error("Sorry, event code is invalid!");
          }
        })
        .catch(() => {
          toast.error("Sorry, something went wrong!");
        });
    } else if (!accessToken) {
      toast.error("Sorry, no access token provided!");
      if (eventID) {
        localStorage.setItem("autojoinevent", eventID);
        window.location.href = "http://localhost:4000/account/login";
      }
    }
  }, [accessToken, eventID, isUserJoined]); // Include isUserJoined as a dependency

  return isUserJoined; // Return the state to indicate if the user is joined
};