import axios from "axios";
import { toast } from "react-toastify";

export const useRemoveParticipant = (accessToken: string | undefined) => {
  const removeParticipant = (eventID: string, spotifyUserId: string): void => {
    axios
      .put(
        `http://localhost:4000/events/${eventID}/participants/${spotifyUserId}`,
        {},
        {
          headers: {
            Authorization: accessToken,
          },
        }
      )
      .then(() => {
        toast("Participant removed successfully");
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  return removeParticipant;
};