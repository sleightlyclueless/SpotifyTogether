import styled from "styled-components";
import { COLORS } from "../colors";

export const LoadingContainer = styled.div`
  display: flex;
  height: 80%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

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

export const SearchResultsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 100px;
  overflow-y: scroll;
`;

export const SongContainer = styled.div`
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 50%;
  overflow-y: scroll;
`;

export const SongItemContainer = styled.div`
  display: flex;
  align-items: center;
  width: 95%;
  max-width: 400px;
  min-height: 40px;
  padding: 8px;
  border-radius: 8px;
  background: ${COLORS.font};
  border: none;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
  margin-bottom: 8px;
  transition: all 0.5s;
  overflow: hidden;
`;

export const SearchItemContainer = styled.div`
  display: flex;
  align-items: center;
  width: 95%;
  max-width: 400px;
  min-height: 40px;
  padding: 8px;
  border-radius: 8px;
  background: ${COLORS.font};
  border: none;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
  margin-bottom: 8px;
  transition: all 0.5s;
  cursor: pointer;
  overflow: hidden;
`;

export const SongItemImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 8px;
`;

export const SongItemText = styled.div`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledText = styled.div`
  color: ${COLORS.font};
  font-size: 16px;
`;

export const StyledDeleteButton = styled.button`
  background-color: transparent;
  border: none;
`;

export const DeleteIcon = styled.span`
  color: ${COLORS.button};
  font-size: 30px;
  transition: all 0.5s;
`;
