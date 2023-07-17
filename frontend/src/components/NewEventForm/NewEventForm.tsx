import {
  DatetimeCustomEvent,
  InputCustomEvent,
  IonDatetime,
  IonInput,
} from "@ionic/react";
import styled from "styled-components";
import { FunctionComponent, useState } from "react";
import axios from "axios";
import { COLORS } from "../../constants";
import { toast } from "react-toastify";

const Container = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  height: 75%;
`;

export const StyledEventNameInput = styled(IonInput)`
  --padding-start: 8px !important;
  margin-top: 32px;
  width: 100%;
  height: 40px;
  border-radius: 8px;
  background: ${COLORS.font};
  border: none;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
`;

export const StyledIonDatetime = styled(IonDatetime)`
  border-radius: 8px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
`;

export const SubmitButton = styled.div`
  width: 160px;
  height: 60px;
  background: ${COLORS.button};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);

  transition: all 0.5s;

  &:hover {
    cursor: pointer;
    background: ${COLORS.buttonHover};
  }
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
      toast.error("Event Name or Date is not set!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
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
    <>
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
    </>
  );
};
