import { FunctionComponent, useRef, useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { LuEdit2 } from "react-icons/lu";
import { IonPopover } from "@ionic/react";
import { BiCopy } from "react-icons/bi";
import { toast } from "react-toastify";
import { AiOutlineArrowDown } from "react-icons/ai";
import { Link } from "react-router-dom";

import { CountdownTimer } from "../CountDownTimer";
import { useGetUserEvents } from "../../hooks";
import { EventType } from "../../constants/types";
import { COLORS } from "../../constants";
import { StyledIonModal } from "../Header";
import { EditEventForm } from "./EditEventForm";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  padding: 16px;
  gap: 16px;
`;

const ParticipantsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  padding: 16px;
  gap: 16px;
  color: ${COLORS.font};
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
  background: rgba(${COLORS.buttonRGB}, 0.8);
  opacity: 0.85;
  transition: all 0.5s;

  &:hover {
    cursor: pointer;
    opacity: 1;
  }
`;

const PartyName = styled.div`
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
  width: 100px;
`;

const Timer = styled.div`
  border-radius: 12px;
  background: ${COLORS.backgroundLight};
  color: ${COLORS.background};
  padding: 8px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
`;

const DetailViewEventContainer = styled.div`
  height: 75%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const FullPartyName = styled.div`
  color: ${COLORS.font};
  margin-top: 16px;
  font-size: 20px;
`;

const TimerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TimerText = styled.div`
  color: ${COLORS.font};
`;

const Button = styled.div`
  min-width: 160px;
  min-height: 60px;
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

const EventButtons = styled(Button)`
  background: ${COLORS.backgroundLight};
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 16px;
  flex-wrap: wrap;
`;

const StyledLuEdit2 = styled(LuEdit2)`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 20px;
  height: 20px;
  color: ${COLORS.font};
  transition: all 0.5s;

  &:hover {
    cursor: pointer;
    color: ${COLORS.link};
  }
`;

const StyledIonPopover = styled(IonPopover)`
  --box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
`;

const StyledCode = styled.div`
  height: 60px;
  color: ${COLORS.background};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const StyledBiCopy = styled(BiCopy)`
  width: 20px;
  height: 20px;
  color: ${COLORS.background};
  cursor: pointer;
  transition: 0.2s ease-in-out;
`;

const NoEventsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 75vh;
  gap: 20px;
`;

const StyledAiOutlineArrowDown = styled(AiOutlineArrowDown)`
  width: 40px;
  height: 40px;
`;

export const EventOverview: FunctionComponent = () => {
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
  const [participants, setParticipants] = useState<Participant[]>([]);

  type Participant = {
    event: string;
    user: {
      spotifyId: string;
      spotifyAccessToken: string | null;
      spotifyRefreshToken: string | null;
      expiresInMs: number;
      issuedAt: string;
    };
    permission: string;
  };

  const fetchParticipants = (eventID: string): void => {
    axios
      .get(`http://localhost:4000/events/${eventID}/participants`, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setParticipants(res.data.allUsers);
        }
      })
      .catch(() => {
        toast.error("Failed to fetch participants");
      });
  };

  const events: EventType[] = useGetUserEvents();
  const popoverRef = useRef<HTMLIonPopoverElement>(null);
  const handleDelete = (eventID: string): void => {
    axios
      .delete(`http://localhost:4000/events/${eventID}`, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  const copyCode = (code: string): void => {
    navigator.clipboard.writeText(code);
    popoverRef.current?.dismiss();
    toast("Copied to clipboard!");
  };

  useEffect(() => {
    if (events.length > 0) {
      fetchParticipants(events[0].id); // Fetch participants for the first event
    }
  }, [events]);

  return (
    <>
      <Container>
        {events.length > 0 ? (
          events.map((event) => {
            return (
              <div key={event.name}>
                <SinglePlaylist id={event.name}>
                  <PartyName>{event.name}</PartyName>
                  <Timer>
                    <CountdownTimer targetDate={new Date(event.date)} />
                  </Timer>
                </SinglePlaylist>
                <StyledIonModal
                  trigger={event.name}
                  mode={"ios"}
                  initialBreakpoint={0.8}
                  breakpoints={[0.0, 0.8]}
                  handleBehavior={"cycle"}
                >
                  <StyledLuEdit2
                    onClick={(): void => setIsEditingMode(!isEditingMode)}
                  />
                  {isEditingMode ? (
                    <EditEventForm event={event} />
                  ) : (
                    <DetailViewEventContainer>
                      <FullPartyName>{event.name}</FullPartyName>
                      <TimerContainer>
                        <TimerText>Your Party starts in:</TimerText>
                        <Timer>
                          <CountdownTimer targetDate={new Date(event.date)} />
                        </Timer>
                      </TimerContainer>
                      <ParticipantsContainer>
                        {/* Display Participants */}
                        {participants.length > 0 && (
                          <div>
                            <h2>Participants:</h2>
                            <ul>
                              {participants.map((participant, index) => (
                                <li key={index}>
                                  <div>
                                    <strong>Participant {index + 1}:</strong>
                                  </div>
                                  <div>
                                    <strong>Event:</strong> {participant.event}
                                  </div>
                                  <div>
                                    <strong>Permission:</strong>{" "}
                                    {participant.permission}
                                  </div>
                                  <div>
                                    <strong>User:</strong>
                                    <ul>
                                      <li>
                                        <strong>Spotify ID:</strong>{" "}
                                        {participant.user.spotifyId}
                                      </li>
                                      <li>
                                        <strong>Expires In Ms:</strong>{" "}
                                        {participant.user.expiresInMs}
                                      </li>
                                      <li>
                                        <strong>Issued At:</strong>{" "}
                                        {participant.user.issuedAt}
                                      </li>
                                    </ul>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </ParticipantsContainer>
                      <ButtonContainer>
                        <EventButtons id={"generate-code"}>
                          Event Code
                        </EventButtons>
                        <EventButtons>Manage Roles</EventButtons>
                        <Button onClick={(): void => handleDelete(event.id)}>
                          Delete Event
                        </Button>
                        <StyledIonPopover
                          ref={popoverRef}
                          trigger={"generate-code"}
                          side={"top"}
                        >
                          <StyledCode>
                            Code: {event.id}{" "}
                            <StyledBiCopy
                              onClick={(): void => copyCode(event.id)}
                            />
                          </StyledCode>
                          <StyledCode>
                            <Link to={`generateqr?event=${event.id}`}>
                              View QR-Code:{" "}
                            </Link>
                          </StyledCode>
                        </StyledIonPopover>
                      </ButtonContainer>
                    </DetailViewEventContainer>
                  )}
                </StyledIonModal>
              </div>
            );
          })
        ) : (
          <NoEventsContainer>
            Create or join an event
            <StyledAiOutlineArrowDown />
          </NoEventsContainer>
        )}
      </Container>
    </>
  );
};
