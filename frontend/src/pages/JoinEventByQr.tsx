import { useJoinEventByQr } from "../hooks";
import { TextContainer } from "../styles";

export const JoinEventByQr = (): JSX.Element | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventID = urlParams.get("event") || null;

  useJoinEventByQr(eventID);

  return <TextContainer>Joining event...</TextContainer>;
};
