import { FunctionComponent } from "react";
import styled from "styled-components";
import { CountdownTimer } from "../CountDownTimer";
import { useGetUserEvents } from "../../hooks";
import { EventType } from "../../constants/types";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  padding: 16px;
  gap: 16px;
`;

const SinglePlaylist = styled.div`
  width: 120px;
  height: 120px;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
`;

const PartyName = styled.div``;

const Timer = styled.div`
  border-radius: 12px;
  background: #563a57;
  padding: 8px;
`;

export const PlaylistOverview: FunctionComponent = () => {
  const events: EventType[] = useGetUserEvents();
  console.log(events);

  return (
    <Container>
      {events.map((event) => {
        return (
          <SinglePlaylist key={event.name}>
            <PartyName>{event.name}</PartyName>
            <Timer>
              <CountdownTimer targetDate={new Date(event.date)} />
            </Timer>
          </SinglePlaylist>
        );
      })}
    </Container>
  );
};
