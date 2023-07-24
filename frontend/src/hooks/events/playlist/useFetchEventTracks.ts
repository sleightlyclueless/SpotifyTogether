import axios from "axios";
import { EventTrack } from "../../../constants";

type UseFetchEventTracksProps = {
  eventId: string;
};

export const useFetchEventTracks = ({ eventId }: UseFetchEventTracksProps) => {
  const accessToken = localStorage.getItem("accessToken") || undefined;

  const fetchEventTracks = async () => {
    try {
      const response = await axios.get<EventTrack[]>(
        `http://localhost:4000/events/${eventId}/tracks`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
      console.log("response.data", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching event tracks:", error);
      return null;
    }
  };

  return { fetchEventTracks };
};