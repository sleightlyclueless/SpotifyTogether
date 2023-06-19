import axios from "axios";
import { useEffect } from "react";

export const LoginPage = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/account/login",
          {
            withCredentials: true,
          }
        );
        console.log("Response:", response.data);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Login Page</h1>
    </div>
  );
};