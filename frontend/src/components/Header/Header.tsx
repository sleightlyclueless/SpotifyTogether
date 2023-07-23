import { FunctionComponent } from "react";
import { IoHome } from "react-icons/io5";
import { CiHeadphones } from "react-icons/ci";
import { HOME, HeaderProps } from "../../constants";
import { UserSettings } from "../UserSettings";
import { HeaderContainer, PageName, User, HomeIcon, StyledIonModal } from "../../styles";

export const Header: FunctionComponent<HeaderProps> = ({ title, userName }) => {
  const handleHomeIconClick = () => {
    window.location.href = HOME;
  };

  return (
    <HeaderContainer>
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
    </HeaderContainer>
  );
};
