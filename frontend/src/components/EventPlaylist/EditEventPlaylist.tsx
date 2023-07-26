import { FunctionComponent, useEffect, useState } from "react";
import { SpotifyTrack } from "../../constants";
import {
  Button,
  ButtonContainer,
  DeleteIcon,
  FormContainer,
  LoadingContainer,
  LoadingSpinner,
  SearchItemContainer,
  SearchResultsContainer,
  SongContainer,
  SongItemContainer,
  SongItemImage,
  SongItemText,
  StyledDeleteButton,
  StyledEventIdInput,
  StyledText,
} from "../../styles";
import {
  useFetchSpotifyPlaylistIds,
  useFetchTracksOfPlaylist,
  useGeneratePlaylist,
  useProposeNewEventTrack,
  useProposePlaylist,
  useRemoveEventTrack,
  useSearchTracks,
} from "../../hooks";

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
  const { proposePlaylist } = useProposePlaylist();

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

  const handleSavePlaylist = async () => {
    setIsLoading(true);
    try {
      if (!currentPlaylistId) return;

      const response = await proposePlaylist(eventId, currentPlaylistId);
      console.log("Playlist save response: ", response);
      setIsLoading(false);
    } catch (error) {
      console.error("Error proposing a playlist:", error);
      setIsLoading(false);
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
      {/* Display Current Event Tracks */}
      <StyledText>Current Event Tracks</StyledText>
      <SongContainer>
        {currentPlaylistTracks?.map((track: SpotifyTrack) => (
          <SongItemContainer key={track.id}>
            <SongItemImage src={track.albumImage} alt={track.name} />
            <SongItemText>
              {track.artistName} - {track.name}
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
        <>
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
        </>
      )}
      {/* Save Playlist Button */}
      {currentPlaylistId && !isLoading && (
        <ButtonContainer>
          <Button onClick={handleGeneratePlaylist}>Regenerate Playlist</Button>
          <Button onClick={() => handleSavePlaylist()}>Save Playlist</Button>
        </ButtonContainer>
      )}
    </FormContainer>
  );
};
