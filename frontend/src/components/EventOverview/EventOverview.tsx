import { FunctionComponent, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { CountdownTimer } from "../CountDownTimer";
import { useGetUserEvents, useGetUserName } from "../../hooks";
import { EditEventForm } from "../NewEventForm/EditEventForm";
import { EditEventPlaylist } from "../EventPlaylist/EditEventPlaylist";
import { Event } from "../../constants";
import {
  useDeleteEvent,
  useRemoveParticipant,
  useEditParticipantRole,
} from "../../hooks";
import {
  StyledIonModal,
  EventOverviewContainer,
  ParticipantsContainer,
  ParticipantItem,
  ParticipantId,
  SinglePlaylist,
  PartyName,
  Timer,
  DetailViewEventContainer,
  FullPartyName,
  TimerContainer,
  TimerText,
  Button,
  EventButtons,
  ButtonContainer,
  StyledLuEdit2,
  StyledLuClose,
  StyledIonPopover,
  StyledCode,
  StyledBiCopy,
  StyledMdClose,
  StyledRoleDropdown,
  StyledRoleText,
  NoEventsContainer,
  StyledAiOutlineArrowDown,
} from "../../styles";

export const EventOverview: FunctionComponent = () => {
  // 0: Normal content; 1: EditEventForm; 2: EditEventPlaylist
  const [contenMode, setContentMode] = useState<number>(0);
  const events: Event[] = useGetUserEvents();
  const popoverRef = useRef<HTMLIonPopoverElement>(null);
  const accessToken = localStorage.getItem("accessToken") || undefined;
  let loggedInUserName: string | null = null;
  if (accessToken != null) {
    loggedInUserName = useGetUserName();
  }

  const handleDelete = useDeleteEvent();

  const removeParticipant = useRemoveParticipant();
  const handleRemoveParticipant = (eventID: string, spotifyUserId: string) => {
    removeParticipant(eventID, spotifyUserId);
  };

  const { changeRole } = useEditParticipantRole();
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
      <EventOverviewContainer>
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
                  {isOwner && (
                    <>
                      {contenMode != 0 ? (
                        // Show EditEventForm
                        <StyledLuClose
                          onClick={(): void => setContentMode(0)}
                        />
                      ) : (
                        // Show EditEventPlaylist
                        <StyledLuEdit2
                          onClick={(): void => setContentMode(1)}
                        />
                      )}
                    </>
                  )}
                  {contenMode ? (
                    <>
                      {contenMode === 1 ? (
                        // Show EditEventForm
                        <EditEventForm event={event} />
                      ) : contenMode === 2 ? (
                        // Show EditEventPlaylist
                        <EditEventPlaylist eventId={event.id} />
                      ) : null}
                    </>
                  ) : (
                    // Show normal content
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

                          <EventButtons onClick={(): void => setContentMode(2)}>
                            Manage Playlist
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
                          <EventButtons onClick={(): void => setContentMode(2)}>
                            View Playlist
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
      </EventOverviewContainer>
    </>
  );
};
