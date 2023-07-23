import { FunctionComponent, useEffect, useState } from "react";
import {
  EventTrack,
  TrackStatus,
  Playlist,
  SpotifyTrack,
} from "../../constants";
import { FormContainer } from "../../styles";
import {
  useAcceptPlaylistTracks,
  useChangeEventTrackStatus,
  useFetchEventTracks,
  useFetchSpotifyPlaylistIds,
  useFetchTracksOfPlaylist,
  useGeneratePlaylist,
  useProposeNewEventTrack,
  useProposePlaylist,
  useRemovePlaylist,
} from "../../hooks";
import axios from "axios";

type EditEventPlaylistProps = {
  eventId: string;
};

export const EditEventPlaylist: FunctionComponent<EditEventPlaylistProps> = ({
  eventId,
}) => {
  const [currentEventTracks, setCurrentEventTracks] = useState<EventTrack[]>(
    []
  );
  const [proposingTrackId, setProposingTrackId] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { isLoading, error, eventTracks } = useFetchEventTracks({ eventId });
  // Inside the component
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]); // Add type annotation here

  const {
    playlistTracks,
    isLoading: isPlaylistLoading,
    error: playlistError,
    fetchTracksOfPlaylist,
  } = useFetchTracksOfPlaylist();
  const {
    isLoading: isAcceptingLoading,
    error: acceptError,
    acceptPlaylistTracks,
  } = useAcceptPlaylistTracks();
  const {
    isLoading: isRemovingLoading,
    error: removeError,
    removePlaylist,
  } = useRemovePlaylist();
  const {
    isLoading: isProposingLoading,
    error: proposeError,
    proposeNewEventTrack,
  } = useProposeNewEventTrack();
  const {
    isLoading: isGeneratingLoading,
    error: generateError,
    generatePlaylist,
  } = useGeneratePlaylist();
  const {
    isLoading: isChangingStatusLoading,
    error: statusError,
    changeEventTrackStatus,
  } = useChangeEventTrackStatus();
  const {
    spotifyPlaylistIds,
    isLoading: isFetchingSpotifyPlaylists,
    error: spotifyPlaylistsError,
    fetchSpotifyPlaylistIds,
  } = useFetchSpotifyPlaylistIds();

  useEffect(() => {
    if (!isLoading && !error) {
      setCurrentEventTracks(eventTracks);
    }
  }, [isLoading, error, eventTracks]);

  const handleAcceptPlaylistTracks = async (spotifyPlaylistId: string) => {
    try {
      const response = await acceptPlaylistTracks(
        eventId,
        spotifyPlaylistId,
        (error) => {
          if (error) {
            // Handle error if needed
            console.error("Error accepting playlist tracks:", error);
          }
        }
      );
      console.log("Accepted playlist tracks response:", response);
    } catch (error) {
      console.error("Error accepting playlist tracks:", error);
    }
  };

  const handleRemovePlaylist = async (spotifyPlaylistId: string) => {
    try {
      const response = await removePlaylist(
        eventId,
        spotifyPlaylistId,
        (error) => {
          if (error) {
            // Handle error if needed
            console.error("Error removing playlist:", error);
          }
        }
      );
      console.log("Remove playlist response:", response);
    } catch (error) {
      console.error("Error removing playlist:", error);
    }
  };

  const handleProposeTrack = async (spotifyTrackId: string) => {
    try {
      const response = await proposeNewEventTrack(
        eventId,
        spotifyTrackId,
        (error) => {
          if (error) {
            // Handle error if needed
            console.error("Error proposing new event track:", error);
          }
        }
      );
      console.log("Propose new event track response:", response);
    } catch (error) {
      console.error("Error proposing new event track:", error);
    }
  };

  const handleProposeNewTrack = async (spotifyTrackId: string) => {
    try {
      if (!spotifyTrackId) return; // Use the received spotifyTrackId directly

      // Check if the SpotifyTrack with the given ID exists
      const spotifyTrackExists = searchResults.some(
        (track) => track.id === spotifyTrackId
      );

      if (!spotifyTrackExists) {
        console.error("SpotifyTrack with ID does not exist:", spotifyTrackId);
        return;
      }

      const response = await proposeNewEventTrack(
        eventId,
        spotifyTrackId, // Pass the spotifyTrackId as the second argument
        (error) => {
          if (error) {
            // Handle error if needed
            console.error("Error proposing new event track:", error);
          }
        }
      );

      console.log("Propose new event track response:", response);
      // Clear the proposingTrackId after successfully proposing the track
      setProposingTrackId("");
    } catch (error) {
      console.error("Error proposing new event track:", error);
    }
  };

  const handleChangeTrackStatus = async (
    spotifyTrackId: string,
    newStatus: TrackStatus
  ) => {
    try {
      const response = await changeEventTrackStatus(
        eventId,
        spotifyTrackId,
        newStatus,
        (error) => {
          if (error) {
            // Handle error if needed
            console.error("Error changing event track status:", error);
          }
        }
      );
      console.log("Change event track status response:", response);
    } catch (error) {
      console.error("Error changing event track status:", error);
    }
  };

  const handleGeneratePlaylist = async () => {
    try {
      const response = await generatePlaylist(eventId, (error) => {
        if (error) {
          // Handle error if needed
          console.error("Error generating playlist:", error);
        }
      });
      console.log("Generate playlist response:", response);
    } catch (error) {
      console.error("Error generating playlist:", error);
    }
  };

  const handleFetchTracksOfPlaylist = async (spotifyPlaylistId: string) => {
    try {
      const response = await fetchTracksOfPlaylist(eventId, spotifyPlaylistId);
      console.log("Fetch tracks of playlist response:", response);
    } catch (error) {
      console.error("Error fetching tracks of playlist:", error);
    }
  };

  const handleFetchSpotifyPlaylists = async () => {
    try {
      const response = await fetchSpotifyPlaylistIds(eventId);
      console.log("Fetch Spotify playlists response:", response);
    } catch (error) {
      console.error("Error fetching Spotify playlists:", error);
    }
  };

  const handleSearch = async () => {
    try {
      if (searchQuery.length < 3) {
        // If the search query is empty, hide the dropdown and clear search results
        setShowDropdown(false);
        setSearchResults([]);
        return;
      }

      const response = await axios.post(
        `http://localhost:4000/events/${eventId}/tracks/search?query=${searchQuery}`,
        null,
        {
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
        }
      );

      // Limit the number of search results to a maximum of 10
      setSearchResults(response.data);
      setShowDropdown(true); // Show the dropdown with search results
    } catch (error) {
      console.error("Error searching for tracks:", error);
    }
  };

  return (
    <FormContainer>
      <h1>Edit Event Playlist</h1>
      {isLoading ? <p>Loading...</p> : null}
      {error ? <p>Error: {error}</p> : null}

      {/* Display Current Event Tracks */}
      <div>
        <h2>Current Event Tracks</h2>
        <ul>
          {currentEventTracks.map((eventTrack) => (
            <li key={eventTrack.track.id}>
              {eventTrack.track.name} - {eventTrack.track.artist} - Status:{" "}
              {TrackStatus[eventTrack.status]}
            </li>
          ))}
        </ul>
      </div>

      {/* Fetch Spotify Playlists */}
      <div>
        <h2>Spotify Playlists</h2>
        {isFetchingSpotifyPlaylists ? (
          <p>Loading Spotify playlists...</p>
        ) : null}
        {spotifyPlaylistsError ? <p>Error: {spotifyPlaylistsError}</p> : null}
        <button onClick={handleFetchSpotifyPlaylists}>
          Fetch Spotify Playlists
        </button>
        <ul>
          {spotifyPlaylistIds.map((playlist) => (
            <li key={playlist.id}>
              {playlist.id} - Accepted: {playlist.accepted ? "Yes" : "No"}
              <button onClick={() => handleAcceptPlaylistTracks(playlist.id)}>
                Accept Playlist Tracks
              </button>
              <button onClick={() => handleRemovePlaylist(playlist.id)}>
                Remove Playlist
              </button>
              <button onClick={() => handleFetchTracksOfPlaylist(playlist.id)}>
                Fetch Tracks of Playlist
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Display Playlist Tracks */}
      <div>
        <h2>Playlist Tracks</h2>
        {isPlaylistLoading ? <p>Loading playlist tracks...</p> : null}
        {playlistError ? <p>Error: {playlistError}</p> : null}
        <ul>
          {playlistTracks.map((eventTrack) => (
            <li key={eventTrack.track.id}>
              {eventTrack.track.name} - {eventTrack.track.artist} - Status:{" "}
              {TrackStatus[eventTrack.status]}
              <button onClick={() => handleProposeTrack(eventTrack.track.id)}>
                Propose Track
              </button>
              <button
                onClick={() =>
                  handleChangeTrackStatus(
                    eventTrack.track.id,
                    TrackStatus.DENIED
                  )
                }
              >
                Deny
              </button>
              <button
                onClick={() =>
                  handleChangeTrackStatus(
                    eventTrack.track.id,
                    TrackStatus.ACCEPTED_PLAYLIST
                  )
                }
              >
                Accept Playlist
              </button>
              <button
                onClick={() =>
                  handleChangeTrackStatus(
                    eventTrack.track.id,
                    TrackStatus.GENERATED
                  )
                }
              >
                Generate
              </button>
              <button
                onClick={() =>
                  handleChangeTrackStatus(
                    eventTrack.track.id,
                    TrackStatus.ACCEPTED
                  )
                }
              >
                Accept
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Generate Playlist */}
      <div>
        <h2>Generate Playlist</h2>
        {isGeneratingLoading ? <p>Generating playlist...</p> : null}
        {generateError ? <p>Error: {generateError}</p> : null}
        <button onClick={handleGeneratePlaylist}>Generate Playlist</button>
      </div>

      {/* New section for proposing a track */}
      <div>
        <h2>Search for a Song</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearch(); // Call handleSearch on every key change
          }}
          placeholder="Enter a song name or artist"
        />
        <button onClick={handleSearch}>Search</button>
        {showDropdown && ( // Render the dropdown only if showDropdown is true
          <div>
            <h2>Search Results</h2>
            <ul>
              {searchResults.map((track) => (
                <li key={track.id}>
                  {track.name} - {track.artist}
                  <button onClick={() => handleProposeNewTrack(track.id)}>
                    Propose Track
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </FormContainer>
  );
};
