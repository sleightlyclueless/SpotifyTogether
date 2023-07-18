import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { EventType, Participant } from "../constants/types";

export const useGetUserEvents = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

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

  const fetchParticipants = (eventID: string): void => {
    axios
      .get(`http://localhost:4000/events/${eventID}/participants`, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setParticipants(response.data.allUsers);
        }
      })
      .catch(() => {
        toast.error("Failed to fetch participants");
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    events.forEach((event) => {
      fetchParticipants(event.id);
    });
  }, [events]);

  return events.map((event) => ({
    ...event,
    participants: participants.filter(
      (participant) => participant.event === event.id
    ),
  }));
};