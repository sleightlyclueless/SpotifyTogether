import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { EventType, Participant } from "../../constants/types";
import { useCheckAndRefreshToken } from "../account/useCheckAndRefreshToken";

export const useGetUserEvents = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [participants, setParticipants] = useState<Participant[][]>([]);
  
  // Call the useCheckAndRefreshToken hook outside of the fetch functions
  const [accessToken, setAccessToken] = useState<string | undefined>(
    localStorage.getItem("accessToken") || undefined
  );
  useCheckAndRefreshToken(setAccessToken);

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
  }, [accessToken]); // Fetch events when the accessToken changes

  useEffect(() => {
    const fetchEventParticipants = async (): Promise<void> => {
      const participantPromises = events.map((event) =>
        fetchParticipants(event.id)
      );
      const participantResults = await Promise.all(participantPromises);
      setParticipants(participantResults);
    };

    fetchEventParticipants();
  }, [accessToken, events]); // Fetch participants when the accessToken or events change

  const mergedEvents = events.map((event, index) => ({
    ...event,
    participants: participants[index] || [], // Ensure participants array is available
  }));

  return mergedEvents;
};