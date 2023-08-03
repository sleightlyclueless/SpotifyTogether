import axios from "axios";
import { SpotifyTrack } from "../../../constants";
import { useState } from "react";
import { toast } from "react-toastify";

export const useFetchTracksOfPlaylist = () => {
  const userID = localStorage.getItem("userID") || undefined;
  const [fetchTracksOfPlaylistisLoading, setfetchTracksOfPlaylistisLoading] = useState<boolean>(false);

  const fetchTracksOfPlaylist = async (
    eventId: string,
    spotifyPlaylistId: string
  ): Promise<SpotifyTrack[] | null> => {
    setfetchTracksOfPlaylistisLoading(true);
    try {
      const response = await axios.get<SpotifyTrack[]>(
        `http://localhost:4000/events/${eventId}/tracks/${spotifyPlaylistId}`,
        {
          headers: {
            Authorization: userID,
          },
        }
      );
      // toast.success("Tracks fetched");
      setfetchTracksOfPlaylistisLoading(false);
      return response.data;
    } catch (error) {
      toast.error("Error fetching tracks of the playlist");
      console.error("Error fetching tracks of the playlist:", error);
      setfetchTracksOfPlaylistisLoading(false);
      return null;
    }
  };

  return { fetchTracksOfPlaylist, fetchTracksOfPlaylistisLoading };
};
