import axios from "axios";

export const useDeleteEvent = () => {
  const accessToken = localStorage.getItem("accessToken") || undefined;
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
