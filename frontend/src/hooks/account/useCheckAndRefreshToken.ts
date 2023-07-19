import axios from "axios";
import { useState, useEffect } from "react";

export const useCheckAndRefreshToken = (accessToken: string | undefined): string | undefined => {
  const [refreshedAccessToken, setRefreshedAccessToken] = useState<string | undefined>(accessToken);

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (accessToken === undefined) return;

      try {
        const remainingTimeResponse = await axios.get(`http://localhost:4000/account/remaining_expiry_time`, {
          headers: {
            Authorization: accessToken,
          },
        });

        console.log("Remaining time:", remainingTimeResponse.data);
        const remainingTime = remainingTimeResponse.data.expires_in;

        // Check if the token is expired or about to expire (less than 5 minutes remaining)
        if (remainingTime <= 300000) {
          const refreshTokenResponse = await axios.put(`http://localhost:4000/account/refresh_token`, null, {
            headers: {
              Authorization: accessToken,
            },
          });

          console.log("Refreshed token:", refreshTokenResponse);
          const newAccessToken = refreshTokenResponse.data.spotifyAccessToken;
          localStorage.setItem("accessToken", newAccessToken);
          setRefreshedAccessToken(newAccessToken);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    // Call the function to check and refresh the token on mount
    checkAndRefreshToken();

    // Set up an interval to check and refresh the token every 5 minutes
    const intervalId = setInterval(() => {
      checkAndRefreshToken();
    }, 300000);

    // Clean up the interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [accessToken]);

  return refreshedAccessToken;
};