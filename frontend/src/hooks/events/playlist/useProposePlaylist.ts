import axios, { AxiosError } from "axios";

interface ProposePlaylistResponse {
  message: string;
  playlistId: string;
}

export const useProposePlaylist = () => {
  const accessToken = localStorage.getItem("accessToken") || undefined;
  console.log("proposing playlist with: ", accessToken);

  const proposePlaylist = async (
    eventId: string,
    spotifyPlaylistId: string
  ): Promise<ProposePlaylistResponse | null> => {
    try {
      const response = await axios.post<ProposePlaylistResponse>(
        `http://localhost:4000/events/${eventId}/tracks/save/${spotifyPlaylistId}`,
        null,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

      // Return the relevant data from the response
      return {
        message: response.data.message,
        playlistId: response.data.playlistId,
      };
    } catch (error) {
      console.error(
        "Error proposing a playlist:",
        (error as AxiosError).message
      );
      return null;
    }
  };

  return { proposePlaylist };
};

export default useProposePlaylist;
