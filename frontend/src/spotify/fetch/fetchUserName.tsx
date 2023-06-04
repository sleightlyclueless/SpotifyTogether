const meEndpoint = "https://api.spotify.com/v1/me";

export const fetchUserName = (userIdentifier: string) => {
  const accessToken = localStorage.getItem(`access_token_${userIdentifier}`);

  return fetch(meEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("User profile response:", data);
      const { display_name } = data;
      return display_name || "Unknown";
    })
    .catch((error) => {
      console.log("Error fetching user profile:", error);
      return "Unknown";
    });
};
