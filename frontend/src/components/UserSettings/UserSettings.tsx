import axios from "axios";
import { HOME } from "../../constants";

import { useGetUserName } from "../../hooks";
import { Content, LogoutButton, UserSettingsContainer } from "../../styles";

export const UserSettings = () => {
  const userName = useGetUserName();

  const handleLogout = () => {
    const accessToken = localStorage.getItem("accessToken");
    axios
      .put(
        "http://localhost:4000/account/logout",
        {
          Authorization: accessToken,
        },
        {
          headers: {
            Authorization: accessToken,
          },
        }
      )
      .then((response) => {
        if (response.status === 204) {
          localStorage.removeItem("accessToken");
          window.location.href = HOME;
        }
      });
  };

  return (
    <UserSettingsContainer>
      <Content>Settings</Content>
      Hello {userName}, let's create some events!
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
    </UserSettingsContainer>
  );
};
