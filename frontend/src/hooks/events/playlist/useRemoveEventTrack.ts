import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export const useRemoveEventTrack = () => {
  const userID = localStorage.getItem("userID") || undefined;
  const [removeTrackisLoading, setremoveTrackisLoading] = useState<boolean>(false);

  const removeEventTrack = async (eventId: string, spotifyTrackId: string) => {
    setremoveTrackisLoading(true);
    try {
      const response = await axios.delete(
        `http://localhost:4000/events/${eventId}/tracks/${spotifyTrackId}`,
        {
          headers: {
            Authorization: userID,
          },
        }
      );
      toast.success("Track removed from playlist");
      setremoveTrackisLoading(false);
      return response.data;
    } catch (error) {
      toast.error("Error removing track");
      console.error("Error removing track:", error);
      setremoveTrackisLoading(false);
      return null;
    }
  };

  return { removeEventTrack, removeTrackisLoading };
};
