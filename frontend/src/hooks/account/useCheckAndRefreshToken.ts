import axios from "axios";
import { useEffect, useRef, useState } from "react";

export const useCheckAndRefreshToken = (
  setAccessToken: (accessToken: string) => void
): void => {
  const accessTokenRef = useRef<string | null>(
    localStorage.getItem("accessToken") || null
  );

  const [isRefreshingToken, setIsRefreshingToken] = useState<boolean>(false);
  const tokenRefreshQueue = useRef<Promise<any> | null>(null);

  useEffect(() => {
    const updateAccessToken = (accessToken: string) => {
      accessTokenRef.current = accessToken;
      setAccessToken(accessToken);
      localStorage.setItem("accessToken", accessToken);
    };

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

        if (remainingTime <= 30000) {
          if (isRefreshingToken || tokenRefreshQueue.current) return;

          setIsRefreshingToken(true);

          const refreshTokenPromise = axios.put(
            "http://localhost:4000/account/refresh_token",
            null,
            {
              headers: {
                Authorization: accessToken,
              },
            }
          );

          tokenRefreshQueue.current = refreshTokenPromise;
          const refreshTokenResponse = await refreshTokenPromise;
          tokenRefreshQueue.current = null;

          const newAccessToken = refreshTokenResponse.data.spotifyAccessToken;
          updateAccessToken(newAccessToken);
          setIsRefreshingToken(false);
          console.log("Token refreshed");
          window.location.reload();
        }
      } catch (error) {
        console.log("Error refreshing token:", error);
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
