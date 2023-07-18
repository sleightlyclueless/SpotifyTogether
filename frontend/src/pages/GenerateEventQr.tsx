import { useEffect } from "react";
import QRCode from "qrcode.react";
import styled from "styled-components";
import { COLORS } from "../constants";

const Container = styled.div`
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

const IntroText = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  padding: 16px;
  gap: 16px;
  width: 100%;
  height: auto;
`;

const QrOverlay = styled.div`
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
  background: rgba(${COLORS.buttonRGB}, 0.8);
`;

export const GenerateEventQr = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventID = urlParams.get("event") || undefined;

  useEffect(() => {
    // You can perform any additional logic or API calls related to generating the QR code here
  }, [eventID]);

  return (
    <Container>
      <IntroText>
        <h1>Join Event: {eventID}</h1>
      </IntroText>
      <QrOverlay>
        <QRCode value={`/join?event=${eventID}`} />
      </QrOverlay>
    </Container>
  );
};
