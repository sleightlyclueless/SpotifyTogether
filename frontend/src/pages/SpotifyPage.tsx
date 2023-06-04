import { AppLayout } from "../layout/AppLayout.tsx";
import React, { useEffect, useState } from "react";
import {
  ChakraProvider,
  Box,
  Button,
  Text,
  Center,
  VStack,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  DevicesMap,
  PlaylistsMap,
  Track,
  Data,
  Song,
  CurrentTracksMap,
} from "../spotify/entities/spotifyEntities.tsx";
import {
  requestAuthorization,
  fetchAccessToken,
} from "../spotify/authorization/spotifyAuthorization.tsx";
import { fetchDevices } from "../spotify/fetch/fetchDevices.tsx";
import { fetchPlaylists } from "../spotify/fetch/fetchPlaylists.tsx";
import { fetchCurrentlyPlaying } from "../spotify/fetch/fetchCurrentlyPlaying.tsx";
import { fetchUserName } from "../spotify/fetch/fetchUserName.tsx";

export const SpotifyPage: React.FC = () => {
  const [devices, setDevices] = useState<DevicesMap>({});
  const [playlists, setPlaylists] = useState<PlaylistsMap>({});
  const [currentTracks, setCurrentTracks] = useState<CurrentTracksMap>({});
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<
    Record<string, string>
  >({});
  const [commonSongs, setCommonSongs] = useState<Song[]>([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetchAccessToken();

      // Clear the code from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Fetch stuff
  const fetchAll = () => {
    setFetchError(null);
    const storedUsers = Object.keys(localStorage).filter((key) =>
      key.startsWith("access_token_")
    );

    storedUsers.forEach(async (key) => {
      const userIdentifier = key.split("_")[2];

      const fetchedUserName = await fetchUserName(userIdentifier);
      setUserDisplayName((prevState) => ({
        ...prevState,
        [userIdentifier]: fetchedUserName,
      }));

      const fetchedDevices = await fetchDevices(userIdentifier);
      setDevices((prevState) => ({
        ...prevState,
        [userIdentifier]: fetchedDevices,
      }));

      const fetchedPlaylists = await fetchPlaylists(userIdentifier);
      setPlaylists((prevState) => ({
        ...prevState,
        [userIdentifier]: fetchedPlaylists,
      }));

      const fetchedCurrentlyPlaying = await fetchCurrentlyPlaying(
        userIdentifier
      );
      setCurrentTracks((prevState) => ({
        ...prevState,
        [userIdentifier]: fetchedCurrentlyPlaying,
      }));
    });
  };

  const findCommonSongs = () => {
    const songsUserArray: { [userIdentifier: string]: Song[] } = {};
    var commonSongs: Song[] = [];

    // Loop through each user's playlists
    Object.keys(playlists).forEach((userIdentifier) => {
      const userPlaylists = playlists[userIdentifier];
      songsUserArray[userIdentifier] = []; // Initialize the inner array for each user

      // Loop through each playlist
      userPlaylists.forEach((playlist) => {
        const playlistEndpoint = playlist.href;

        // Fetch songs from playlist
        fetch(playlistEndpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              `access_token_${userIdentifier}`
            )}`,
          },
        })
          .then((response) => response.json())
          .then((data: Data) => {
            const playlistSongs = data.tracks.items;

            playlistSongs.forEach((s: Track) => {
              const song = s.track;
              songsUserArray[userIdentifier].push(song);
            });

            // Check for common songs with other users
            if (Object.keys(songsUserArray).length > 1) {
              commonSongs = songsUserArray[userIdentifier].filter((song) => {
                // Check if the current song's "id" is the same as any previous song's "id" in other users' playlists
                return Object.keys(songsUserArray).every((otherUser) =>
                  songsUserArray[otherUser].some((s) => s.id === song.id)
                );
              });
            }

            console.log("Common Songs:", commonSongs);
            setCommonSongs(commonSongs);
          })
          .catch((error) => {
            console.log("Error fetching playlist songs:", error);
          });
      });
    });
  };

  return (
    <ChakraProvider>
      <AppLayout>
        <Box>
          <Text fontSize="xl" mb={4}>
            Spotify Page
          </Text>

          {fetchError && <Text color="red.500">{fetchError}</Text>}

          <Grid templateColumns="repeat(2, 1fr)" gap={8}>
            {Object.keys(localStorage)
              .filter((key) => key.startsWith("access_token_"))
              .map((key) => {
                const userIdentifier = key.split("_")[2];
                const userDevices = devices[userIdentifier] || [];
                const userPlaylists = playlists[userIdentifier] || [];
                const userCurrentTracks = currentTracks[userIdentifier] || [];
                const displayName =
                  userDisplayName[userIdentifier] || userIdentifier;

                return (
                  <GridItem key={userIdentifier}>
                    <Box borderWidth="1px" borderRadius="md" p={4}>
                      <Text mb={2} fontWeight="bold">
                        User: {displayName}
                      </Text>
                      <Text mb={2} fontWeight="bold">
                        Devices:
                      </Text>
                      <ul>
                        {userDevices.length > 0 ? (
                          userDevices.map((device) => (
                            <li key={device.id}>{device.name}</li>
                          ))
                        ) : (
                          <li>No devices registered</li>
                        )}
                      </ul>

                      <Text mt={4} mb={2} fontWeight="bold">
                        Playlists:
                      </Text>
                      <ul>
                        {userPlaylists.length > 0 ? (
                          userPlaylists.map((playlist) => (
                            <li key={playlist.id}>{playlist.name}</li>
                          ))
                        ) : (
                          <li>No playlists registered</li>
                        )}
                      </ul>

                      <Text mt={4} mb={2} fontWeight="bold">
                        Currently Playing:
                      </Text>
                      <ul>
                        {userCurrentTracks.length > 0 ? (
                          userCurrentTracks.map((track) => (
                            <li key={track}>{track}</li>
                          ))
                        ) : (
                          <li>No currently playing track</li>
                        )}
                      </ul>
                    </Box>
                  </GridItem>
                );
              })}
          </Grid>

          <VStack mt={4} spacing={4}>
            <Center>
              <Button colorScheme="blue" onClick={requestAuthorization}>
                Request Authorization
              </Button>
            </Center>
            <Center>
              <Button colorScheme="blue" onClick={fetchAll}>
                Fetch All Data
              </Button>
            </Center>
            <Center>
              <Button colorScheme="blue" onClick={findCommonSongs}>
                Find common songs
              </Button>
            </Center>
          </VStack>

          {commonSongs.length > 0 && (
            <Box mt={4}>
              <Text fontWeight="bold">Common Songs:</Text>
              <ul>
                {commonSongs.map((song) => (
                  <li key={song.id}>
                    {song.name} by {song.artists[0].name}
                  </li>
                ))}
              </ul>
            </Box>
          )}
        </Box>
      </AppLayout>
    </ChakraProvider>
  );
};

export default SpotifyPage;
