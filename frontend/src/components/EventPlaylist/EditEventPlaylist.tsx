import { FunctionComponent, useEffect } from "react";
import { useGeneratePlaylist, useFetchEventTracks } from "../../hooks"; // Import the hook here
import { EventType } from "../../constants";
import {
  FormContainer,
  Label,
  StyledEventIdInput,
  SubmitButton,
} from "../../styles";

type EditEventPlaylistProps = {
  event: EventType;
};

export const EditEventPlaylist: FunctionComponent<EditEventPlaylistProps> = ({
  event,
}) => {
  const { isLoading, error, generatePlaylist } = useGeneratePlaylist();

  // Call the useFetchEventTracks hook here
  const {
    eventTracks,
    isLoading: isTracksLoading,
    error: tracksError,
    fetchEventTracks,
  } = useFetchEventTracks();

  const handleGeneratePlaylist = async () => {
    try {
      await generatePlaylist(event.id, (errorMessage) => {
        if (errorMessage) {
          // Handle error, if any
          console.error(errorMessage);
        } else {
          // Success, do something here after generating the playlist
        }
      });
    } catch (error) {
      console.error("Error generating playlist:", error);
    }
  };

  // Call fetchEventTracks when the component is rendered, or you can call it conditionally based on some user interactions.
  // For example, you might want to fetch event tracks when the user clicks a button or when the component mounts.
  useEffect(() => {
    fetchEventTracks(event.id);
  }, [event.id, fetchEventTracks]);

  return (
    <FormContainer>
      <Label>Generate Playlist</Label>
      <StyledEventIdInput
        type="text"
        value={event.id}
        readOnly
        placeholder="Event ID"
      />
      {isLoading || isTracksLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <SubmitButton onClick={handleGeneratePlaylist}>
            Generate Playlist
          </SubmitButton>
          {error && <p>Error: {error}</p>}
          {/* Display the event tracks here */}
          {eventTracks.map((track) => (
            <div key={track.id}>{track.name}</div>
            // You can render the track information here as needed
          ))}
          {tracksError && <p>Error fetching event tracks: {tracksError}</p>}
        </>
      )}
    </FormContainer>
  );
};
