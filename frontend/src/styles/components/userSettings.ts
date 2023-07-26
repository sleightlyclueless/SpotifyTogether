import styled from "styled-components";
import { COLORS } from "../colors";

export const UserSettingsContainer = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 35%;
  color: ${COLORS.font};
`;

export const Content = styled.div`
  margin-top: 16px;
  color: ${COLORS.font};
`;

export const LogoutButton = styled.div`
  background: ${COLORS.button};
  height: 60px;
  width: 160px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);

  transition: all 0.5s;
`;
