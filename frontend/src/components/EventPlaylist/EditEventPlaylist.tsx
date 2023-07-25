import { FunctionComponent, useEffect, useState } from "react";
import { EventTrack, SpotifyTrack, TrackStatus } from "../../constants";
import { FormContainer } from "../../styles";
import {
  useAcceptPlaylistTracks,
  useChangeEventTrackStatus,
  useFetchEventTracks,
  useFetchSpotifyPlaylistIds,
  useFetchTracksOfPlaylist,
  useGeneratePlaylist,
  useProposeNewEventTrack,
  useRemovePlaylist,
  useSearchTracks,
} from "../../hooks";
import { COLORS } from "../../styles/colors";
import styled from "styled-components";

const LoadingContainer = styled.div`
  display: flex;
  height: 80%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const LoadingSpinner = styled.div`
  top: 50%;
  width: 50px;
  height: 50px;
  border: 10px solid #f3f3f3; /* Light grey */
  border-top: 10px solid #383636; /* Black */
  border-radius: 50%;
  animation: spinner 1.5s linear infinite;
  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
`;

const SearchResultsContainer = styled.div`
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SearchItemContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px; /* You can adjust the maximum width as needed */
  padding: 8px;
  border-radius: 8px;
  background: ${COLORS.font};
  border: none;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
  margin-bottom: 8px;
  transition: all 0.5s;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    background: ${COLORS.buttonHover};
  }
`;

const SearchItemImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 8px;
`;

const SearchItemText = styled.div`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledText = styled.div`
  color: ${COLORS.font};
  font-size: 16px;
`;

type EditEventPlaylistProps = {
  eventId: string;
};

export const EditEventPlaylist: FunctionComponent<EditEventPlaylistProps> = ({
  eventId,
}) => {
  const { fetchEventTracks } = useFetchEventTracks({ eventId });
  const [playlistTracks, setPlaylistTracks] = useState<EventTrack[]>([]); // Fix: Add state for playlistTracks
  const [isLoading, setIsLoading] = useState(false);

  const { fetchTracksOfPlaylist } = useFetchTracksOfPlaylist();
  const { acceptPlaylistTracks } = useAcceptPlaylistTracks();
  const { removePlaylist } = useRemovePlaylist();
  const { proposeNewEventTrack } = useProposeNewEventTrack();
  const { generatePlaylist } = useGeneratePlaylist();
  const { changeEventTrackStatus } = useChangeEventTrackStatus();
  const { fetchSpotifyPlaylistIds } = useFetchSpotifyPlaylistIds();

  const [currentEventTracks, setCurrentEventTracks] = useState<
    EventTrack[] | null
  >(null);
  const { searchResults, showDropdown, searchTracks } = useSearchTracks();
  const [proposingTrackId, setProposingTrackId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchingEventTracks, setFetchingEventTracks] = useState(false);

  useEffect(() => {
    const fetchCurrentEventTracks = async () => {
      try {
        setFetchingEventTracks(true);
        const eventTracks = await fetchEventTracks();
        //console.log("Current event tracks:", eventTracks);
        setCurrentEventTracks(eventTracks || []); // Handle the case when eventTracks is null
        setFetchingEventTracks(false);
      } catch (error) {
        console.error("Error fetching current event tracks:", error);
        setFetchingEventTracks(false);
      }
    };

    fetchCurrentEventTracks();
  }, [eventId]); // Fetch current event tracks on component mount and whenever the eventId changes

  useEffect(() => {
    fetchEventTracks();
  }, [fetchEventTracks]);

  const handleSearch = async () => {
    // Update the searchTracks function to use the hook
    try {
      await searchTracks(eventId, searchQuery);
    } catch (error) {
      console.error("Error searching for tracks:", error);
    }
  };

  const handleAcceptPlaylistTracks = async (spotifyPlaylistId: string) => {
    try {
      const response = await acceptPlaylistTracks(eventId, spotifyPlaylistId);
      console.log("Accepted playlist tracks response:", response);
    } catch (error) {
      console.error("Error accepting playlist tracks:", error);
    }
  };

  const handleRemovePlaylist = async (spotifyPlaylistId: string) => {
    try {
      const response = await removePlaylist(eventId, spotifyPlaylistId);
      console.log("Remove playlist response:", response);
    } catch (error) {
      console.error("Error removing playlist:", error);
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

      const response = await proposeNewEventTrack(eventId, spotifyTrackId);

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
        newStatus.toString() // Fix 2: Convert TrackStatus to string
      );
      console.log("Change event track status response:", response);
    } catch (error) {
      console.error("Error changing event track status:", error);
    }
  };

  const handleGeneratePlaylist = async () => {
    setIsLoading(true);
    try {
      const response = await generatePlaylist(eventId);
      console.log("Generate playlist response:", response);
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating playlist:", error);
      setIsLoading(false);
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

  if (isLoading)
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );

  return (
    <FormContainer>
      <StyledText>Edit Event Playlist</StyledText>

      {/* Display Current Event Tracks */}
      <div>
        <StyledText>Current Event Tracks</StyledText>
        {fetchingEventTracks ? (
          <p>Loading current event tracks...</p>
        ) : (
          <ul>
            {currentEventTracks?.map((eventTrack) => (
              <li key={eventTrack.track.id}>
                {eventTrack.track.name} - {eventTrack.track.artist} - Status:{" "}
                {TrackStatus[eventTrack.status]}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Fetch Spotify Playlists */}
      <div>
        <StyledText>Spotify Playlists</StyledText>
        <button onClick={handleFetchSpotifyPlaylists}>
          Fetch Spotify Playlists
        </button>
        <ul>
          {playlistTracks.map((eventTrack: EventTrack) => (
            <li key={eventTrack.track.id}>
              {eventTrack.track.name} - {eventTrack.track.artist} - Status:{" "}
              {TrackStatus[eventTrack.status]}
              <button
                onClick={() => handleProposeNewTrack(eventTrack.track.id)}
              >
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

      {/* Display Playlist Tracks */}
      <div>
        <StyledText>Playlist Tracks</StyledText>
        <ul>
          {playlistTracks.map((eventTrack: EventTrack) => (
            <li key={eventTrack.track.id}>
              {eventTrack.track.name} - {eventTrack.track.artist} - Status:{" "}
              {TrackStatus[eventTrack.status]}
              <button
                onClick={() => handleProposeNewTrack(eventTrack.track.id)}
              >
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
        <StyledText>Generate Playlist</StyledText>
        <button onClick={handleGeneratePlaylist}>Generate Playlist</button>
      </div>

      {/* New section for proposing a track */}
      <div>
        <StyledText>Search for a Song</StyledText>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearch();
          }}
          placeholder="Enter a song name or artist"
        />
        {showDropdown && (
          <div>
            <StyledText>Search Results</StyledText>
            <SearchResultsContainer>
              {searchResults.map((track: SpotifyTrack) => (
                <SearchItemContainer
                  key={track.id}
                  onClick={() => handleProposeNewTrack(track.id)}
                >
                  <SearchItemImage src={track.albumImage} alt={track.name} />
                  <SearchItemText>
                    {track.name} - {track.artist}
                  </SearchItemText>
                </SearchItemContainer>
              ))}
            </SearchResultsContainer>
          </div>
        )}
      </div>
    </FormContainer>
  );
};
