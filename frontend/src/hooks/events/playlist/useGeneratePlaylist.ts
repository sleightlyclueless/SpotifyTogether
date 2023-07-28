import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export const useGeneratePlaylist = () => {
  const [accessToken, setAccessToken] = useState<string | undefined>(localStorage.getItem("accessToken") || undefined);
  const [generatePlaylistisLoading, setgeneratePlaylistisLoading] =
    useState<boolean>(false);

  const generatePlaylist = async (eventId: string) => {
    setgeneratePlaylistisLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:4000/events/${eventId}/algorithm/generate`,
        null,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
      const newAccessToken = response.data.newOwnerToken;
      setAccessToken(newAccessToken);
      localStorage.setItem("accessToken", newAccessToken);
      toast.success("Playlist generated");
      setgeneratePlaylistisLoading(false);
      return response.data;
    } catch (error) {
      toast.error("Error generating the playlist");
      console.error("Error generating the playlist:", error);
      setgeneratePlaylistisLoading(false);
      return null;
    }
  };

  return { generatePlaylist, generatePlaylistisLoading };
};
