import { useState } from "react";
import axios from "axios";
import { Event } from "../../constants";
import { toast } from "react-toastify";

export const useCreateEvent = () => {
  const [createEventisLoading, setcreateEventisLoading] = useState<boolean>(true);
  const userID = localStorage.getItem("userID") || undefined;

  const createEvent = async (eventName: string, eventDate: Date | null) => {
    setcreateEventisLoading(true);

    if (!eventName || !eventDate) {
      toast.error("Event Name or Date is not set!");
      setcreateEventisLoading(true);
      return;
    }

    const eventData: Event = {
      id: "",
      name: eventName,
      date: eventDate.toISOString(),
      locked: false,
      participants: [],
      eventTracks: [],
      playlists: [],
    };

    axios
      .post("http://localhost:4000/events", eventData, {
        headers: {
          Authorization: userID,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          toast.success("Event created");
          setcreateEventisLoading(false);
        } else {
          setcreateEventisLoading(true);
          toast.error("Error creating event");
          console.error("Error creating event:", response.data);
        }
      })
      .catch((error) => {
        setcreateEventisLoading(true);
        toast.error("Error creating event");
        console.error("Error creating event:", error);
      });
  };

  return { createEvent, createEventisLoading };
};
