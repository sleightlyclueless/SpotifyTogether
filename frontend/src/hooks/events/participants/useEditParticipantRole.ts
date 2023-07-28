import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

export const useEditParticipantRole = () => {
  const accessToken = localStorage.getItem("accessToken") || undefined;
  const [editParticipantisLoading, seteditParticipantisLoading] = useState<boolean>(false);

  const changeRole = async (
    eventId: string,
    spotifyUserId: string,
    newRole: string
  ): Promise<void> => {
    seteditParticipantisLoading(true);
    try {
      await axios.put(
        `http://localhost:4000/events/${eventId}/participants/${spotifyUserId}/${newRole}`,
        {},
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
      toast.success("Role changed successfully");
      seteditParticipantisLoading(false);
    } catch (error) {
      toast.error("Error changing role");
      console.error("Error changing role", error);
      seteditParticipantisLoading(false);
    }
  };

  const copyCode = (code: string): void => {
    navigator.clipboard.writeText(code);
    toast("Copied to clipboard!");
  };

  return { changeRole, copyCode, editParticipantisLoading };
};
