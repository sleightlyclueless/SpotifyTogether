import { FunctionComponent, useState } from "react";
import styled from "styled-components";
import { InputCustomEvent, IonInput } from "@ionic/react";
import { COLORS } from "../../constants";
import axios from "axios";
import { toast } from "react-toastify";

import { SubmitButton } from "./NewEventForm";

const Container = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  height: 40%;
`;

const EventCodeInput = styled(IonInput)`
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
export const JoinEventForm: FunctionComponent<JoinEventFormProps> = ({
  closeModal,
}) => {
  const [eventCode, setEventCode] = useState<string | null>(null);
  const handleSubmit = () => {
    if (!eventCode) {
      console.log("Event code is null");
      return;
    }
    axios
      .get(`http://localhost:4000/events/${eventCode}`, {
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          closeModal();
          window.location.reload();
        }
      })
      .catch(() => {
        toast.error("Event code is invalid!");
      });
  };

  return (
    <Container>
      <EventCodeInput
        placeholder="Enter event code"
        type={"text"}
        value={eventCode}
        onIonChange={(e: InputCustomEvent): void => {
          setEventCode(e.detail.value || null);
        }}
      />
      <SubmitButton onClick={handleSubmit}>Join Event</SubmitButton>
    </Container>
  );
};
