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
  const { updateEvent } = useUpdateEvent();

  const handleSave = async () => {
    const changedEvent = {
      ...event,
      name: eventName,
      date: eventDate.toISOString(), // Convert Date to string
    };

    try {
      await updateEvent(event.id, changedEvent); // Call the hook function to update the event
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
          const selectedDate =
            typeof e.detail.value === "string"
              ? new Date(e.detail.value)
              : e.detail.value;

          // Check for undefined before setting the state
          if (selectedDate instanceof Date) {
            setEventDate(selectedDate);
          } else {
            // Handle the case where selectedDate is not a Date (e.g., set a default date)
            console.log("Invalid date format");
          }
        }}
      />
      <SubmitButton onClick={handleSave}>Save Changes</SubmitButton>
    </Container>
  );
};
