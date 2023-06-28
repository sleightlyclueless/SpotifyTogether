import styled from "styled-components";
import {
  StyledEventNameInput,
  StyledIonDatetime,
  SubmitButton,
} from "../NewEventForm";
import { DatetimeCustomEvent, InputCustomEvent } from "@ionic/react";
import { FunctionComponent, useState } from "react";
import { EventType } from "../../constants/types";
import axios from "axios";

const Container = styled.div`
  height: 75%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

type EditEventFormProps = {
  event: EventType;
};

export const EditEventForm: FunctionComponent<EditEventFormProps> = ({
  event,
}) => {
  const [eventName, setEventName] = useState<string>(event.name);
  const [eventDate, setEventDate] = useState<Date>(event.date);

  const handleSave = () => {
    const changedEvent = {
      ...event,
      name: eventName,
      date: eventDate,
    };
    axios.put(`http://localhost:4000/events/${event.id}`, changedEvent);
  };

  return (
    <Container>
      <StyledEventNameInput
        type={"text"}
        placeholder={"Event Name"}
        value={eventName}
        onIonChange={(e: InputCustomEvent): void => {
          if (e.detail.value) setEventName(e.detail.value);
        }}
      />
      <StyledIonDatetime
        value={eventDate}
        onIonChange={(e: DatetimeCustomEvent): void => {
          if (e.detail.value) setEventDate(new Date(e.detail.value.toString()));
        }}
      />
      <SubmitButton onClick={handleSave}>Save Changes</SubmitButton>
    </Container>
  );
};
