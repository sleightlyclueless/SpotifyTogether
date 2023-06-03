import { AppLayout } from "../layout/AppLayout.tsx";
import React, { useEffect, useState } from "react";
import { ChakraProvider, Box, Button, Text } from "@chakra-ui/react";

export const SpotifyPage: React.FC = () => {
  const [devices, setDevices] = useState<{ id: string; name: string }[]>([]);
  const [playlists, setPlaylists] = useState([]);
  const [currentTrack, setCurrentTrack] = useState("");
  const [fetchError, setFetchError] = useState<string | null>(null);

  const url = "http://localhost:5173";
  const redirectUri = "http://localhost:5173/spotify";
  const clientId = "b241ae6416a3481dad98e6899b7be0b4";
  const clientSecret = "4807da9be0f144b9bbab888217e5e969";

  const authEndpoint = "https://accounts.spotify.com/authorize";
  const tokenEndpoint = "https://accounts.spotify.com/api/token";
  const playlistsEndpoint = "https://api.spotify.com/v1/me/playlists";
  const devicesEndpoint = "https://api.spotify.com/v1/me/player/devices";
  const currentlyPlayingEndpoint =
    "https://api.spotify.com/v1/me/player/currently-playing";

  // other endpoints
  // const playEndpoint = "https://api.spotify.com/v1/me/player/play";
  // const pauseEndpoint = "https://api.spotify.com/v1/me/player/pause";
  // const nextEndpoint = "https://api.spotify.com/v1/me/player/next";
  // const previousEndpoint = "https://api.spotify.com/v1/me/player/previous";
  // const shuffleEndpoint = "https://api.spotify.com/v1/me/player/shuffle";

  // 1. Request Authorization with clientId, response_type, redirect_uri, state and scope
  // User will be redirected to spotify, login and grant acces, then to redirect_uri with code and state
  const requestAuthorization = () => {
    console.log("1. Requesting authorization");
    const scope =
      "user-read-private user-read-email playlist-read-private user-read-playback-state user-modify-playback-state";
    const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(
      scope
    )}&response_type=code`;
    window.location.href = authUrl;
  };

  // 2. If we recieved a code from step 1, fetch the access token (if not already at step 3)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (
      (!localStorage.getItem("access_token") ||
        localStorage.getItem("access_token") == "undefined") &&
      code
    ) {
      fetchAccessToken(code);
    }
  }, []);

  const fetchAccessToken = (code: string) => {
    console.log("2. Fetching access token");
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
            console.log("Access token fetched!");
            console.log(access_token);
          localStorage.setItem("access_token", access_token);
        } else {
            console.log("Error!");
            console.log(data);
        }
      });
  };

  // 3. We have the access token! Fetch devices, playlists and currently playing
  const fetchAll = (): void => {
    if (localStorage.getItem("access_token")) {
      setFetchError(null); // Clear any previous error
      fetchDevices();
      fetchPlaylists();
      fetchCurrentlyPlaying();
    } else {
      console.log("No access token");
    }
  };

  const fetchDevices = () => {
    fetch(devicesEndpoint, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    })
      .then((response) => {
        if (!response.ok || response.status === 204) {
          throw new Error("Failed to fetch devices");
        }
        return response.json(); // Return the promise here
      })
      .then((data) => {
        console.log(data); // Log or use the data inside this .then() block
        setDevices(data.devices);
      })
      .catch((error) => {
        console.error("Error fetching devices:", error);
        setFetchError("Failed to fetch devices");
      });
  };

  const fetchPlaylists = () => {
    fetch(playlistsEndpoint, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    })
      .then((response) => {
        if (!response.ok || response.status === 204) {
          throw new Error("Failed to fetch playlists");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setPlaylists(data.items);
      })
      .catch((error) => {
        console.error("Error fetching playlists:", error);
        setFetchError("Failed to fetch playlists");
      });
  };

  const fetchCurrentlyPlaying = () => {
    fetch(currentlyPlayingEndpoint, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    })
      .then((response) => {
        if (!response.ok || response.status === 204) {
          throw new Error("Failed to fetch currently playing");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setCurrentTrack(data.item.name);
      })
      .catch((error) => {
        console.error("Error fetching currently playing:", error);
        setFetchError("Failed to fetch currently playing");
      });
  };

  return (
    <AppLayout>
      <ChakraProvider>
        <Box className="container">
          {/* Token Section */}
          <Box id="tokenSection" className="row">
            <Box className="col d-flex justify-content-center">
              <Button
                colorScheme="blue"
                size="lg"
                onClick={requestAuthorization}
              >
                Request Authorization
              </Button>
            </Box>
          </Box>

          {localStorage.getItem("access_token") && (
            <Box className="row">
              <Box className="col d-flex justify-content-center">
                <Button colorScheme="blue" size="sm" mt={3} onClick={fetchAll}>
                  Fetch stuff
                </Button>
              </Box>
            </Box>
          )}

          {fetchError && (
            <Box className="row">
              <Box className="col d-flex justify-content-center">
                <p className="error-message">{fetchError}</p>
              </Box>
            </Box>
          )}

          {/* Display playlists */}
          {playlists.length > 0 && (
            <Box className="row" margin="0 0 0 20px">
              <Box className="col">
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                  Playlists
                </Text>
                <ul>
                  {playlists.map((playlist) => (
                    <li key={playlist.id}>{playlist.name}</li>
                  ))}
                </ul>
              </Box>
            </Box>
          )}

          {/* Display devices */}
          {devices.length > 0 && (
            <Box className="row" margin="20px 0 0 20px">
              <Box className="col">
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                  Devices
                </Text>
                <ul>
                  {devices.map((device) => (
                    <li key={device.id}>{device.name}</li>
                  ))}
                </ul>
              </Box>
            </Box>
          )}

          {/* Display currently playing */}
          {currentTrack && (
            <Box className="row" margin="20px 0 0 20px">
              <Box className="col">
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                  Currently Playing
                </Text>
                <Text>{currentTrack}</Text>
              </Box>
            </Box>
          )}
        </Box>
      </ChakraProvider>
    </AppLayout>
  );
};
