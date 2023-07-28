import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Event, Participant } from "../../constants";

export const useGetUserEvents = () => {
  const [eventsWithParticipants, setEventsWithParticipants] = useState<
    (Event & { participants: Participant[] })[]
  >([]);
  const [getUserEventisLoading, setgetUserEventisLoading] = useState<boolean>(false);
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const fetchEventsAndParticipants = async (): Promise<void> => {
    setgetUserEventisLoading(true);
    try {
      const eventsResponse = await axios.get("http://localhost:4000/events", {
        headers: {
          Authorization: accessToken,
        },
      });
      const events = eventsResponse.data;

      const participantPromises = events.map(async (event: Event) => {
        try {
          const participantsResponse = await axios.get(
            `http://localhost:4000/events/${event.id}/participants`,
            {
              headers: {
                Authorization: accessToken,
              },
            }
          );
          const participants = participantsResponse.data.allUsers;

          setgetUserEventisLoading(false);
          return { ...event, participants, getUserEventisLoading };
        } catch (error) {
          console.log("Error fetching participants:", error);
          setgetUserEventisLoading(false);
          return { ...event, participants: [], getUserEventisLoading };
        }
      });

      const eventsWithParticipants = await Promise.all(participantPromises);
      setEventsWithParticipants(eventsWithParticipants);
    } catch (error) {
      toast.error("Failed to fetch events");
      console.log("Error fetching events:", error);
      setgetUserEventisLoading(false);
    }
  };

  useEffect(() => {
    if (!accessToken) return;
    fetchEventsAndParticipants();
  }, [accessToken]);

  return eventsWithParticipants;
};
