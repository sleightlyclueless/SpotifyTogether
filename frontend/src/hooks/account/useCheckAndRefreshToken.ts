import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export const useCheckAndRefreshToken = () => {
  const userID = localStorage.getItem("userID") || undefined;
  const [refreshisLoading, setIsLoading] = useState(true);

  const checkAndRefreshToken = async () => {
    if (!userID) {
      setIsLoading(false);
      return;
    }

    try {
      // 1. Check if token is expired
      const remainingTimeResponse = await axios.get(
        "http://localhost:4000/account/remaining_expiry_time",
        {
          headers: {
            Authorization: userID,
          },
        }
      );
      const remainingTime = remainingTimeResponse.data.expires_in;

      // 2. If token is close to expiring, refresh it
      if (remainingTime <= 30000) {
        const refreshTokenPromise = axios.put(
          "http://localhost:4000/account/refresh_token",
          null,
          {
            headers: {
              Authorization: userID,
            },
          }
        );
        toast.success("Your spotify tokens were refreshed");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      toast.error("Error refreshing token");
      setIsLoading(false);
    }
  };

  return { refreshisLoading, checkAndRefreshToken };
};
