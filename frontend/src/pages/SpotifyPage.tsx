import React, { useEffect, useState } from "react";
import {
  CurrentTracksMap,
  Data,
  DevicesMap,
  PlaylistsMap,
  Song,
  Track,
} from "../spotify/entities/spotifyEntities.tsx";
import { fetchAccessToken } from "../spotify/authorization/spotifyAuthorization.tsx";
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
    let commonSongs: Song[] = [];

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
    <>
      <div>Spotify Page</div>
      {fetchError && <div>{fetchError}</div>}

      <div>
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
              <div key={userIdentifier}>
                <div>
                  <div>User: {displayName}</div>
                  <div>Devices:</div>
                  <ul>
                    {userDevices.length > 0 ? (
                      userDevices.map((device) => (
                        <li key={device.id}>{device.name}</li>
                      ))
                    ) : (
                      <li>No devices registered</li>
                    )}
                  </ul>

                  <div>Playlists:</div>
                  <ul>
                    {userPlaylists.length > 0 ? (
                      userPlaylists.map((playlist) => (
                        <li key={playlist.id}>{playlist.name}</li>
                      ))
                    ) : (
                      <li>No playlists registered</li>
                    )}
                  </ul>

                  <div>Currently Playing:</div>
                  <ul>
                    {userCurrentTracks.length > 0 ? (
                      userCurrentTracks.map((track) => (
                        <li key={track}>{track}</li>
                      ))
                    ) : (
                      <li>No currently playing track</li>
                    )}
                  </ul>
                </div>
              </div>
            );
          })}
      </div>
      <button>Request Authorization</button>
      <button onClick={fetchAll}>Fetch All Data</button>

      <button onClick={findCommonSongs}>Find common songs</button>

      {commonSongs.length > 0 && (
        <div>
          <div>Common Songs:</div>
          <ul>
            {commonSongs.map((song) => (
              <li key={song.id}>
                {song.name} by {song.artists[0].name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default SpotifyPage;
