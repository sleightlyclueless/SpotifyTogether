import { DatetimeCustomEvent, InputCustomEvent } from "@ionic/react";
import { ChangeEvent, FunctionComponent, useEffect, useState } from "react";
import { Event } from "../../constants";
import { useUpdateEvent } from "../../hooks";
import { toast } from "react-toastify";
import { FormContainer, IconContainer, Label, RandomIcon, StyledEventIdInput, StyledEventNameInput, StyledIonDatetime, SubmitButton } from "../../styles";

type EditEventFormProps = {
  event: Event;
  onUpdateEvent: (event: Event) => void;
};

export const EditEventForm: FunctionComponent<EditEventFormProps> = ({
  event,
  onUpdateEvent,
}) => {
  const [eventName, setEventName] = useState<string>(event.name);
  const [eventDate, setEventDate] = useState<Date>(new Date(event.date));
  const [customEventId, setFormCustomEventId] = useState<string>(event.id);
  const { useUpdateEventisLoading, updateEventName, updateEventDate, setCustomEventId } = useUpdateEvent();

  useEffect(() => {
    setEventName(event.name);
    setEventDate(new Date(event.date));
    setFormCustomEventId(event.id);
  }, [event]);

  const handleSave = async () => {
    try {
      // Update ID
      if (!/^[a-zA-Z0-9]{6}$/.test(customEventId)) {
        toast.error(
          "Event ID must be exactly 6 characters long and contain only letters."
        );
        return;
      }

      // Attempt to update the event ID
      try {
        console.log("Updating event ID:", customEventId);
        await setCustomEventId(event.id, customEventId, eventName, eventDate.toISOString());
        event.id = customEventId;
      } catch (error) {
        toast.error("Failed to update event ID. Please check the input.");
        console.log(error);
        return;
      }

      // Update name
      try {
        console.log("Updating event name:", eventName, "for event:", event.id);
        await updateEventName(event.id, eventName, event.name);
      } catch (error) {
        toast.error("Failed to update event name. Please check the input.");
        console.log(error);
        return;
      }

      // Update date
      if (eventDate.getTime() < Date.now()) {
        toast.error("Selected date is in the past.");
        return;
      }
      try {
        console.log("Updating event date:", eventDate.toISOString());
        await updateEventDate(event.id, eventDate.toISOString());
      } catch (error) {
        toast.error("Failed to update event date. Please check the input.");
        console.log(error);
        return;
      }

      // Show success message
      toast("Event details updated successfully.");
      onUpdateEvent({
        ...event,
        name: eventName,
        date: eventDate.toISOString(),
        id: customEventId,
      });
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleGenerateRandomId = () => {
    const randomId = generateRandomId();
    setFormCustomEventId(randomId);
  };

  return (
    <FormContainer>
      <Label>Event ID</Label>
      <IconContainer>
        <StyledEventIdInput
          type="text"
          value={customEventId}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFormCustomEventId(e.target.value)
          }
          placeholder={"Event ID"}
        />
        <RandomIcon onClick={handleGenerateRandomId} />
      </IconContainer>
      <Label>Event Name</Label>
      <StyledEventNameInput
        type={"text"}
        placeholder={"Event Name"}
        value={eventName}
        onIonChange={(e: InputCustomEvent): void => {
          if (e.detail.value) setEventName(e.detail.value);
        }}
      />
      <Label>Event Date</Label>
      <StyledIonDatetime
        value={eventDate.toISOString()}
        onIonChange={(e: DatetimeCustomEvent): void => {
          const selectedDate =
            typeof e.detail.value === "string"
              ? new Date(e.detail.value)
              : e.detail.value;

          if (selectedDate instanceof Date) {
            setEventDate(selectedDate);
          } else {
            console.log("Invalid date format");
          }
        }}
      />
      {useUpdateEventisLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <SubmitButton onClick={handleSave}>Save Changes</SubmitButton>
        </>
      )}
    </FormContainer>
  );
};

const generateRandomId = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let randomId = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters[randomIndex];
  }
  return randomId;
};
