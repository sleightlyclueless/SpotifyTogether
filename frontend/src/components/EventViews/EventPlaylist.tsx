import { FunctionComponent, useEffect, useState } from "react";
import { SpotifyTrack } from "../../constants";
import { Button, ButtonContainer, DeleteIcon, IonContainer80, LoadingSpinner, SongContainer, SongItemContainer, SongItemImage, StyledInput, StyledText, StyledTextL, SearchContainer, ContentContainer } from "../../styles";
import { useFetchSpotifyPlaylistIds,useFetchTracksOfPlaylist,useGeneratePlaylist,useProposeNewEventTrack,useProposePlaylist,useRemoveEventTrack,useSearchTracks } from "../../hooks";

type EditEventPlaylistProps = {
  eventId: string;
  rights: number; // 0 = participant, 1 = admin, 2 = owner
};

export const EditEventPlaylist: FunctionComponent<EditEventPlaylistProps> = ({
  eventId,
  rights,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [currentPlaylistId, setCurrentPlaylistId] = useState<string | null>(
    null
  );
  const [playlistTrackFilter, setCurrentPlaylistTracks] = useState<
    SpotifyTrack[] | null
  >(null);

  const { searchResults, showDropdown, searchTracks } = useSearchTracks();
  const [searchQuery, setSearchQuery] = useState("");

  const [filteredPlaylistTracks, setFilteredPlaylistTracks] = useState<
    SpotifyTrack[] | null
  >(null);
  const [searchInPlaylistQuery, setSearchInPlaylistQuery] = useState("");

  const { generatePlaylist } = useGeneratePlaylist();
  const { fetchSpotifyPlaylistIds } = useFetchSpotifyPlaylistIds();
  const { fetchTracksOfPlaylist } = useFetchTracksOfPlaylist();
  const { proposeNewEventTrack } = useProposeNewEventTrack();
  const { removeEventTrack } = useRemoveEventTrack();
  const { proposePlaylist } = useProposePlaylist();

  // Fetch playlist and songs on load & change of event or playlist
  useEffect(() => {
    const fetchPlaylistIds = async () => {
      try {
        const playlistIDs = await fetchSpotifyPlaylistIds(eventId);
        if (playlistIDs && playlistIDs.length > 0) {
          setCurrentPlaylistId(playlistIDs[0]);
          const tracks = await fetchTracksOfPlaylist(eventId, playlistIDs[0]);
          if (tracks) setCurrentPlaylistTracks(tracks);
        }
      } catch (error) {
        console.error("Error generating playlist:", error);
        setIsLoading(false);
      }
    };
    fetchPlaylistIds();
  }, [eventId, currentPlaylistId]);

  // Filter playlist tracks on load & change of playlist tracks search textbox
  useEffect(() => {
    setFilteredPlaylistTracks(playlistTrackFilter);
  }, [playlistTrackFilter]);

  const handleSearch = async () => {
    await searchTracks(eventId, searchQuery);
  };

  const handleSearchForSongInPlaylist = () => {
    console.log("called");
    const filtered = playlistTrackFilter?.filter(
      (track) =>
        track.artistName
          .toLowerCase()
          .includes(searchInPlaylistQuery.toLowerCase()) ||
        track.name.toLowerCase().includes(searchInPlaylistQuery.toLowerCase())
    );
    setFilteredPlaylistTracks(filtered || playlistTrackFilter);
  };

  const handleGeneratePlaylist = async () => {
    setIsLoading(true);
    try {
      const response = await generatePlaylist(eventId);
      console.log("Response:", response);
      if (response && response.playlistID)
        setCurrentPlaylistId(response.playlistID);
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating playlist:", error);
      setIsLoading(false);
    }
  };

  const handleProposeNewTrack = async (spotifyTrackId: string) => {
    try {
      if (!currentPlaylistId) return;
      if (!spotifyTrackId) return;

      // Propose the new track using the hook
      await proposeNewEventTrack(eventId, spotifyTrackId);

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
      await removeEventTrack(eventId, spotifyTrackId);

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
      setIsLoading(false);
    } catch (error) {
      console.error("Error proposing a playlist:", error);
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <IonContainer80>
        <LoadingSpinner />
      </IonContainer80>
    );

  if (currentPlaylistId && currentPlaylistId != "undefined") {
    return (
      <IonContainer80>
        {/* Display Current Event Tracks */}
        <StyledTextL>Your Playlist</StyledTextL>
        <StyledInput
          type="text"
          onIonInput={(e: any) => {
            setSearchInPlaylistQuery(e.target.value);
            handleSearchForSongInPlaylist();
          }}
          placeholder="Search for songs in playlist"
        />
        <SongContainer>
          {filteredPlaylistTracks?.map((track: SpotifyTrack) => (
            <SongItemContainer key={track.id}>
              <SongItemImage src={track.albumImage} alt={track.name} />
              <StyledText>
                {track.artistName} - {track.name}
              </StyledText>
              {rights >= 1 && ( // Render delete button only if user is owner
                <DeleteIcon onClick={() => handleDeleteProposedTrack(track.id)}>
                  &times;
                </DeleteIcon>
              )}
            </SongItemContainer>
          ))}
        </SongContainer>

        {/* New section for proposing a track */}
        {rights >= 1 &&
          currentPlaylistId &&
          currentPlaylistId != "undefined" && ( // Render search bar only if user is admin or owner
            <StyledInput
              type="text"
              value={searchQuery}
              onIonInput={(e: any) => {
                setSearchQuery(e.target.value);
                handleSearch();
              }}
              placeholder="Search songs to add from Spotify"
            />
          )}
        {showDropdown && (
          <SearchContainer>
            {searchResults.map((track: SpotifyTrack) => (
              <SongItemContainer
                key={track.id}
                onClick={() => rights >= 1 && handleProposeNewTrack(track.id)} // Only allow proposal if user is admin or owner
              >
                <SongItemImage src={track.albumImage} alt={track.name} />
                <StyledText>
                  {track.artist} - {track.name}
                </StyledText>
              </SongItemContainer>
            ))}
          </SearchContainer>
        )}

        {/* No playlist found message */}
        {!currentPlaylistId && (
            <ContentContainer>
          <StyledTextL>
            {rights === 2
              ? "No playlist found. Generate a playlist for this event."
              : "No playlist found. The playlist will be generated once available."}
          </StyledTextL>
          </ContentContainer>
        )}

        {/* Save Playlist Button */}
        {currentPlaylistId &&
          currentPlaylistId != "undefined" &&
          !isLoading && (
            <ButtonContainer>
              {rights == 2 && ( // Admin can only regenerate the playlist
                <>
                  <Button onClick={handleGeneratePlaylist}>
                    {playlistTrackFilter?.length
                      ? "Regenerate Playlist"
                      : "Generate Playlist"}
                  </Button>
                  <Button onClick={handleSavePlaylist}>Save Playlist</Button>
                </>
              )}
            </ButtonContainer>
          )}
      </IonContainer80>
    );
  }

  return (
    <ContentContainer>
      <StyledTextL>No playlist found.</StyledTextL>
      {rights === 2 && (
        <IonContainer80>
          {/* Generate Playlist Button */}
          <Button onClick={handleGeneratePlaylist}>Generate Playlist</Button>
        </IonContainer80>
      )}
    </ContentContainer>
  );
};

export default EditEventPlaylist;
