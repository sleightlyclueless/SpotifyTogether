import { useEffect, useState } from "react";
import axios from "axios";

export const useGetUserEvents = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = (): void => {
    axios
      .get("http://localhost:4000/events", {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return events;
};
