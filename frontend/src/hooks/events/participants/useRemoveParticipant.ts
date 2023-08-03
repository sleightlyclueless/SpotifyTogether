import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

export const useRemoveParticipant = () => {
  const userID = localStorage.getItem("userID") || undefined;
  const [removeParticipantisLoading, setremoveParticipantisLoading] = useState<boolean>(false);

  const removeParticipant = (eventID: string, spotifyUserId: string): void => {
    setremoveParticipantisLoading(true);
    axios
      .put(
        `http://localhost:4000/events/${eventID}/participants/${spotifyUserId}`,
        {},
        {
          headers: {
            Authorization: userID,
          },
        }
      )
      .then(() => {
        setremoveParticipantisLoading(false);
        toast("Participant removed successfully");
      })
      .catch((error) => console.error("Error removing participant", error));
  };

  return { removeParticipant, removeParticipantisLoading };
};
