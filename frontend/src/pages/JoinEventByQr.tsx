import { useJoinEvent } from "../hooks";
import { TextContainer } from "../styles";

// This page just functions to access the joinEvent (qr) hook with event in url param
export const JoinEventByQr = async (): Promise<JSX.Element | null> => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventID = urlParams.get("event") || null;
  const { joinEvent } = useJoinEvent();
  if (!eventID) return <TextContainer>No event code given...</TextContainer>;

  joinEvent(eventID);
  return <TextContainer>Joining event...</TextContainer>;
};
