import React, { useEffect, useState } from "react";

interface SpotifyAuthProps {
  onSuccess: () => void; // Add a prop for onSuccess callback
}

interface SpotifyAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyDevice {
  id: string;
  name: string;
  type: string;
  volume_percent: number;
}

export const SpotifyAuth: React.FC<SpotifyAuthProps> = ({
  onSuccess, // Destructure the onSuccess callback prop
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [devices, setDevices] = useState<SpotifyDevice[]>([]);

  const clientID = "b241ae6416a3481dad98e6899b7be0b4";
  const redirectURI = "http://localhost:5173/success";
  const scope = ["user-read-playback-state", "user-modify-playback-state"];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      requestAccessToken(code);
    }
  }, []);

  const generateAuthURL = (): string => {
    const encodedRedirectURI = encodeURIComponent(redirectURI);
    const encodedScope = encodeURIComponent(scope.join(" "));
    return `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=code&redirect_uri=${encodedRedirectURI}&scope=${encodedScope}`;
  };

  const requestAuthorization = (): void => {
    const authURL = generateAuthURL();
    window.location.href = authURL;
  };

  const requestAccessToken = async (code: string): Promise<void> => {
    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectURI,
          client_id: clientID,
        }).toString(),
      });

      if (response.ok) {
        const data: SpotifyAuthResponse = await response.json();
        setAccessToken(data.access_token);

        // Call the onSuccess callback when access token is received
        onSuccess();
      } else {
        console.error("Failed to retrieve access token");
      }
    } catch (error) {
      console.error("Failed to retrieve access token", error);
    }
  };

  const fetchDevices = async (): Promise<void> => {
    try {
      const response = await fetch(
        "https://api.spotify.com/v1/me/player/devices",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data: { devices: SpotifyDevice[] } = await response.json();
        setDevices(data.devices);
      } else {
        console.error("Failed to fetch devices");
      }
    } catch (error) {
      console.error("Failed to fetch devices", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchDevices();
    }
  }, [accessToken]);

  return (
    <div>
      {/* Token section */}
      <div id="tokenSection" className="row">
        <button className="btn btn-primary" onClick={requestAuthorization}>
          Authorize with Spotify
        </button>
        {/* ... Token input and buttons ... */}
      </div>

      {/* Device section */}
      <div id="deviceSection" className="row">
        <h2>Devices:</h2>
        <ul>
          {devices.map((device) => (
            <li key={device.id}>
              Name: {device.name}, Type: {device.type}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};