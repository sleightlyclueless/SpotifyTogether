import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

interface ProposePlaylistResponse {
  message: string;
  playlistId: string;
}

export const useProposePlaylist = () => {
  const userID = localStorage.getItem("userID") || undefined;
  const [proposePlaylistisLoading, setproposePlaylistisLoading] = useState<boolean>(false);

  const proposePlaylist = async (
    eventId: string,
    spotifyPlaylistId: string
  ): Promise<ProposePlaylistResponse | null> => {
    setproposePlaylistisLoading(true);
    try {
      const response = await axios.post<ProposePlaylistResponse>(
        `http://localhost:4000/events/${eventId}/tracks/save/${spotifyPlaylistId}`,
        null,
        {
          headers: {
            Authorization: userID,
          },
        }
      );
      toast.success("Playlist saved!");
      setproposePlaylistisLoading(false);
      return response.data;
    } catch (error) {
      toast.error("Error saving playlist");
      console.error("Error saving playlist:", error);
      setproposePlaylistisLoading(false);
      return null;
    }
  };

  return { proposePlaylist, proposePlaylistisLoading };
};
