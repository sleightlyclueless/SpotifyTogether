import { DatetimeCustomEvent, InputCustomEvent } from "@ionic/react";
import { FunctionComponent, useEffect, useState } from "react";
import { useCreateEvent } from "../../hooks";
import {
  IonContainer35,
  StyledInput,
  StyledIonDatetime,
  Button,
  StyledTextL,
} from "../../styles";

type NewEventFormProps = {
  closeModal: () => void;
};

export const NewEventForm: FunctionComponent<NewEventFormProps> = ({
  closeModal,
}) => {
  const [eventName, setEventName] = useState<string | null>(null);
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const { createEventisLoading, createEvent } = useCreateEvent();

  // Use useEffect to close the modal only when isLoading becomes false
  useEffect(() => {
    if (!createEventisLoading) {
      setTimeout(() => {
        closeModal();
        window.location.reload();
      }, 1000);
    }
  }, [createEventisLoading, closeModal]);

  const handleSubmit = async () => {
    await createEvent(eventName || "", eventDate);
  };

  return (
    <IonContainer35>
      <StyledTextL>Create Event</StyledTextL>
      <StyledInput
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
      <Button onClick={handleSubmit}>Create Event</Button>
    </IonContainer35>
  );
};
