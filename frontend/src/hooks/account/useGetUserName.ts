import axios from "axios";
import { useState } from "react";

export const useGetUserName = (): string | null => {
  const accessToken = localStorage.getItem("accessToken") || undefined;
  const [userName, setUserName] = useState<string | null>(null);
  if (accessToken === undefined) return null;

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
      console.log("Error fetching username:", error);
    });

  return userName;
};
