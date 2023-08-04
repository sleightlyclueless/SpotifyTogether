import { DatetimeCustomEvent, InputCustomEvent } from "@ionic/react";
import { ChangeEvent, FunctionComponent, useEffect, useState } from "react";
import { Event } from "../../constants";
import { useUpdateEvent } from "../../hooks";
import { toast } from "react-toastify";
import { IonContainer80, IconContainer, Label, ReloadIcon, StyledInput, StyledIonDatetime, Button, StyledTextL } from "../../styles";

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
  const { updateEventName, updateEventDate, setCustomEventId } =
    useUpdateEvent();

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
      if (customEventId !== event.id) {
        try {
          console.log("Updating event ID to ", customEventId, "...");
          await setCustomEventId(
            event.id,
            customEventId,
            eventName,
            eventDate.toISOString()
          );
          event.id = customEventId;
        } catch (error) {
          toast.error("Failed to update event ID. Please check the input.");
          console.error("Error updating event ID:", error);
          return;
        }
      }

      // Update name
      try {
        await updateEventName(event.id, eventName, event.name);
      } catch (error) {
        toast.error("Failed to update event name. Please check the input.");
        console.error("Error updating event name:", error);
        return;
      }

      // Update date
      if (eventDate.getTime() < Date.now()) {
        toast.error("Selected date is in the past.");
        return;
      }
      try {
        await updateEventDate(event.id, eventDate.toISOString());
      } catch (error) {
        toast.error("Failed to update event date. Please check the input.");
        console.error("Error updating event date:", error);
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
    <IonContainer80>
      <StyledTextL>Edit Event</StyledTextL>
      <Label>Event ID</Label>
      <IconContainer>
        <StyledInput
          type="text"
          value={customEventId}
          onIonChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFormCustomEventId(e.target.value)
          }
          placeholder={"Event ID"}
        />
        <ReloadIcon onClick={handleGenerateRandomId} />
      </IconContainer>
      <Label>Event Name</Label>
      <StyledInput
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
            toast.error("Invalid date format");
          }
        }}
      />

      <Button onClick={handleSave}>Save Changes</Button>
    </IonContainer80>
  );
};

const generateRandomId = (): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let randomId = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters[randomIndex];
  }
  return randomId;
};
