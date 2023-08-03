import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export const useLogout = () => {
  const userID = localStorage.getItem("userID") || undefined;
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    axios
      .put("http://localhost:4000/account/logout", null, {
        headers: {
          Authorization: userID,
        },
      })
      .then((response) => {
        if (response.status === 204) {
          localStorage.removeItem("userID");
          toast.info("Logged out");
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  return { logout, isLoading };
};
