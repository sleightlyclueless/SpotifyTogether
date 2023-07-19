import axios from "axios";
import { useEffect, useRef, useState } from "react";

export const useCheckAndRefreshToken = (
  setAccessToken: (accessToken: string) => void
): void => {
  const accessTokenRef = useRef<string | null>(
    localStorage.getItem("accessToken") || null
  );

  // State variable to track whether the hook is currently refreshing the token
  const [isRefreshingToken, setIsRefreshingToken] = useState<boolean>(false);

  // Promise queue to handle token refreshing
  const tokenRefreshQueue = useRef<Promise<any> | null>(null);

  useEffect(() => {
    // Function to update the access token and local storage
    const updateAccessToken = (accessToken: string) => {
      accessTokenRef.current = accessToken;
      setAccessToken(accessToken);
      console.log("New access token:", accessToken);
      localStorage.setItem("accessToken", accessToken);
    };

    // Function to check and refresh the token
    const checkAndRefreshToken = async (): Promise<void> => {
      const accessToken = accessTokenRef.current;
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
        console.log("Remaining time:", remainingTime);

        if (remainingTime <= 30000) {
          // If the hook is already refreshing the token or a token refresh is in progress, return early
          if (isRefreshingToken || tokenRefreshQueue.current) return;

          // Set the flag to true to block parallel executions
          setIsRefreshingToken(true);

          // Create a new promise that represents the token refreshing process
          const refreshTokenPromise = axios.put(
            "http://localhost:4000/account/refresh_token",
            null,
            {
              headers: {
                Authorization: accessToken,
              },
            }
          );

          // Add the token refreshing promise to the queue
          tokenRefreshQueue.current = refreshTokenPromise;

          // Wait for the token refreshing process to complete
          const refreshTokenResponse = await refreshTokenPromise;

          // Clear the queue after the promise is resolved
          tokenRefreshQueue.current = null;

          const newAccessToken = refreshTokenResponse.data.spotifyAccessToken;
          updateAccessToken(newAccessToken);

          // Reset the flag to false after the token is refreshed
          setIsRefreshingToken(false);
        }
      } catch (error) {
        console.log("Error refreshing token:", error);

        // Clear the queue in case of an error
        tokenRefreshQueue.current = null;

        // Reset the flag to false in case of an error
        setIsRefreshingToken(false);
      }
    };

    // Call the checkAndRefreshToken function on component mount
    checkAndRefreshToken();

    // Cleanup function to reset the isRefreshingToken flag on unmount
    return () => {
      setIsRefreshingToken(false);
    };
  }, [setAccessToken, isRefreshingToken]);
};