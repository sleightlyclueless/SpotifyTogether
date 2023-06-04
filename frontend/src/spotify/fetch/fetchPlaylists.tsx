const playlistsEndpoint = "https://api.spotify.com/v1/me/playlists";

export const fetchPlaylists = (userIdentifier: string) => {
  const accessToken = localStorage.getItem(`access_token_${userIdentifier}`);

  return fetch(playlistsEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Playlists response:", data);
      const { items } = data;
      return items || [];
    })
    .catch((error) => {
      console.log("Error fetching playlists:", error);
      return [];
    });
};
