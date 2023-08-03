import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Event, Participant } from "../../constants";

export const useGetUserEvents = () => {
  const [eventsWithParticipants, setEventsWithParticipants] = useState<
    (Event & { participants: Participant[] })[]
  >([]);
  const [getUserEventisLoading, setgetUserEventisLoading] = useState<boolean>(false);
  const userID = localStorage.getItem("userID") || undefined;

  const fetchEventsAndParticipants = async (): Promise<void> => {
    setgetUserEventisLoading(true);
    try {
      const eventsResponse = await axios.get("http://localhost:4000/events", {
        headers: {
          Authorization: userID,
        },
      });
      const events = eventsResponse.data;

      const participantPromises = events.map(async (event: Event) => {
        try {
          const participantsResponse = await axios.get(
            `http://localhost:4000/events/${event.id}/participants`,
            {
              headers: {
                Authorization: userID,
              },
            }
          );
          const participants = participantsResponse.data.allUsers;

          setgetUserEventisLoading(false);
          return { ...event, participants, getUserEventisLoading };
        } catch (error) {
          console.error("Error fetching participants:", error);
          setgetUserEventisLoading(false);
          return { ...event, participants: [], getUserEventisLoading };
        }
      });

      const eventsWithParticipants = await Promise.all(participantPromises);
      setEventsWithParticipants(eventsWithParticipants);
    } catch (error) {
      toast.error("Failed to fetch events");
      console.error("Error fetching events:", error);
      setgetUserEventisLoading(false);
    }
  };

  useEffect(() => {
    if (!userID) return;
    fetchEventsAndParticipants();
  }, [userID]);

  return eventsWithParticipants;
};
