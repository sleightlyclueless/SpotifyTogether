import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export const useCheckAndRefreshToken = (
  setAccessToken: (accessToken: string) => void
): void => {
  const [isRefreshingToken, setIsRefreshingToken] = useState<boolean>(false);
  const accessTokenRef = useRef<string | null>(
    localStorage.getItem("accessToken") || null
  );
  const tokenRefreshQueue = useRef<Promise<any> | null>(null);

  useEffect(() => {
    // if we fetched a new token, update it here in localstorage
    const updateAccessToken = (accessToken: string) => {
      accessTokenRef.current = accessToken;
      setAccessToken(accessToken);
      localStorage.setItem("accessToken", accessToken);
    };

    const checkAndRefreshToken = async (): Promise<void> => {
      const accessToken = accessTokenRef.current;
      if (!accessToken) return;

      try {
        // 1. Check if token is expired
        const remainingTimeResponse = await axios.get(
          "http://localhost:4000/account/remaining_expiry_time",
          {
            headers: {
              Authorization: accessToken,
            },
          }
        );
        const remainingTime = remainingTimeResponse.data.expires_in;

        // 2. If token is close to expiring, refresh it
        if (remainingTime <= 30000) {
          // Prevent multiple refreshes at once due to vite duplicate call of this hook
          if (isRefreshingToken || tokenRefreshQueue.current) return;
          setIsRefreshingToken(true);

          // Refresh token (backend grabs refresh token from db and refreshes)
          const refreshTokenPromise = axios.put(
            "http://localhost:4000/account/refresh_token",
            null,
            {
              headers: {
                Authorization: accessToken,
              },
            }
          );
          toast.success("Spotify access token expired. Refreshing...");
          tokenRefreshQueue.current = refreshTokenPromise;
          const refreshTokenResponse = await refreshTokenPromise;
          tokenRefreshQueue.current = null;

          // Update token in localstorage and state
          const newAccessToken = refreshTokenResponse.data.spotifyAccessToken;
          updateAccessToken(newAccessToken);
          setIsRefreshingToken(false);
          toast.info("Your spotify tokens were refreshed");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        toast.error("Error refreshing token");
        tokenRefreshQueue.current = null;
        setIsRefreshingToken(false);
      }
    };

    checkAndRefreshToken();

    return () => {
      setIsRefreshingToken(false);
    };
  }, [setAccessToken, isRefreshingToken]);
};
