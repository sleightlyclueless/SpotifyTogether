import {
  DatetimeCustomEvent,
  InputCustomEvent,
  IonDatetime,
  IonInput,
} from "@ionic/react";
import styled from "styled-components";
import { FunctionComponent, useState } from "react";
import axios from "axios";

const Container = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
`;

const StyledEventNameInput = styled(IonInput)`
  width: 100%;
  height: 40px;
  border-radius: 8px;
  background: #563a57;
  border: none;
`;

const StyledIonDatetime = styled(IonDatetime)`
  --background: #563a57;
  border-radius: 8px;
`;

const SubmitButton = styled.div`
  width: 160px;
  height: 60px;
  background: #563a57;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
`;

type NewEventFormProps = {
  closeModal: () => void;
};

export const NewEventForm: FunctionComponent<NewEventFormProps> = ({
  closeModal,
}) => {
  const [eventName, setEventName] = useState<string | null>(null);
  const [eventDate, setEventDate] = useState<Date | null>(null);

  const handleSubmit = () => {
    if (!eventName || !eventDate) {
      //TODO: Toast
      console.log("Event name or date is null");
    } else {
      axios
        .post(
          "http://localhost:4000/events",
          {
            name: eventName,
            date: eventDate,
          },
          {
            headers: {
              Authorization: localStorage.getItem("accessToken"),
            },
          }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      closeModal();
      window.location.reload();
    }
  };

  return (
    <Container>
      <StyledEventNameInput
        type={"text"}
        placeholder={"Event Name"}
        value={eventName}
        onIonChange={(e: InputCustomEvent): void => {
          setEventName(e.detail.value || null);
        }}
      />
      <StyledIonDatetime
        value={eventDate}
        onIonChange={(e: DatetimeCustomEvent): void => {
          if (e.detail.value) {
            setEventDate(new Date(e.detail.value.toString()));
          }
        }}
      />
      <SubmitButton onClick={handleSubmit}>Create Event</SubmitButton>
    </Container>
  );
};
