import { useState } from "react";
import styled from "styled-components";
import { COLORS } from "../constants";
import { useJoinEventByQr } from "../hooks/events/useJoinEventByQr";
import { useCheckAndRefreshToken } from "../hooks";

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
