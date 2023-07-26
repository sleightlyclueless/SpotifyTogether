import QRCode from "qrcode.react";
import { Header } from "../components";
import { useGetUserName } from "../hooks";

import {
  EventQRContainer,
  IntroText,
  PageContainer,
  QrOverlay,
} from "../styles";

export const GenerateEventQr = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventID = urlParams.get("event") || undefined;

  const userName = useGetUserName();

  return (
    <PageContainer>
      <Header userName={userName || undefined} />
      <EventQRContainer>
        <IntroText>Join Event: {eventID}</IntroText>
        <QrOverlay>
          <QRCode value={`/join?event=${eventID}`} />
        </QrOverlay>
      </EventQRContainer>
    </PageContainer>
  );
};
