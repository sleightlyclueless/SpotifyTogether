import axios from "axios";
import { useState } from "react";

export const useGetUserName = (): string | null => {
  const userID = localStorage.getItem("userID") || undefined;
  const [userName, setUserName] = useState<string | null>(null);
  if (userID === undefined) return null;

  axios
    .get(`http://localhost:4000/account/spotifyUserId`, {
      headers: {
        Authorization: userID,
      },
    })
    .then((res) => {
      setUserName(res.data.spotifyUserId);
    })
    .catch((error) => {
      console.error("Error fetching username:", error);
    });

  return userName;
};
