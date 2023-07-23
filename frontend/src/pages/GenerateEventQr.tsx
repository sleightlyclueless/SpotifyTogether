import QRCode from "qrcode.react";
import { Header } from "../components";
import { useGetUserName } from "../hooks";

import {
  PageContainer,
  EventQRContainer,
  IntroText,
  QrOverlay,
} from "../styles";

export const GenerateEventQr = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventID = urlParams.get("event") || undefined;

  const userName = useGetUserName();

  return (
    <PageContainer>
      <Header
        title={"Join Event via QR Code"}
        userName={userName || undefined}
      />
      <EventQRContainer>
        <IntroText>
          <h1>Join Event: {eventID}</h1>
        </IntroText>
        <QrOverlay>
          <QRCode value={`/join?event=${eventID}`} />
        </QrOverlay>
      </EventQRContainer>
    </PageContainer>
  );
};
