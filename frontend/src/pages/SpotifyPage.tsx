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

interface Device {
  id: string;
  name: string;
}

interface Playlist {
  id: string;
  name: string;
  href: string;
}

interface DevicesMap {
  [key: string]: Device[];
}

interface PlaylistsMap {
  [key: string]: Playlist[];
}

interface Playlist {
  href: string;
}

interface Track {
  id: string;
  track: Song;
}

interface Data {
  tracks: {
    items: Track[];
  };
}

interface Song {
  id: string;
  href: string;
  name: string;
  duration_ms: number;
  artists: Artist[];
}

interface Artist {
  name: string;
}

interface CurrentTracksMap {
  [key: string]: string[];
}

export const SpotifyPage: React.FC = () => {
  const [devices, setDevices] = useState<DevicesMap>({});
  const [playlists, setPlaylists] = useState<PlaylistsMap>({});
  const [currentTracks, setCurrentTracks] = useState<CurrentTracksMap>({});
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<
    Record<string, string>
  >({});
  const [commonSongs, setCommonSongs] = useState<Song[]>([]);

  const redirectUri = "http://localhost:5173/spotify";
  const clientId = "b241ae6416a3481dad98e6899b7be0b4";
  const clientSecret = "4807da9be0f144b9bbab888217e5e969";

  const authEndpoint = "https://accounts.spotify.com/authorize";
  const tokenEndpoint = "https://accounts.spotify.com/api/token";
  const meEndpoint = "https://api.spotify.com/v1/me";
  const playlistsEndpoint = "https://api.spotify.com/v1/me/playlists";
  const devicesEndpoint = "https://api.spotify.com/v1/me/player/devices";
  const currentlyPlayingEndpoint =
    "https://api.spotify.com/v1/me/player/currently-playing";

  // Utility functions
  const getCurrentUserIdentifier = (): string => {
    const storedUsers = Object.keys(localStorage).filter((key) =>
      key.startsWith("access_token_")
    );
    const existingUserNumbers = storedUsers.map((key) => {
      const userIdentifier = key.split("_")[2];
      return parseInt(userIdentifier.replace("user", ""));
    });
    const maxUserNumber =
      existingUserNumbers.length > 0 ? Math.max(...existingUserNumbers) : 0;
    return `user${maxUserNumber + 1}`;
  };

  // 1. Request Authorization with clientId, response_type, redirect_uri, state and scope
  // User will be redirected to Spotify, login and grant access, then to redirect_uri with code and state
  // NOTE: Before a user can access the api their name and email have to be added to https://developer.spotify.com/ project by admin
  const requestAuthorization = () => {
    console.log("1. Requesting authorization");

    const scope =
      "user-read-private user-read-email playlist-read-private user-read-playback-state user-modify-playback-state";
    const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(
      scope
    )}&response_type=code`;
    window.location.href = authUrl;
  };

  // 2. If we have an access code in the URL, we can fetch the access token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetchAccessToken();

      // Clear the code from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // TODO - better way to logout?
  const logout = () => {
    const logoutUrl = "https://www.spotify.com/logout/";
    const logoutWindow = window.open(logoutUrl, "_blank");

    // Close the logout window after a short delay
    if (logoutWindow) {
      setTimeout(() => {
        logoutWindow.close();
      }, 500);
    }
  };

  const fetchAccessToken = () => {
    console.log("2. Fetching access token");
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code")!;
    const userIdentifier = getCurrentUserIdentifier();

    if (code) {
      const body = {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      };

      fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(body).toString(),
      })
        .then((response) => response.json())
        .then((data) => {
          const { access_token, refresh_token } = data;
          if (access_token) {
            localStorage.setItem(
              `access_token_${userIdentifier}`,
              access_token
            );
            localStorage.setItem(
              `refresh_token_${userIdentifier}`,
              refresh_token
            );

            // Logout the user from Spotify
            logout();
          } else {
            console.log("Error fetching access token:" + data);
          }
        })
        .catch((error) => {
          console.log("Error fetching access token:", error);
        });
    } else {
      console.log(
        "No access code provided in URL, request authorization first"
      );
    }
  };

  // Fetch stuff
  const fetchAll = () => {
    setFetchError(null);
    const storedUsers = Object.keys(localStorage).filter((key) =>
      key.startsWith("access_token_")
    );

    storedUsers.forEach((key) => {
      const userIdentifier = key.split("_")[2];
      fetchUserDisplayName(userIdentifier);
      fetchDevices(userIdentifier);
      fetchPlaylists(userIdentifier);
      fetchCurrentlyPlaying(userIdentifier);
    });
  };

  // Fetch name
  const fetchUserDisplayName = (userIdentifier: string) => {
    const accessToken = localStorage.getItem(`access_token_${userIdentifier}`);

    fetch(meEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User profile response:", data);
        const { display_name } = data;
        if (display_name) {
          setUserDisplayName((prevState) => ({
            ...prevState,
            [userIdentifier]: display_name,
          }));
        } else {
          console.log("No display name for user " + userIdentifier + " found");
          setUserDisplayName((prevState) => ({
            ...prevState,
            [userIdentifier]: "Unknown",
          }));
        }
      })
      .catch((error) => {
        console.log("Error fetching user profile:", error);
      });
  };

  // Fetch devices
  const fetchDevices = (userIdentifier: string) => {
    const accessToken = localStorage.getItem(`access_token_${userIdentifier}`);

    fetch(devicesEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Devices response:", data);
        const { devices } = data;
        if (devices) {
          setDevices((prevState) => ({
            ...prevState,
            [userIdentifier]: devices,
          }));
        } else {
          console.log("No devices for user " + userIdentifier + " found!");
          setDevices((prevState) => ({
            ...prevState,
            [userIdentifier]: [],
          }));
        }
      })
      .catch((error) => {
        console.log("Error fetching devices:", error);
      });
  };

  // 4. Fetch playlists
  const fetchPlaylists = (userIdentifier: string) => {
    const accessToken = localStorage.getItem(`access_token_${userIdentifier}`);

    fetch(playlistsEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Playlists response:", data);
        const { items } = data;
        if (items) {
          setPlaylists((prevState) => ({
            ...prevState,
            [userIdentifier]: items,
          }));
        } else {
          console.log("No playlists for user " + userIdentifier + " found");
          setPlaylists((prevState) => ({
            ...prevState,
            [userIdentifier]: [],
          }));
        }
      })
      .catch((error) => {
        console.log("Error fetching playlists:", error);
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

  // 5. Fetch currently playing
  const fetchCurrentlyPlaying = (userIdentifier: string) => {
    const accessToken = localStorage.getItem(`access_token_${userIdentifier}`);

    fetch(currentlyPlayingEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Currently playing response:", data);
        const { item } = data;
        if (item) {
          setCurrentTracks((prevState) => ({
            ...prevState,
            [userIdentifier]: [item.name],
          }));
        } else {
          console.log(
            "No currently playing for user " + userIdentifier + " found"
          );
          setCurrentTracks((prevState) => ({
            ...prevState,
            [userIdentifier]: [],
          }));
        }
      })
      .catch((error) => {
        console.log("Error fetching currently playing:", error);
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
