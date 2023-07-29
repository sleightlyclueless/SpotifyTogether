import { useJoinEvent } from "../hooks";
import { PageContainer, StyledTextL } from "../styles";

// This page just functions to access the joinEvent (qr) hook with event in url param
export const JoinEventByQr = async (): Promise<JSX.Element | null> => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventID = urlParams.get("event") || null;
  const { joinEvent } = useJoinEvent();
  if (!eventID) return <StyledTextL>No event code given...</StyledTextL>;

  joinEvent(eventID);
  return <PageContainer><StyledTextL>Joining event...</StyledTextL></PageContainer>;
};
