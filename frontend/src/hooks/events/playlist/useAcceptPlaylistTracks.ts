import axios, { AxiosError } from "axios";

export const useAcceptPlaylistTracks = () => {
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const acceptPlaylistTracks = async (
    eventId: string,
    spotifyPlaylistId: string
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/events/${eventId}/tracks/${spotifyPlaylistId}/accept`,
        null,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<any>;

      return {
        error: {
          status: axiosError?.response?.status || 500,
          message:
            axiosError?.response?.data?.message ||
            axiosError.message ||
            "An unknown error occurred.",
        },
      };
    }
  };

  return { acceptPlaylistTracks };
};
