import axios from "axios";
import { SpotifyTrack } from "../../../constants";

export const useFetchTracksOfPlaylist = () => {
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const fetchTracksOfPlaylist = async (
    eventId: string,
    spotifyPlaylistId: string
  ) => {
    try {
      const response = await axios.get<SpotifyTrack[]>(
        `http://localhost:4000/events/${eventId}/tracks/${spotifyPlaylistId}`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
      console.log("response.data", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching tracks of the playlist:", error);
      return null;
    }
  };

  return { fetchTracksOfPlaylist };
};
