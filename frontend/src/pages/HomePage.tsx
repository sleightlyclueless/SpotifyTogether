import { FunctionComponent, useMemo, useState } from "react";
import {
  BigButton,
  EventOverview,
  Header,
  JoinEventForm,
  NewEventForm,
  PageContainer,
  StyledIonModal,
} from "../components";
import styled from "styled-components";
import { useGetUserName } from "../hooks";
import { COLORS, HOME, JOINEVENTBYQR } from "../constants";
import partyVid from "../assets/party.mp4";
import { toast } from "react-toastify";

const VidOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: -1;
`;

const VideoBackground = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const LoginText = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: white;
  text-align: center;
  margin-bottom: 16px;
`;

const LoginButton = styled.div`
  border-radius: 8px;
  border: 1px solid white;
  color: white;
  padding: 10px;
  max-width: 200px;
  margin: 20px auto;
  text-align: center;
  cursor: pointer;
  background: ${COLORS.button};
  transition: all 0.5s;

  &:hover {
    cursor: pointer;
    background: ${COLORS.buttonHover};
  }
`;

const NewEventButton = styled.div`
  position: absolute;
  bottom: 100px;
  left: 25%;
  border-radius: 50%;
  background: ${COLORS.button};
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  transition: all 0.5s;

  &:hover {
    cursor: pointer;
    background: ${COLORS.buttonHover};
  }

  animation: 0.3s slide-in;
  @keyframes slide-in {
    from {
      transform: translateY(100%) translateX(100%);
    }
    to {
      transform: translateY(0) translateX(0);
    }
  }
`;

const JoinEventButton = styled.div`
  position: absolute;
  bottom: 100px;
  right: 25%;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${COLORS.button};
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s;

  &:hover {
    cursor: pointer;
    background: ${COLORS.buttonHover};
  }

  animation: 0.3s slide-in2;
  @keyframes slide-in2 {
    from {
      transform: translateY(100%) translateX(-50%);
    }
    to {
      transform: translateY(0) translateX(0);
    }
  }
`;

export const HomePage: FunctionComponent = () => {
  const [isNewEventFormOpen, setIsNewEventFormOpen] = useState(false);
  const [isJoinEventFormOpen, setIsJoinEventFormOpen] = useState(false);
  const [bigButtonIsClicked, setBigButtonIsClicked] = useState(false);
  const getAccessToken = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access_token") || undefined;
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken || "");
      window.location.href = HOME;
    } else {
      // If access token refreshed check autoeventjoin
      const eventCode = localStorage.getItem("autojoinevent") || undefined;
      if (eventCode != undefined) {
        localStorage.removeItem("autojoinevent");
        window.location.href = JOINEVENTBYQR + `?event=${eventCode}`;
      }
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
    setIsNewEventFormOpen(true);
    setBigButtonIsClicked(false);
  };

  const handleCloseNewEventModal = () => {
    setIsNewEventFormOpen(false);
  };

  const handleCloseJoinEventModal = () => {
    setIsJoinEventFormOpen(false);
  };

  const handleOnJoinEventClick = () => {
    setIsJoinEventFormOpen(true);
    setBigButtonIsClicked(false);
  };

  return (
    <PageContainer>
      <VideoBackground autoPlay loop muted>
        <source src={partyVid} type="video/mp4" />
      </VideoBackground>
      <VidOverlay />
      {userName ? (
        <>
          <Header title={"Home"} userName={userName || undefined} />
          <EventOverview />
          <BigButton
            onClick={(): void => setBigButtonIsClicked(!bigButtonIsClicked)}
          />
          {bigButtonIsClicked && (
            <>
              <NewEventButton onClick={handleOnNewPlaylistClick}>
                Create
              </NewEventButton>
              <JoinEventButton onClick={handleOnJoinEventClick}>
                Join
              </JoinEventButton>
            </>
          )}
          <StyledIonModal
            isOpen={isNewEventFormOpen}
            onDidDismiss={() => setIsNewEventFormOpen(false)}
            mode={"ios"}
            initialBreakpoint={0.8}
            breakpoints={[0.0, 0.8]}
            handleBehavior={"cycle"}
          >
            <NewEventForm closeModal={handleCloseNewEventModal} />
          </StyledIonModal>
          <StyledIonModal
            isOpen={isJoinEventFormOpen}
            onDidDismiss={() => setIsJoinEventFormOpen(false)}
            mode={"ios"}
            initialBreakpoint={0.5}
            breakpoints={[0.0, 0.5]}
            handleBehavior={"cycle"}
          >
            <JoinEventForm closeModal={handleCloseJoinEventModal} />
          </StyledIonModal>
        </>
      ) : (
        <LoginContainer>
          <LoginText>
            Create your community, host events and build your custom playlist
            for it with spotify.
            <LoginButton onClick={handleOnLoginClick}>Get started!</LoginButton>
          </LoginText>
        </LoginContainer>
      )}
    </PageContainer>
  );
};
