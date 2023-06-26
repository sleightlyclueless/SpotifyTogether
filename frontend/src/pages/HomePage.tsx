import { FunctionComponent, useMemo, useState } from "react";
import {
  Header,
  PageContainer,
  PlaylistOverview,
  StyledIonModal,
} from "../components";
import {
  NewEventForm,
  NewPlaylistButton,
} from "../components/NewPlaylistButton";
import styled from "styled-components";
import { useGetUserName } from "../hooks";
import { HOME } from "../constants";

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const LoginButton = styled.div`
  border-radius: 8px;
  border: 1px solid white;
  width: 60px;
  height: 20px;
  color: white;
  padding: 10px;
  text-align: center;
  cursor: pointer;
`;

export const HomePage: FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const getAccessToken = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access_token") || undefined;
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken || "");
      window.location.href = HOME;
    }
  };

  useMemo(() => {
    getAccessToken();
  }, []);

  const userName = useGetUserName(
    localStorage.getItem("accessToken") || undefined
  );

  const handleOnLoginClick = () => {
    window.location.href = "http://localhost:4000/account/login";
  };

  const handleOnNewPlaylistClick = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <PageContainer>
      {userName ? (
        <>
          <Header title={"Home"} userName={userName || undefined} />
          <PlaylistOverview />
          <NewPlaylistButton onClick={handleOnNewPlaylistClick} />
          <StyledIonModal
            isOpen={isOpen}
            onDidDismiss={() => setIsOpen(false)}
            mode={"ios"}
            initialBreakpoint={0.8}
            breakpoints={[0.0, 0.8]}
            handleBehavior={"cycle"}
          >
            <NewEventForm closeModal={handleCloseModal} />
          </StyledIonModal>
        </>
      ) : (
        <LoginContainer>
          <LoginButton onClick={handleOnLoginClick}>Login</LoginButton>
        </LoginContainer>
      )}
    </PageContainer>
  );
};
