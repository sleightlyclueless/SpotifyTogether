import styled from "styled-components";
import { FunctionComponent } from "react";
import { IoHome } from "react-icons/io5";
import { CiHeadphones } from "react-icons/ci";
import { IonModal } from "@ionic/react";
import { HOME } from "../../constants/routes";
import { UserSettings } from "../UserSettings";
import { COLORS } from "../../constants";
import { HeaderProps } from "../../constants/types";

const Container = styled.div`
  display: grid;
  grid-template-columns: 15% 70% 15%;
  align-items: center;
  position: sticky;
  top: 0;
  padding: 20px;
  background-color: ${COLORS.background};
`;

const PageName = styled.div`
  font-size: 18px;
  text-align: center;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  transition: all 0.5s;
  &:hover {
    cursor: pointer;
    color: ${COLORS.link};
  }
`;

const HomeIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.5s;

  &:hover {
    background-color: ${COLORS.link};
  }
`;

export const StyledIonModal = styled(IonModal)`
  --backdrop-opacity: 0.5;
  --background: ${COLORS.background};
`;

export const Header: FunctionComponent<HeaderProps> = ({ title, userName }) => {
  const handleHomeIconClick = () => {
    window.location.href = HOME;
  };

  return (
    <Container>
      <HomeIcon onClick={handleHomeIconClick}>
        <IoHome />
      </HomeIcon>
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
