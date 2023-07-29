import styled from "styled-components";
import { AiOutlineReload } from "react-icons/ai";
import { COLORS } from "../colors";
import { IonDatetime, IonInput } from "@ionic/react";

export const Label = styled.label`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
  color: ${COLORS.font};
  width: 100%;
  text-align: left;
`;

export const StyledInput = styled(IonInput)`
  width: 100%;
  height: 40px;
  border-radius: 8px;
  background: ${COLORS.backgroundLight};
  color: ${COLORS.fontDark} !important;
  border: none;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
  margin-bottom: 16px;
  input {
    padding-left: 8px !important;
  }
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 12px;
  position: relative;
`;

export const ReloadIcon = styled(AiOutlineReload)`
  cursor: pointer;
  font-size: 24px;
  color: ${COLORS.link};
  position: absolute;
  right: 8px;
  margin-bottom: 16px;
  z-index: 2;
`;

export const StyledIonDatetime = styled(IonDatetime)`
  border-radius: 8px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
  color: ${COLORS.fontDark} !important;
  margin-bottom: 16px;
`;
