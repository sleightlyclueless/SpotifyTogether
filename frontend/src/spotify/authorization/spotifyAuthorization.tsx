const redirectUri = "http://localhost:5173/spotify";
const clientId = "b241ae6416a3481dad98e6899b7be0b4";
const clientSecret = "4807da9be0f144b9bbab888217e5e969";

const authEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const logoutEndpoint = "https://accounts.spotify.com/logout";

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
export const requestAuthorization = () => {
  console.log("1. Requesting authorization");

  const scope =
    "user-read-private user-read-email playlist-read-private user-read-playback-state user-modify-playback-state";
  const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(
    scope
  )}&response_type=code`;
  window.location.href = authUrl;
};

// 2. If we have an access code in the URL, we can fetch the access token
export const fetchAccessToken = () => {
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
          localStorage.setItem(`access_token_${userIdentifier}`, access_token);
          localStorage.setItem(
            `refresh_token_${userIdentifier}`,
            refresh_token
          );

          // Logout the user from Spotify
          const logoutWindow = window.open(logoutEndpoint, "_blank");

          // Close the logout window after a short delay
          if (logoutWindow) {
            setTimeout(() => {
              logoutWindow.close();
            }, 500);
          }
        } else {
          console.log("Error fetching access token:" + data);
        }
      })
      .catch((error) => {
        console.log("Error fetching access token:", error);
      });
  } else {
    console.log("No access code provided in URL, request authorization first");
  }
};
