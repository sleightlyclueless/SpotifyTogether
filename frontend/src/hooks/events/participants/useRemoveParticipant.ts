import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { useCheckAndRefreshToken } from "../../account/useCheckAndRefreshToken";

export const useRemoveParticipant = () => {
  const [accessToken, setAccessToken] = useState<string | undefined>(
    localStorage.getItem("accessToken") || undefined
  );
  useCheckAndRefreshToken(setAccessToken);
  
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
