import { DatetimeCustomEvent, InputCustomEvent } from "@ionic/react";
import { FunctionComponent, useState } from "react";
import { useCreateEvent } from "../../hooks";
import { toast } from "react-toastify";
import {
  NewFormContainer,
  StyledEventNameInput,
  StyledIonDatetime,
  SubmitButton,
} from "../../styles";

type NewEventFormProps = {
  closeModal: () => void;
};

export const NewEventForm: FunctionComponent<NewEventFormProps> = ({
  closeModal,
}) => {
  const [eventName, setEventName] = useState<string | null>(null);
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const { createEvent } = useCreateEvent(); // Use the hook

  const handleSubmit = async () => {
    await createEvent(eventName || "", eventDate, (error) => {
      if (!error) {
        closeModal();
        window.location.reload();
      } else {
        toast.error(error);
      }
    });
  };

  return (
    <>
      <NewFormContainer>
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
      </NewFormContainer>
    </>
  );
};
