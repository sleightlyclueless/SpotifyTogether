import axios from "axios";

export const useRemoveEventTrack = () => {
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const removeEventTrack = async (eventId: string, spotifyTrackId: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/events/${eventId}/tracks/${spotifyTrackId}`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting a proposed event track:", error);
      return null;
    }
  };

  return { removeEventTrack };
};
