import { FunctionComponent, useEffect, useState } from "react";
import { EventTrack, SpotifyTrack, TrackStatus } from "../../constants";
import {
  FormContainer,
  Button,
  TextContainer,
  StyledEventIdInput,
} from "../../styles";
import {
  useFetchSpotifyPlaylistIds, // 1. Check if a playlist already exists
  useGeneratePlaylist, // 1.1 If it does not - generate a playlist
  useFetchTracksOfPlaylist, // 1.2 If it does - fetch the tracks of the playlist
  // Note: Keep useGeneratePlaylist to start over
  useSearchTracks, // 1.3 If playlist exists provide functions to search and
  useProposeNewEventTrack, // Add a new track to the playlist
  useRemoveEventTrack, // Remove a track from the playlist
  //useSavePlaylist
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
  max-height: 100px;
  overflow-y: scroll;
`;

const SongContainer = styled.div`
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 500px;
  overflow-y: scroll;
`;

const SongItemContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px; /* You can adjust the maximum width as needed */
  min-height: 40px;
  padding: 8px;
  border-radius: 8px;
  background: ${COLORS.font};
  border: none;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
  margin-bottom: 8px;
  transition: all 0.5s;
  overflow: hidden;
`;

const SearchItemContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px; /* You can adjust the maximum width as needed */
  min-height: 40px;
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

const SongItemImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 8px;
`;

const SongItemText = styled.div`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledText = styled.div`
  color: ${COLORS.font};
  font-size: 16px;
`;

const StyledDeleteButton = styled.button`
  background-color: transparent;
  border: none;
`;

const DeleteIcon = styled.span`
  color: ${COLORS.button};
  font-size: 30px;
  transition: all 0.5s;

  &:hover {
    cursor: pointer;
    color: ${COLORS.link};
  }
`;

type EditEventPlaylistProps = {
  eventId: string;
};

export const EditEventPlaylist: FunctionComponent<EditEventPlaylistProps> = ({
  eventId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlaylistId, setCurrentPlaylistId] = useState<string | null>(
    null
  );
  const [currentPlaylistTracks, setCurrentPlaylistTracks] = useState<
    SpotifyTrack[] | null
  >(null);

  const { generatePlaylist } = useGeneratePlaylist();
  const { fetchSpotifyPlaylistIds } = useFetchSpotifyPlaylistIds();
  const { fetchTracksOfPlaylist } = useFetchTracksOfPlaylist();
  const { proposeNewEventTrack } = useProposeNewEventTrack();
  const { removeEventTrack } = useRemoveEventTrack();

  const { searchResults, showDropdown, searchTracks } = useSearchTracks();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPlaylistIds = async () => {
      try {
        const playlistIds = await fetchSpotifyPlaylistIds(eventId);
        if (playlistIds && playlistIds.length > 0) {
          setCurrentPlaylistId(playlistIds[0]);
          const tracks = await fetchTracksOfPlaylist(eventId, playlistIds[0]);
          if (tracks) setCurrentPlaylistTracks(tracks);
        }
      } catch (error) {
        console.error("Error generating playlist:", error);
        setIsLoading(false);
      }
    };
    fetchPlaylistIds();
  }, [eventId]);

  const handleGeneratePlaylist = async () => {
    setIsLoading(true);
    try {
      const response = await generatePlaylist(eventId);
      if (response && response.playlistId)
        setCurrentPlaylistId(response.playlistId);
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating playlist:", error);
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    await searchTracks(eventId, searchQuery);
  };

  const handleProposeNewTrack = async (spotifyTrackId: string) => {
    try {
      if (!currentPlaylistId) return;
      if (!spotifyTrackId) return;

      // Propose the new track using the hook
      const response = await proposeNewEventTrack(eventId, spotifyTrackId);
      console.log("Propose new event track response:", response);

      // Reload the playlist and songs after adding the new track
      const tracks = await fetchTracksOfPlaylist(eventId, currentPlaylistId);
      if (tracks) setCurrentPlaylistTracks(tracks);
    } catch (error) {
      console.error("Error proposing new event track:", error);
    }
  };

  const handleDeleteProposedTrack = async (spotifyTrackId: string) => {
    try {
      if (!currentPlaylistId) return;

      // Delete the proposed track using the hook
      const response = await removeEventTrack(eventId, spotifyTrackId);
      console.log("Remove event track response:", response);

      // Reload the playlist and songs after removing the track
      const tracks = await fetchTracksOfPlaylist(eventId, currentPlaylistId);
      if (tracks) setCurrentPlaylistTracks(tracks);
    } catch (error) {
      console.error("Error removing event track:", error);
    }
  };

  if (isLoading)
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  // If there are no playlists, show the generate playlist button
  if (!currentPlaylistId) {
    return (
      <FormContainer>
        {/* Generate Playlist Button */}
        <StyledText>Generate Playlist</StyledText>
        <Button onClick={handleGeneratePlaylist}>Generate Playlist</Button>
        <StyledText>No playlist found.</StyledText>
      </FormContainer>
    );
  }

  // If there is a playlist, display the tracks and the search functionality
  return (
    <FormContainer>
      {/* Generate Playlist Button */}
      <StyledText>Generate Playlist</StyledText>
      <Button onClick={handleGeneratePlaylist}>Generate Playlist</Button>

      {/* Display Current Event Tracks */}
      <StyledText>Current Event Tracks</StyledText>
      <SongContainer>
        {currentPlaylistTracks?.map((track: SpotifyTrack) => (
          <SongItemContainer key={track.id}>
            <SongItemImage src={track.albumImage} alt={track.name} />
            <SongItemText>
              {track.name} - {track.artist}
            </SongItemText>
            <StyledDeleteButton
              onClick={() => handleDeleteProposedTrack(track.id)}
            >
              <DeleteIcon>&times;</DeleteIcon>
            </StyledDeleteButton>
          </SongItemContainer>
        ))}
      </SongContainer>

      {/* New section for proposing a track */}
      <StyledText>Search for a Song</StyledText>
      <StyledEventIdInput
        type="text"
        value={searchQuery}
        onChange={(e: any) => {
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
                <SongItemImage src={track.albumImage} alt={track.name} />
                <SongItemText>
                  {track.name} - {track.artist}
                </SongItemText>
              </SearchItemContainer>
            ))}
          </SearchResultsContainer>
        </div>
      )}
    </FormContainer>
  );
};
