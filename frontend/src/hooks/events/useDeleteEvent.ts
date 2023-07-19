import axios from "axios";
import { useState } from "react";
import { useCheckAndRefreshToken } from "../account/useCheckAndRefreshToken";

export const useDeleteEvent = () => {
  const [accessToken, setAccessToken] = useState<string | undefined>(
    localStorage.getItem("accessToken") || undefined
  );
  useCheckAndRefreshToken(setAccessToken);
  const handleDelete = (eventID: string): void => {
    axios
      .delete(`http://localhost:4000/events/${eventID}`, {
        headers: {
          Authorization: accessToken,
        },
      })
      .then(() => {
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  return handleDelete;
};
