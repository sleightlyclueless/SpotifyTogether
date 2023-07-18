import axios from "axios";
import { useEffect } from "react";
import { useGetUserName } from "../hooks";
import { HOME } from "../constants";
import { toast } from "react-toastify";

export const JoinEventByQr = (): JSX.Element | null => {
  const userName = useGetUserName(localStorage.getItem("accessToken") || "");

  const urlParams = new URLSearchParams(window.location.search);
  const eventCode = urlParams.get("event");

  useEffect(() => {
    if (eventCode) {
      if (userName) {
        axios
          .get(`http://localhost:4000/events/${eventCode}`, {
            headers: {
              Authorization: `${localStorage.getItem("accessToken")}`,
            },
          })
          .then((res) => {
            if (res.status === 200) {
              window.location.href = HOME;
            }
          })
          .catch(() => {
            toast.error("Event code is invalid!");
          });
      } else {
        localStorage.setItem("autojoinevent", eventCode);
        window.location.href = "http://localhost:4000/account/login";
      }
    }
  }, [eventCode, userName]);

  if (eventCode && userName) {
    return <div>Joining Event...</div>;
  } else if (!eventCode) {
    console.log("Invalid event code");
  } else {
    console.log("Not logged in");
  }

  return null;
};