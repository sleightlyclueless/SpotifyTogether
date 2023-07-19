import axios from "axios";
import { useEffect, useState } from "react";

export const useGetUserName = (): string | null => {
  const accessToken = localStorage.getItem("accessToken") || undefined;
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken === undefined) return;

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
  }, [accessToken]);

  return userName;
};
