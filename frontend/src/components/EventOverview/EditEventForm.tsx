import styled from "styled-components";
import { DatetimeCustomEvent, InputCustomEvent } from "@ionic/react";
import { FunctionComponent, useState } from "react";

import {
  StyledEventNameInput,
  StyledIonDatetime,
  SubmitButton,
} from "../NewEventForm";
import { EventType } from "../../constants/types";
import { useUpdateEvent } from "../../hooks/events/useUpdateEvent";

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
  const [eventDate, setEventDate] = useState<Date>(new Date(event.date));
  const { isLoading, error, updateEvent } = useUpdateEvent();

  const handleSave = async () => {
    const changedEvent = {
      ...event,
      name: eventName,
      date: eventDate.toISOString(), // Convert Date to string
    };

    try {
      const accessToken = localStorage.getItem("accessToken") || undefined;
      await updateEvent(event.id, changedEvent, accessToken); // Call the hook function to update the event
    } catch (error) {
      console.error("Error updating event:", error);
      // Handle the error, show an error message, etc.
    }
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
        value={eventDate.toISOString()} // Convert Date to string
        onIonChange={(e: DatetimeCustomEvent): void => {
          if (e.detail.value) setEventDate(new Date(e.detail.value)); // Convert string to Date
        }}
      />
      <SubmitButton onClick={handleSave}>Save Changes</SubmitButton>
    </Container>
  );
};
