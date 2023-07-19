import { FunctionComponent, useState } from "react";
import styled from "styled-components";
import { InputCustomEvent, IonInput } from "@ionic/react";
import { COLORS } from "../../constants";
import { useJoinEvent } from "../../hooks/events/useJoinEvent";

import { SubmitButton } from "./NewEventForm";

const Container = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  height: 40%;
`;

const EventIDInput = styled(IonInput)`
  --padding-start: 8px !important;
  margin-top: 32px;
  width: 100%;
  height: 40px;
  border-radius: 8px;
  background: ${COLORS.font};
  border: none;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
`;

type JoinEventFormProps = {
  closeModal: () => void;
};
export const JoinEventForm: FunctionComponent<JoinEventFormProps> = ({ closeModal }) => {
  const [eventID, seteventID] = useState<string | null>(null);
  const { isLoading, joinEvent } = useJoinEvent(); // Use the hook

  const accessToken = localStorage.getItem("accessToken") || undefined;

  const handleSubmit = () => {
    joinEvent(eventID, accessToken, () => {
      closeModal();
      window.location.reload();
    });
  };

  return (
    <Container>
      <EventIDInput
        placeholder="Enter event code"
        type={"text"}
        value={eventID}
        onIonChange={(e: InputCustomEvent): void => {
          seteventID(e.detail.value || null);
        }}
      />
      <SubmitButton onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Joining..." : "Join Event"}
      </SubmitButton>
    </Container>
  );
};