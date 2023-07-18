import axios from "axios";
import { useEffect } from "react";
import { HOME } from "../constants";
import { toast } from "react-toastify";
import styled from "styled-components";
import { COLORS } from "../constants";

export const JoinEventByQr = (): JSX.Element | null => {
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const urlParams = new URLSearchParams(window.location.search);
  const eventID = urlParams.get("event") || undefined;

  const TextContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    padding: 16px;
    gap: 16px;
    height: 100%;
    widht: 100%;
    background-color: ${COLORS.backgroundLight};
    color: ${COLORS.font};
  `;

  useEffect(() => {
    if (accessToken) {
      if (eventID) {
        axios
          .get(`http://localhost:4000/events/${eventID}`, {
            headers: {
              Authorization: `${accessToken}`,
            },
          })
          .then((res) => {
            if (res.status === 200) {
              window.location.href = HOME;
            } else if (res.status === 401) {
              toast.error("Sorry, you don´t have access!");
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

  return <TextContainer>Joining event...</TextContainer>;
};
