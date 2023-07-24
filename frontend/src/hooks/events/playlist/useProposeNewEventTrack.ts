import axios from "axios";

export const useProposeNewEventTrack = () => {
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const proposeNewEventTrack = async (
    eventId: string,
    spotifyTrackId: string
  ) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/events/${eventId}/tracks/${spotifyTrackId}`,
        null,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error proposing a new event track:", error);
      return null;
    }
  };

  return { proposeNewEventTrack };
};
