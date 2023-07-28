import axios from "axios";
import { useState } from "react";

export const useUpdateEvent = () => {
  const [useUpdateEventisLoading, setuseUpdateEventisLoading] = useState<boolean>(false);
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const callUpdateAPI = async (url: string, data?: any) => {
    setuseUpdateEventisLoading(true);

    await axios
      .put(url, data, {
        headers: {
          Authorization: accessToken,
        },
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setuseUpdateEventisLoading(false);
      });
  };

  const setCustomEventId = async (
    eventID: string,
    newEventId: string,
    newName: string,
    newDate: string
  ) => {
    await callUpdateAPI(
      `http://localhost:4000/events/${eventID}/settings/id/${newEventId}`,
      {
        newName,
        newDate,
      }
    );
  };

  const updateEventName = async (
    eventID: string,
    newName: string,
    currentName: string
  ) => {
    if (newName !== currentName) {
      await callUpdateAPI(
        `http://localhost:4000/events/${eventID}/settings/name/${newName}`
      );
    }
  };

  const updateEventDate = async (eventID: string, newDate: string) => {
    const eventDateString = new Date(newDate).toISOString();
    await callUpdateAPI(
      `http://localhost:4000/events/${eventID}/settings/date/${eventDateString}`
    );
  };

  /*
  const lockEvent = async (eventID: string) => {
    await callUpdateAPI(
      `http://localhost:4000/events/${eventID}/settings/lock`
    );
  };

  const unlockEvent = async (eventID: string) => {
    await callUpdateAPI(
      `http://localhost:4000/events/${eventID}/settings/unlock`
    );
  };
  */

  return {
    useUpdateEventisLoading,
    setCustomEventId,
    updateEventName,
    updateEventDate,
    //lockEvent,
    //unlockEvent,
  };
};
