import styled from "styled-components";
import { AiOutlineReload } from "react-icons/ai";
import { COLORS } from "../../styles/colors";
import { IonDatetime, IonInput } from "@ionic/react";

export const FormContainer = styled.div`
  height: 75%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%; /* Make the container take the full width */
  margin-top: 32px; /* Add top margin to separate from other elements */
  position: relative; /* Add relative positioning */
`;

export const RandomIcon = styled(AiOutlineReload)`
  cursor: pointer;
  font-size: 24px;
  color: #007bff;
  position: absolute; /* Position the icon inside the input */
  right: 8px; /* Adjust the position from the right side */
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
  color: ${COLORS.font};
  width: 100%;
  text-align: left;
`;

export const JoinFormContainer = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  height: 40%;
`;

export const EventIDInput = styled(IonInput)`
  --padding-start: 8px !important;
  margin-top: 32px;
  width: 100%;
  height: 40px;
  border-radius: 8px;
  background: ${COLORS.font};
  border: none;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
`;

export const NewFormContainer = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  height: 75%;
`;

export const StyledEventNameInput = styled(IonInput)`
  --padding-start: 8px !important;
  margin-top: 32px;
  width: 100%;
  height: 40px;
  border-radius: 8px;
  background: ${COLORS.font};
  border: none;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
`;

export const StyledEventIdInput = styled.input`
  padding-left: 8px;
  width: 100%;
  height: 40px;
  border-radius: 8px;
  background: ${COLORS.font};
  border: none;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
`;

export const StyledIonDatetime = styled(IonDatetime)`
  border-radius: 8px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
`;

export const SubmitButton = styled.div`
  width: 160px;
  height: 60px;
  background: ${COLORS.button};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);

  transition: all 0.5s;

  &:hover {
    cursor: pointer;
    background: ${COLORS.buttonHover};
  }
`;
