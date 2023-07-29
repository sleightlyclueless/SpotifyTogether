import styled from "styled-components";
import { IonModal, IonPage } from "@ionic/react";
import { COLORS } from "./colors";

// Page Containers
export const PageContainer = styled(IonPage)`
  justify-content: flex-start;
  min-height: 100vh;
  height: 100%;
  background: #1f1f1f;
  width: 100%;
`;

export const StyledIonModal = styled(IonModal)`
  --backdrop-opacity: 0.5;
  --background: ${COLORS.background};
  color: ${COLORS.font};
`;

// Sub Containers
export const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  padding: 16px;
  gap: 16px;
`;

export const SingleButtonCenterContainer = styled.div`
  max-width: 200px;
  margin: 16px auto;
`;

export const IonContainer35 = styled.div`
  padding: 25px 15px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 35%;
  width: calc(100% - 30px);
`;

export const IonContainer80 = styled.div`
  padding: 25px 15px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 80%;
  width: calc(100% - 30px);
`;

// Buttons
export const Button = styled.div`
  min-width: 160px;
  max-width: 300px;
  min-height: 60px;
  color: ${COLORS.font};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
  transition: all 0.5s;
  margin-top: 16px;
  background: rgba(${COLORS.linkRGB}, 0.75);
  transition: all 0.5s;

  &:hover {
    cursor: pointer;
    background: rgba(${COLORS.linkRGB}, 1);
  }
`;

export const RoundButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
  position: absolute;
  bottom: 16px;
  right: calc(50% - 40px);
  background: rgba(${COLORS.linkRGB}, 0.75);
  transition: all 0.5s;

  &:hover {
    cursor: pointer;
    background: rgba(${COLORS.linkRGB}, 1);
  }
`;

// Texts
export const StyledTextL = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: white;
  text-align: center;
  margin-bottom: 16px;
`;

export const StyledText = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
