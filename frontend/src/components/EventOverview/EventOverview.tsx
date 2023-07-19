import { FunctionComponent, useRef, useState } from "react";
import styled from "styled-components";
import { LuEdit2 } from "react-icons/lu";
import { IonPopover } from "@ionic/react";
import { BiCopy } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import { AiOutlineArrowDown } from "react-icons/ai";
import { Link } from "react-router-dom";

import { CountdownTimer } from "../CountDownTimer";
import { useGetUserEvents, useGetUserName } from "../../hooks";
import { COLORS } from "../../constants";
import { StyledIonModal } from "../Header";
import { EditEventForm } from "./EditEventForm";
import { EventType } from "../../constants/types";
import { useDeleteEvent } from "../../hooks/events/useDeleteEvent";
import { useRemoveParticipant } from "../../hooks/events/participants/useRemoveParticipant";
import { useEditParticipantRole } from "../../hooks/events/participants/useEditParticipantRole";

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

const ParticipantItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid ${COLORS.font};
`;

const ParticipantId = styled.div`
  font-weight: bold;
  min-width: 100px;
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

const StyledMdClose = styled(MdClose)`
  width: 20px;
  height: 20px;
  color: ${COLORS.font};
  cursor: pointer;
  transition: 0.2s ease-in-out;
`;

const StyledRoleDropdown = styled.select`
  padding: 8px;
  border-radius: 8px;
  background: ${COLORS.backgroundLight};
  color: ${COLORS.font};
  border: none;
  font-size: 14px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
`;

const StyledRoleText = styled.div`
  min-width: 100px;
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
  const events: EventType[] = useGetUserEvents();
  const popoverRef = useRef<HTMLIonPopoverElement>(null);
  const accessToken = localStorage.getItem("accessToken") || undefined;
  let loggedInUserName: string | undefined = undefined;
  if (accessToken != undefined) {
    loggedInUserName = useGetUserName(accessToken);
  }

  const handleDelete = useDeleteEvent(accessToken);
  const handleDeleteEvent = (eventID: string): void => {
    handleDelete(eventID);
  };

  const removeParticipant = useRemoveParticipant(accessToken);
  const handleRemoveParticipant = (eventID: string, spotifyUserId: string) => {
    removeParticipant(eventID, spotifyUserId);
  };

  const { changeRole } = useEditParticipantRole(accessToken);
  const handleChangeRole = (
    eventID: string,
    spotifyUserId: string,
    newRole: string
  ) => {
    changeRole(eventID, spotifyUserId, newRole);
  };

  const copyCode = (code: string): void => {
    navigator.clipboard.writeText(code);
    popoverRef.current?.dismiss();
    toast("Copied to clipboard!");
  };

  return (
    <>
      <Container>
        {events.length > 0 ? (
          events.map((event) => {
            const participant = event.participants.find(
              (participant) => participant.user.spotifyId === loggedInUserName
            );

            if (!participant) {
              return null; // Skip rendering the event if the user is not a participant
            }

            participant.permission = participant.permission.toUpperCase();

            const roles = ["PARTICIPANT", "ADMIN"];
            const isOwner = participant.permission === "OWNER";
            const isAdmin = participant.permission === "ADMIN";
            const isParticipant = participant.permission === "PARTICIPANT";

            return (
              <div key={event.id}>
                <SinglePlaylist id={event.id}>
                  <PartyName>{event.name}</PartyName>
                  <Timer>
                    <CountdownTimer targetDate={new Date(event.date)} />
                  </Timer>
                </SinglePlaylist>
                <StyledIonModal
                  trigger={event.id}
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
                        {event.participants.length > 0 && (
                          <div>
                            <h2>Participants:</h2>
                            {event.participants.map(
                              (participant) => (
                                (participant.permission =
                                  participant.permission.toUpperCase()),
                                (
                                  <ParticipantItem
                                    key={participant.user.spotifyId}
                                  >
                                    <ParticipantId>
                                      {participant.user.spotifyId}
                                    </ParticipantId>
                                    {isOwner &&
                                      participant.permission === "OWNER" && (
                                        <>
                                          <StyledRoleText>
                                            {participant.permission}
                                          </StyledRoleText>
                                        </>
                                      )}
                                    {isOwner &&
                                      participant.permission !== "OWNER" && (
                                        <>
                                          <StyledRoleDropdown
                                            value={participant.permission}
                                            onChange={(
                                              e: React.ChangeEvent<HTMLSelectElement>
                                            ): void =>
                                              handleChangeRole(
                                                event.id,
                                                participant.user.spotifyId,
                                                e.target.value
                                              )
                                            }
                                          >
                                            {roles.map((role) => (
                                              <option key={role} value={role}>
                                                {role}
                                              </option>
                                            ))}
                                          </StyledRoleDropdown>
                                          <StyledMdClose
                                            onClick={(): void =>
                                              handleRemoveParticipant(
                                                event.id,
                                                participant.user.spotifyId
                                              )
                                            }
                                          />
                                        </>
                                      )}

                                    {isAdmin &&
                                      (participant.permission === "OWNER" ||
                                        participant.permission === "ADMIN") && (
                                        <>
                                          <StyledRoleText>
                                            {participant.permission}
                                          </StyledRoleText>
                                        </>
                                      )}

                                    {isAdmin &&
                                      participant.permission ===
                                        "PARTICIPANT" && (
                                        <>
                                          <StyledRoleText>
                                            {participant.permission}
                                          </StyledRoleText>
                                          <StyledMdClose
                                            onClick={(): void =>
                                              handleRemoveParticipant(
                                                event.id,
                                                participant.user.spotifyId
                                              )
                                            }
                                          />
                                        </>
                                      )}
                                    {isParticipant && (
                                      <div>{participant.permission}</div>
                                    )}
                                  </ParticipantItem>
                                )
                              )
                            )}
                          </div>
                        )}
                      </ParticipantsContainer>
                      {isAdmin && (
                        <ButtonContainer>
                          <EventButtons id={"generate-code"}>
                            Invite People
                          </EventButtons>
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
                      )}
                      {isOwner && (
                        <ButtonContainer>
                          <EventButtons id={"generate-code"}>
                            Invite People
                          </EventButtons>
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
                      )}
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
