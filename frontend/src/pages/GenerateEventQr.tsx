import QRCode from "qrcode.react";
import { Header } from "../components";
import { useGetUserName } from "../hooks";
import { CenterContainer, StyledTextL, PageContainer, QrOverlay } from "../styles";

// Site to provide a qr code to join an event
export const GenerateEventQr = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventID = urlParams.get("event") || undefined;
  const userName = useGetUserName();

  return (
    <PageContainer>
      <Header userName={userName || undefined} />
      <CenterContainer>
        <StyledTextL>Join Event: {eventID}</StyledTextL>
        <QrOverlay>
          <QRCode value={`/join?event=${eventID}`} />
        </QrOverlay>
      </CenterContainer>
    </PageContainer>
  );
};
