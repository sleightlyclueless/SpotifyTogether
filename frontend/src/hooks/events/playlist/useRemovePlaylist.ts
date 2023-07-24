import axios from "axios";

export const useRemovePlaylist = () => {
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const removePlaylist = async (eventId: string, spotifyPlaylistId: string) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/events/${eventId}/tracks/${spotifyPlaylistId}/remove`,
        null,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error removing the playlist:", error);
      return null;
    }
  };

  return { removePlaylist };
};
