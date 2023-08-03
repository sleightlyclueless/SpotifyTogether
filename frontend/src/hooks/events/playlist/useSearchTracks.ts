import { useState } from "react";
import axios from "axios";
import { SpotifyTrack } from "../../../constants";

export const useSearchTracks = () => {
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchTracks = async (eventId: string, searchQuery: string) => {
    try {
      if (searchQuery.length < 3) {
        setShowDropdown(false);
        setSearchResults([]);
        return;
      }

      const response = await axios.get<SpotifyTrack[]>(
        `http://localhost:4000/events/${eventId}/tracks/search`,
        {
          params: {
            query: searchQuery,
          },
          headers: {
            Authorization: localStorage.getItem("userID"),
          },
        }
      );

      setSearchResults(response.data);
      setShowDropdown(response.data.length > 0);
    } catch (error) {
      console.error("Error searching for tracks:", error);
    }
  };

  return { searchResults, showDropdown, searchTracks };
};