import { FunctionComponent, useState } from "react";
import { InputCustomEvent } from "@ionic/react";
import { useJoinEvent } from "../../hooks";
import { JoinFormContainer, EventIDInput, SubmitButton } from "../../styles";

type JoinEventFormProps = {
  closeModal: () => void;
};

export const JoinEventForm: FunctionComponent<JoinEventFormProps> = ({
  closeModal,
}) => {
  const [eventID, seteventID] = useState<string | null>(null);
  const { isLoading, joinEvent } = useJoinEvent();
  const handleSubmit = () => {
    joinEvent(eventID, () => {
      closeModal();
      window.location.reload();
    });
  };

  return (
    <JoinFormContainer>
      <EventIDInput
        placeholder="Enter event code"
        type={"text"}
        value={eventID}
        onIonChange={(e: InputCustomEvent): void => {
          seteventID(e.detail.value || null);
        }}
      />
      <SubmitButton onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Joining..." : "Join Event"}
      </SubmitButton>
    </JoinFormContainer>
  );
};
