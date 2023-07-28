import { FunctionComponent } from "react";
import { IoHome } from "react-icons/io5";
import { CiHeadphones } from "react-icons/ci";
import { HeaderProps, HOME } from "../../constants";
import { UserSettings } from "../UserSettings";
import { HeaderContainer, HomeIcon, StyledIonModal, User } from "../../styles";

export const Header: FunctionComponent<HeaderProps> = ({ userName }) => {
  const handleHomeIconClick = () => {
    window.location.href = HOME;
  };

  return (
    <HeaderContainer>
      <HomeIcon onClick={handleHomeIconClick}>
        <IoHome />
      </HomeIcon>
      <User id="open-modal">
        {userName && <>{userName}</>}
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
    </HeaderContainer>
  );
};
