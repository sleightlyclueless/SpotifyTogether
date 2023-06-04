const currentlyPlayingEndpoint =
  "https://api.spotify.com/v1/me/player/currently-playing";

export const fetchCurrentlyPlaying = (userIdentifier: string) => {
  const accessToken = localStorage.getItem(`access_token_${userIdentifier}`);

  return fetch(currentlyPlayingEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Currently playing response:", data);
      const { item } = data;
      return item ? [item.name] : [];
    })
    .catch((error) => {
      console.log("Error fetching currently playing:", error);
      return [];
    });
};
