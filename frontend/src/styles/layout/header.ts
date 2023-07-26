import styled from "styled-components";
import { COLORS } from "../colors";

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`;

export const User = styled.div`
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

export const HomeIcon = styled.div`
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
