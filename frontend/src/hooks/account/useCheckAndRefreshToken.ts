import axios from "axios";
import { useEffect } from "react";

// TODO - Test if it works... Updating the token to quickly during development

// Used in front of every hook with a fetch function that requires an access token
export const useCheckAndRefreshToken = (setAccessToken: (accessToken: string) => void): void => {
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;

      try {
        const remainingTimeResponse = await axios.get(
          "http://localhost:4000/account/remaining_expiry_time",
          {
            headers: {
              Authorization: accessToken,
            },
          }
        );
        const remainingTime = remainingTimeResponse.data.expires_in;

        // Check if the token is expired or about to expire (less than 5 minutes remaining)
        if (remainingTime <= 300000) {
          const refreshTokenResponse = await axios.put(
            "http://localhost:4000/account/refresh_token",
            null,
            {
              headers: {
                Authorization: accessToken,
              },
            }
          );

          console.log("Refreshed token:", refreshTokenResponse);
          const newAccessToken = refreshTokenResponse.data.spotifyAccessToken;
          localStorage.setItem("accessToken", newAccessToken);
          setAccessToken(newAccessToken);
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
  }, [setAccessToken]);
};