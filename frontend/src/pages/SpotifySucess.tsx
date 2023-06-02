import React, { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const SpotifySuccess = () => {
  const [tokens, setTokens] = useLocalStorage("spotifyTokens", {
    accessToken: "",
    tokenType: "",
    expiresIn: 0,
    refreshToken: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      handleAuthorizationCode(code);
    }
  }, []);

  const handleAuthorizationCode = (code: string) => {
    // Make an API request to exchange the authorization code for tokens
    // Replace the placeholders below with your actual API endpoint, client ID, client secret, and redirect URI

    const clientID = "b241ae6416a3481dad98e6899b7be0b4";
    const redirectURI = "http://localhost:5173/success";
    const clientSecret = "4807da9be0f144b9bbab888217e5e969";

    console.log(code);

    fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: clientID,
        client_secret: clientSecret,
        redirect_uri: redirectURI,
      }).toString(),
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        const { access_token, token_type, expires_in, refresh_token } = data;

        setTokens({
          accessToken: access_token,
          tokenType: token_type,
          expiresIn: expires_in,
          refreshToken: refresh_token,
        });

        // Redirect or navigate to another page if needed
      })
      .catch((error) => {
        console.error(
          "Failed to exchange authorization code for tokens",
          error
        );
      });
  };

  return <h1>Success Page</h1>;
};
