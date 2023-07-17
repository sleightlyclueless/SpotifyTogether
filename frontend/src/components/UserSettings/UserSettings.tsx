import styled from "styled-components";
import axios from "axios";
import { COLORS, HOME } from "../../constants";

const Container = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 35%;
`;

const Content = styled.div`
  margin-top: 16px;
  color: ${COLORS.font};
`;

const LogoutButton = styled.div`
  background: ${COLORS.button};
  height: 60px;
  width: 160px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);

  transition: all 0.5s;

  &:hover {
    cursor: pointer;
    background: ${COLORS.buttonHover};
  }
`;

export const UserSettings = () => {
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
    <Container>
      <Content>Settings</Content>
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
    </Container>
  );
};
