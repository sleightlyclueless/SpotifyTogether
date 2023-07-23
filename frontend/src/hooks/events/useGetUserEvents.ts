import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Event, Participant } from "../../constants";

export const useGetUserEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [participants, setParticipants] = useState<Participant[][]>([]);
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const fetchEvents = (): void => {
    axios
      .get("http://localhost:4000/events", {
        headers: {
          Authorization: accessToken,
        },
      })
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchParticipants = async (eventID: string): Promise<Participant[]> => {
    try {
      const response = await axios.get(
        `http://localhost:4000/events/${eventID}/participants`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
      if (response.status === 200) {
        return response.data.allUsers;
      }
    } catch (error) {
      toast.error("Failed to fetch participants");
      console.log(error);
    }
    return [];
  };

  useEffect(() => {
    fetchEvents();
  }, [accessToken]);

  useEffect(() => {
    const fetchEventParticipants = async (): Promise<void> => {
      const participantPromises = events.map((event) =>
        fetchParticipants(event.id)
      );
      const participantResults = await Promise.all(participantPromises);
      setParticipants(participantResults);
    };

    fetchEventParticipants();
  }, [accessToken, events]);

  const mergedEvents = events.map((event, index) => ({
    ...event,
    participants: participants[index] || [],
  }));

  return mergedEvents;
};
