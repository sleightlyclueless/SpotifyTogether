import { HOME } from "../../constants";
import { useGetUserName, useLogout } from "../../hooks";
import { Content, LogoutButton, UserSettingsContainer } from "../../styles";

export const UserSettings = () => {
  const userName = useGetUserName();
  const { isLoading, logout } = useLogout();
  // if noone is logged in, redirect to home page
  if (!isLoading) window.location.href = HOME;

  return (
    <UserSettingsContainer>
      <Content>Settings</Content>
      Hello {userName}, let's create some events!
      <LogoutButton onClick={logout} disabled={isLoading}>
        {!isLoading ? "Logging out..." : "Logout"}
      </LogoutButton>
    </UserSettingsContainer>
  );
};
