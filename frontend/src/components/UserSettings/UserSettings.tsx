import { HOME } from "../../constants";
import { useGetUserName, useLogout } from "../../hooks";
import { Button, StyledTextL, IonContainer35 } from "../../styles";

export const UserSettings = () => {
  const userName = useGetUserName();
  const { isLoading, logout } = useLogout();
  // if noone is logged in, redirect to home page
  if (!isLoading) window.location.href = HOME;

  return (
    <IonContainer35>
      <StyledTextL>Settings</StyledTextL>
      Hello {userName}, let's create some events!
      <Button onClick={logout} disabled={isLoading}>
        {!isLoading ? "Logging out..." : "Logout"}
      </Button>
    </IonContainer35>
  );
};
