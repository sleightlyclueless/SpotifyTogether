import styled from "styled-components";
import { IonModal, IonPage } from "@ionic/react";
import { COLORS } from "./colors";

export const StyledIonModal = styled(IonModal)`
  --backdrop-opacity: 0.5;
  --background: ${COLORS.background};
`;

export const Button = styled.div`
  min-width: 160px;
  min-height: 60px;
  color: ${COLORS.font};
  background: ${COLORS.button};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
  transition: all 0.5s;
`;

export const EventButtons = styled(Button)`
  background: ${COLORS.backgroundLight};
  color: ${COLORS.font};
`;

export const BigButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${COLORS.button};
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
  position: absolute;
  bottom: 16px;
  right: calc(50% - 40px);
  transition: all 0.5s;
`;

export const PageContainer = styled(IonPage)`
  justify-content: flex-start;
  min-height: 100vh;
  height: 100%;
  background: #1f1f1f;
`;

export const VidOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: -1;
`;

export const VideoBackground = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
`;
