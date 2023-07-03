import styled from "styled-components";
import { FunctionComponent } from "react";
import { IoPlayBackOutline } from "react-icons/io5";
import { CiHeadphones } from "react-icons/ci";
import { IonModal } from "@ionic/react";
import { UserSettings } from "../UserSettings";
import { COLORS } from "../../constants";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  position: sticky;
  top: 16px;
  padding: 0 20px 32px 24px;
`;

const Placeholder = styled.div`
  width: 80px;
  height: 32px;
`;

const BackButton = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PageName = styled.div`
  font-size: 18px;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  gap: 4px;
`;

export const StyledIonModal = styled(IonModal)`
  --backdrop-opacity: 0.5;
  --background: ${COLORS.background};
`;

type HeaderProps = {
  title: string;
  userName?: string;
};

export const Header: FunctionComponent<HeaderProps> = ({ title, userName }) => {
  return (
    <Container>
      {title === "Home" ? (
        <Placeholder></Placeholder>
      ) : (
        <BackButton>
          <IoPlayBackOutline />
        </BackButton>
      )}
      <PageName>{title}</PageName>
      <User id="open-modal">
        {userName && <div>{userName}</div>}
        <CiHeadphones style={{ width: "24px", height: "24px" }} />
      </User>
      <StyledIonModal
        trigger="open-modal"
        mode={"ios"}
        initialBreakpoint={0.4}
        breakpoints={[0.0, 0.4]}
        handleBehavior={"cycle"}
      >
        <UserSettings />
      </StyledIonModal>
    </Container>
  );
};
