import axios from "axios";
import { Playlist } from "../../../constants";

export const useFetchSpotifyPlaylistIds = () => {
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const fetchSpotifyPlaylistIds = async (eventId: string) => {
    try {
      const response = await axios.get<Playlist[]>(
        `http://localhost:4000/events/${eventId}/tracks/spotifyPlaylistIds`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching Spotify playlist ids:", error);
      return null;
    }
  };

  return { fetchSpotifyPlaylistIds };
};
