import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export const useDeleteEvent = () => {
  const [deleteEventisLoading, setdeleteEventisLoading] = useState<boolean>(false);
  const accessToken = localStorage.getItem("accessToken") || undefined;
  const handleDelete = (eventID: string): void => {
    setdeleteEventisLoading(true);
    axios
      .delete(`http://localhost:4000/events/${eventID}`, {
        headers: {
          Authorization: accessToken,
        },
      })
      .then(() => {
        toast.success("Event deleted");
        setdeleteEventisLoading(false);
      })
      .catch((error) => {
        toast.error("Error deleting event");
        console.error("Error deleting event:", error);
        setdeleteEventisLoading(false);
      });
  };

  return { handleDelete, deleteEventisLoading };
};
