import axios from "axios";

export const useFetchSpotifyPlaylistIds = () => {
  const userID = localStorage.getItem("userID") || undefined;

  const fetchSpotifyPlaylistIds = async (eventId: string) => {
    try {
      const response = await axios.get<string[]>(
        `http://localhost:4000/events/${eventId}/tracks/spotifyPlaylistIds`,
        {
          headers: {
            Authorization: userID,
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
