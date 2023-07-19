import axios from "axios";
import { useEffect, useState } from "react";
import { useCheckAndRefreshToken } from "./useCheckAndRefreshToken";

export const useGetUserName = (): string => {
  const [accessToken, setAccessToken] = useState<string | undefined>(
    localStorage.getItem("accessToken") || undefined
  );
  useCheckAndRefreshToken(setAccessToken);

  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if (accessToken == undefined) return;

    axios
      .get(`http://localhost:4000/account/spotifyUserId`, {
        headers: {
          Authorization: accessToken,
        },
      })
      .then((res) => {
        setUserName(res.data.spotifyUserId);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, [accessToken]);

  return userName;
};
