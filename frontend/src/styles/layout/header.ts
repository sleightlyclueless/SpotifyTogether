import styled from "styled-components";
import { COLORS } from "../colors";

export const HeaderContainer = styled.div`
  display: grid;
  grid-template-columns: 15% 70% 15%;
  align-items: center;
  position: sticky;
  top: 0;
  padding: 20px;
  background-color: ${COLORS.background};
`;

export const PageName = styled.div`
  font-size: 18px;
  text-align: center;
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
