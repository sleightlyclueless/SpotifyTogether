import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { EventType, Participant } from "../constants/types";

export const useGetUserEvents = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [participants, setParticipants] = useState<Participant[][]>([]);

  const fetchEvents = (): void => {
    axios
      .get("http://localhost:4000/events", {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
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
            Authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      if (response.status === 200) {
        return response.data.allUsers;
      }
    } catch (error) {
      toast.error("Failed to fetch participants");
    }
    return [];
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchEventParticipants = async (): Promise<void> => {
      const participantPromises = events.map((event) =>
        fetchParticipants(event.id)
      );
      const participantResults = await Promise.all(participantPromises);
      setParticipants(participantResults);
    };

    fetchEventParticipants();
  }, [events]);

  const mergedEvents = events.map((event, index) => ({
    ...event,
    participants: participants[index] || [], // Ensure participants array is available
  }));

  return mergedEvents;
};
