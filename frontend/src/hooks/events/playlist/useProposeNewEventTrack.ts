import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export const useProposeNewEventTrack = () => {
  const userID = localStorage.getItem("userID") || undefined;
  const [proposeTrackisLoading, setproposeTrackisLoading] = useState<boolean>(false);

  const proposeNewEventTrack = async (
    eventId: string,
    spotifyTrackId: string
  ) => {
    setproposeTrackisLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:4000/events/${eventId}/tracks/${spotifyTrackId}`,
        null,
        {
          headers: {
            Authorization: userID,
          },
        }
      );
      toast.success("Track added to playlist");
      setproposeTrackisLoading(false);
      return response.data;
    } catch (error) {
      toast.error("Error adding track to playlist");
      console.error("Error adding track to playlist:", error);
      setproposeTrackisLoading(false);
      return null;
    }
  };

  return { proposeNewEventTrack, proposeTrackisLoading };
};
