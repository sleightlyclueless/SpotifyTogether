import axios from "axios";

export const useProposePlaylist = () => {
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const proposePlaylist = async (
    eventId: string,
    spotifyPlaylistId: string
  ) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/events/${eventId}/tracks/${spotifyPlaylistId}`,
        null,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error proposing a playlist:", error);
      return null;
    }
  };

  return { proposePlaylist };
};
