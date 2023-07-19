import axios from "axios";
import { toast } from "react-toastify";

export const useEditParticipantRole = () => {
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const changeRole = (
    eventID: string,
    spotifyUserId: string,
    newRole: string
  ): void => {
    axios
      .put(
        `http://localhost:4000/events/${eventID}/participants/${spotifyUserId}/${newRole}`,
        {},
        {
          headers: {
            Authorization: accessToken,
          },
        }
      )
      .then(() => {
        toast("Role changed successfully");
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  const copyCode = (code: string): void => {
    navigator.clipboard.writeText(code);
    toast("Copied to clipboard!");
  };

  return { changeRole, copyCode };
};
