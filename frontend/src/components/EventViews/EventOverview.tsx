import { FunctionComponent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { CountdownTimer } from "../CountDownTimer";
import { useDeleteEvent, useEditParticipantRole, useGetUserEvents, useGetUserName, useRemoveParticipant } from "../../hooks";
import { EditEventForm } from "../EventForms/EditEventForm";
import { EditEventPlaylist } from "./EventPlaylist";
import { Event } from "../../constants";
import { ButtonContainer, DetailViewEventContainer, Button, EventOverviewContainer, FullPartyName, NoEventsContainer, ParticipantId, ParticipantItem, ParticipantsContainer, PartyName, SinglePlaylist, StyledAiOutlineArrowDown, StyledBiCopy, StyledCode, StyledIonModal, StyledIonPopover, StyledLuClose, StyledLuEdit2, StyledMdClose, StyledRoleDropdown, StyledRoleText, Timer, TimerContainer, TimerText } from "../../styles";

type EditEventType = "none" | "editEvent" | "editPlaylist";

export const EventOverview: FunctionComponent = () => {
  // 0: Normal content; 1: EditEventForm; 2: EditEventPlaylist
  const [contentMode, setContentMode] = useState<EditEventType>("none");
  const [events, setEvents] = useState<Event[]>([]);
  const popoverRef = useRef<HTMLIonPopoverElement>(null);
  const userName = useGetUserName();
  const userEvents = useGetUserEvents();

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const { handleDelete, deleteEventisLoading } = useDeleteEvent();
  const handleDeleteEvent = async (eventID: string): Promise<void> => {
    try {
      await handleDelete(eventID);
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventID)
      );
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const { removeParticipant, removeParticipantisLoading } =
    useRemoveParticipant();
  const handleRemoveParticipant = async (
    eventID: string,
    spotifyUserId: string
  ): Promise<void> => {
    try {
      await removeParticipant(eventID, spotifyUserId);
      setEvents((prevEvents) =>
        prevEvents.map((event) => {
          if (event.id === eventID) {
            const updatedParticipants = event.participants.filter(
              (participant) => participant.user.spotifyId !== spotifyUserId
            );
            return { ...event, participants: updatedParticipants };
          }
          return event;
        })
      );
    } catch (error) {
      console.error("Error removing participant:", error);
    }
  };

  const { changeRole } = useEditParticipantRole();
  const handleChangeRole = async (
    eventID: string,
    spotifyUserId: string,
    newRole: string
  ): Promise<void> => {
    try {
      await changeRole(eventID, spotifyUserId, newRole);
      setEvents((prevEvents) =>
        prevEvents.map((event) => {
          if (event.id === eventID) {
            const updatedParticipants = event.participants.map(
              (participant) => {
                if (participant.user.spotifyId === spotifyUserId) {
                  return { ...participant, permission: newRole };
                }
                return participant;
              }
            );
            return { ...event, participants: updatedParticipants };
          }
          return event;
        })
      );
    } catch (error) {
      console.error("Error changing role:", error);
    }
  };

  const copyCode = (code: string): void => {
    navigator.clipboard.writeText(code);
    popoverRef.current?.dismiss();
    toast("Copied to clipboard!");
  };

  useEffect(() => {
    setEvents(userEvents);
  }, [userEvents]);

  return (
    <>
      <EventOverviewContainer>
        {events.length > 0 ? (
          events.map((event) => {
            const participant = event.participants.find(
              (participant) => participant.user.spotifyId === userName
            );
            if (!participant) return null;
            participant.permission = participant.permission.toUpperCase();
            const rights = participant.permission === "OWNER" ? 2 : participant.permission === "ADMIN" ? 1 : 0;
            const roles = ["PARTICIPANT", "ADMIN"];

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
                  mode="ios"
                  initialBreakpoint={0.8}
                  breakpoints={[0.0, 0.8]}
                  handleBehavior="cycle"
                >
                  {(rights > 0 || contentMode != "none") && (
                    <>
                      {contentMode !== "none" ? (
                        // Show EditEventForm
                        <StyledLuClose onClick={() => setContentMode("none")} />
                      ) : (
                        // Show EditEventPlaylist
                        <StyledLuEdit2
                          onClick={() => setContentMode("editEvent")}
                        />
                      )}
                    </>
                  )}
                  {contentMode !== "none" ? (
                    <>
                      {contentMode === "editEvent" ? (
                        // Show EditEventForm
                        <EditEventForm
                          event={event}
                          onUpdateEvent={handleUpdateEvent}
                        />
                      ) : contentMode === "editPlaylist" ? (
                        // Show EditEventPlaylist
                        <EditEventPlaylist eventId={event.id} rights={rights} />
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
                            {event.participants.map((participant) => {
                              participant.permission =
                                participant.permission.toUpperCase();
                              const participantRights = participant.permission === "OWNER" ? 2 : participant.permission === "ADMIN" ? 1 : 0;

                              return (
                                <ParticipantItem
                                  key={participant.user.spotifyId}
                                >
                                  <ParticipantId>
                                    {participant.user.spotifyId}
                                  </ParticipantId>
                                  {rights == 2 && participantRights < 2 ? (
                                    <StyledRoleDropdown
                                      value={participant.permission}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLSelectElement>
                                      ) =>
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
                                  ) : (
                                    <StyledRoleText>
                                      {participant.permission}
                                    </StyledRoleText>
                                  )}
                                  {rights > 0 && participantRights < rights && (
                                    <StyledMdClose
                                      onClick={() =>
                                        handleRemoveParticipant(
                                          event.id,
                                          participant.user.spotifyId
                                        )
                                      }
                                    />
                                  )}
                                </ParticipantItem>
                              );
                            })}
                          </div>
                        )}
                      </ParticipantsContainer>

                      {rights > 0 ? (
                        <ButtonContainer>
                          <Button id="generate-code">
                            Invite People
                          </Button>
                          <StyledIonPopover
                            ref={popoverRef}
                            trigger="generate-code"
                            side="top"
                          >
                            <StyledCode>
                              Code: {event.id}{" "}
                              <StyledBiCopy
                                onClick={() => copyCode(event.id)}
                              />
                            </StyledCode>
                            <StyledCode>
                              <Link to={`generateqr?event=${event.id}`}>
                                Invite via QR-Code
                              </Link>
                            </StyledCode>
                          </StyledIonPopover>
                          <Button
                            onClick={() => setContentMode("editPlaylist")}
                          >
                            Manage Playlist
                          </Button>
                          {rights === 2 && (
                            <Button
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              Delete Event
                            </Button>
                          )}
                        </ButtonContainer>
                      ) : (
                        <ButtonContainer>
                          <Button
                            onClick={() => setContentMode("editPlaylist")}
                          >
                            View Playlist
                          </Button>
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
