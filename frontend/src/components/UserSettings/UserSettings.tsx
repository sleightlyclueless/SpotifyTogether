import styled from "styled-components";

const Container = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const Content = styled.div`
  margin-top: 16px;
  color: #ffffff;
`;

const LogoutButton = styled.div`
  background: #563a57;
  color: #ffffff;
  height: 60px;
  width: 160px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
  position: absolute;
  bottom: 200px;
  right: calc(50% - 80px);
`;

export const UserSettings = () => {
  return (
    <Container>
      <Content>Settings</Content>
      <LogoutButton>Logout</LogoutButton>
    </Container>
  );
};
