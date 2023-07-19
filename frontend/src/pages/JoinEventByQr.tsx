import axios from "axios";
import { useEffect } from "react";
import { HOME } from "../constants";
import { toast } from "react-toastify";
import styled from "styled-components";
import { COLORS } from "../constants";
import { useJoinEventByQr } from "../hooks/events/useJoinEventByQr";

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
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const urlParams = new URLSearchParams(window.location.search);
  const eventID = urlParams.get("event") || null;

  useJoinEventByQr(eventID, accessToken);

  return <TextContainer>Joining event...</TextContainer>;
};