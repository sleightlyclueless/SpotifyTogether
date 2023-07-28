import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export const useLogout = () => {
  const accessToken = localStorage.getItem("accessToken") || undefined;
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    axios
      .put("http://localhost:4000/account/logout", null, {
        headers: {
          Authorization: accessToken,
        },
      })
      .then((response) => {
        if (response.status === 204) {
          localStorage.removeItem("accessToken");
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
