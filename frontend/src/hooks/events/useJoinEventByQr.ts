import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { HOME } from "../../constants";

export const useJoinEventByQr = (eventID: string | null, accessToken: string | undefined) => {
  useEffect(() => {
    if (accessToken) {
      if (eventID) {
        axios
          .get(`http://localhost:4000/events/${eventID}`, {
            headers: {
              Authorization: accessToken,
            },
          })
          .then((res) => {
            if (res.status === 200) {
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
      }
    } else {
      toast.error("Sorry, no access token provided!");
      if (eventID) {
        localStorage.setItem("autojoinevent", eventID);
        window.location.href = "http://localhost:4000/account/login";
      }
    }
  }, [eventID, accessToken]);
};