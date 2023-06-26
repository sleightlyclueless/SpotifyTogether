import axios from "axios";
import { useState } from "react";

export const useGetUserName = (accessToken: string | undefined): string => {
  const [userName, setUserName] = useState<string>("");

  if (accessToken == undefined) return userName;

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
  return userName;
};
