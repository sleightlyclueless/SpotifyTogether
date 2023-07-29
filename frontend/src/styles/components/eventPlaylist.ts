import styled from "styled-components";
import { COLORS } from "../colors";

export const LoadingSpinner = styled.div`
  top: 50%;
  width: 50px;
  height: 50px;
  border: 10px solid #f3f3f3; /* Light grey */
  border-top: 10px solid #383636; /* Black */
  border-radius: 50%;
  animation: spinner 1.5s linear infinite;
  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
`;

export const SongContainer = styled.div`
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 50%;
  overflow-y: scroll;
  color: ${COLORS.fontDark};
  margin: 16px 0 32px;
`;

export const SearchContainer = styled.div`
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 14%;
  overflow-y: scroll;
  color: ${COLORS.fontDark};
  margin: 16px 0 32px;
`;

export const SongItemContainer = styled.div`
  display: flex;
  align-items: center;
  width: 95%;
  max-width: 400px;
  min-height: 40px;
  padding: 8px 16px 8px;
  border-radius: 8px;
  background: ${COLORS.font};
  border: none;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
  margin-bottom: 8px;
  transition: all 0.5s;
  overflow: hidden;
  position: relative;
`;

export const SongItemImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 8px;
`;

export const DeleteIcon = styled.span`
  color: ${COLORS.link};
  font-size: 30px;
  transition: all 0.5s;
  position: absolute;
  right: 8px;
`;
