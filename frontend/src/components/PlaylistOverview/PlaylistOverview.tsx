import { FunctionComponent } from "react";
import styled from "styled-components";
import { CountdownTimer } from "../CountDownTimer";

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
  const parties = [
    {
      id: 1,
      name: "Party 1",
      start: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    },
    {
      id: 2,
      name: "Party 2",
      start: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    },
    {
      id: 3,
      name: "Party 3",
      start: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
    {
      id: 4,
      name: "Party 4",
      start: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
    {
      id: 5,
      name: "Party 5",
      start: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  ];

  return (
    <Container>
      {parties.map((party) => {
        return (
          <SinglePlaylist key={party.id}>
            <PartyName>{party.name}</PartyName>
            <Timer>
              <CountdownTimer targetDate={party.start} />
            </Timer>
          </SinglePlaylist>
        );
      })}
    </Container>
  );
};
