import { FunctionComponent, useMemo, useState } from "react";
import { Header, BigButton, JoinEventForm, EventOverview, NewEventForm } from "../components";
import { useGetUserName } from "../hooks";
import { HOME, JOINEVENTBYQR } from "../constants";
import { JoinEventButton, NewEventButton, Button, CenterContainer, StyledTextL, PageContainer, SingleButtonCenterContainer, StyledIonModal, VideoBackground, VidOverlay } from "../styles";
import partyVid from "../assets/party.mp4";

export const HomePage: FunctionComponent = () => {
  const [isNewEventFormOpen, setIsNewEventFormOpen] = useState(false);
  const [isJoinEventFormOpen, setIsJoinEventFormOpen] = useState(false);
  const [bigButtonIsClicked, setBigButtonIsClicked] = useState(false);
  const userName = useGetUserName();

  const getuserID = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userID = urlParams.get("userid") || undefined;
    // Check url param access token from backend auth redirect and store it in local storage
    if (userID) {
      localStorage.setItem("userID", userID || "");
      window.location.href = HOME;
    }
    // If access token refreshed check autoeventjoin from qr code redirect
    else {
      const eventID = localStorage.getItem("autojoinevent") || undefined;
      if (eventID != undefined) {
        localStorage.removeItem("autojoinevent");
        window.location.href = JOINEVENTBYQR + `?event=${eventID}`;
      }
    }
  };

  // Just call getuserID on initial render. We assume not more than 1 hour is spent on the page, else use useEffect
  useMemo(() => {
    getuserID();
  }, []);

  // Login button click handler frontend -> backend: login -> backend: login_resonse -> redirect frontend: /?access_token=...
  const handleOnLoginClick = () => {
    window.location.href = "http://localhost:4000/account/login";
  };

  // Open module to create a new playlist
  const handleOnNewPlaylistClick = () => {
    setIsNewEventFormOpen(true);
    setBigButtonIsClicked(false);
  };
  // Close module to create a new playlist
  const handleCloseNewEventModal = () => {
    setIsNewEventFormOpen(false);
    setBigButtonIsClicked(false);
  };

  // Open module to join an event
  const handleOnJoinEventClick = () => {
    setIsJoinEventFormOpen(true);
    setBigButtonIsClicked(false);
  }; 
  // Close module to join an event
  const handleCloseJoinEventModal = () => {
    setIsJoinEventFormOpen(false);
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
          <Header userName={userName} />
          <EventOverview />
          <BigButton
            onClick={(): void => setBigButtonIsClicked(!bigButtonIsClicked)}
          />
          {bigButtonIsClicked && (
            <>
              <NewEventButton onClick={handleOnNewPlaylistClick}>Create</NewEventButton>
              <JoinEventButton onClick={handleOnJoinEventClick}>Join</JoinEventButton>
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
        <CenterContainer>
            
          <StyledTextL>
            Create your community, host events and build your custom playlist
            for it with spotify.
            <SingleButtonCenterContainer><Button onClick={handleOnLoginClick}>Get started!</Button></SingleButtonCenterContainer>
          </StyledTextL>
          
        </CenterContainer>
      )}
    </PageContainer>
  );
};
