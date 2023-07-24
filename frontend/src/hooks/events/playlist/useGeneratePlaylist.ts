import axios from "axios";

export const useGeneratePlaylist = () => {
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const generatePlaylist = async (eventId: string) => {
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
      return response.data;
    } catch (error) {
      console.error("Error generating the playlist:", error);
      return null;
    }
  };

  return { generatePlaylist };
};
