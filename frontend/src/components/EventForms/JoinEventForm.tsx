import { FunctionComponent, useEffect, useState } from "react";
import { InputCustomEvent } from "@ionic/react";
import { useJoinEvent } from "../../hooks";
import { IonContainer35, StyledInput, StyledTextL, Button } from "../../styles";

type JoinEventFormProps = {
  closeModal: () => void;
};

export const JoinEventForm: FunctionComponent<JoinEventFormProps> = ({
  closeModal,
}) => {
  const [eventID, seteventID] = useState<string | null>(null);
  const { joinEventisLoading, joinEvent } = useJoinEvent();
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const handleSubmit = () => {
    joinEvent(eventID);
    setFormSubmitted(true);
  };

  // Use useEffect to close the modal only when isLoading becomes false and formSubmitted is true.
  useEffect(() => {
    if (!joinEventisLoading && formSubmitted) closeModal();
  }, [joinEventisLoading, formSubmitted, closeModal]);

  return (
    <IonContainer35>
      <StyledTextL>Join Event</StyledTextL>
      <StyledInput
        placeholder="Enter event code"
        type={"text"}
        value={eventID}
        onIonChange={(e: InputCustomEvent): void => {
          seteventID(e.detail.value || null);
        }}
      />
      <Button onClick={handleSubmit} disabled={joinEventisLoading}>
        {joinEventisLoading ? "Joining..." : "Join Event"}
      </Button>
    </IonContainer35>
  );
};
