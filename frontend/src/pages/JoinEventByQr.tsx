import { useState } from "react";
import { useJoinEventByQr } from "../hooks/events/useJoinEventByQr";
import { useCheckAndRefreshToken } from "../hooks";
import { TextContainer } from "../styles";

export const JoinEventByQr = (): JSX.Element | null => {
  // Call the useCheckAndRefreshToken hook
  const [accessToken, setAccessToken] = useState<string | undefined>(
    localStorage.getItem("accessToken") || undefined
  );
  useCheckAndRefreshToken(setAccessToken);

  const urlParams = new URLSearchParams(window.location.search);
  const eventID = urlParams.get("event") || null;

  useJoinEventByQr(eventID);

  return <TextContainer>Joining event...</TextContainer>;
};
