import axios, { AxiosError } from "axios";

export const useChangeEventTrackStatus = () => {
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const changeEventTrackStatus = async (
    eventId: string,
    spotifyTrackId: string,
    newStatus: string
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/events/${eventId}/tracks/${spotifyTrackId}/${newStatus}`,
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
        status: axiosError?.response?.status || 500,
        message:
          axiosError?.response?.data?.message ||
          axiosError.message ||
          "An unknown error occurred.",
      };
    }
  };

  return { changeEventTrackStatus };
};
