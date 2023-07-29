import styled from "styled-components";
import { LuEdit2 } from "react-icons/lu";
import { IonPopover } from "@ionic/react";
import { BiCopy } from "react-icons/bi";
import { MdClose, MdCopyAll } from "react-icons/md";
import { AiOutlineArrowDown } from "react-icons/ai";
import { COLORS } from "../colors";

export const EventOverviewContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  padding: 16px;
  gap: 16px;
`;

export const ParticipantsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  padding: 16px;
  gap: 16px;
  color: ${COLORS.font};
`;

export const ParticipantItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid ${COLORS.font};
`;

export const ParticipantId = styled.div`
  font-weight: bold;
  min-width: 100px;
`;

export const SinglePlaylist = styled.div`
  width: 120px;
  height: 120px;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
  background: rgba(${COLORS.link}, 0.95);
  opacity: 0.85;
  transition: all 0.5s;

  &:hover {
    cursor: pointer;
    opacity: 1;
  }
`;

export const PartyName = styled.div`
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
  width: 100px;
`;

export const Timer = styled.div`
  border-radius: 12px;
  background: ${COLORS.background};
  color: ${COLORS.background};
  padding: 8px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
`;

export const DetailViewEventContainer = styled.div`
  height: 75%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

export const FullPartyName = styled.div`
  color: ${COLORS.font};
  margin-top: 16px;
  font-size: 20px;
`;

export const TimerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TimerText = styled.div`
  color: ${COLORS.font};
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 16px;
  flex-wrap: wrap;
`;

export const StyledCode = styled.div`
  height: 60px;
  color: ${COLORS.background};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

export const StyledBiCopy = styled(BiCopy)`
  width: 20px;
  height: 20px;
  color: ${COLORS.background};
  cursor: pointer;
  transition: 0.2s ease-in-out;
`;

export const StyledMdClose = styled(MdClose)`
  width: 20px;
  height: 20px;
  color: ${COLORS.font};
  cursor: pointer;
  transition: 0.2s ease-in-out;
`;

export const StyledRoleDropdown = styled.select`
  padding: 8px;
  border-radius: 8px;
  background: ${COLORS.background};
  color: ${COLORS.font};
  border: none;
  font-size: 14px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
`;

export const StyledRoleText = styled.div`
  min-width: 100px;
`;

export const NoEventsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 75vh;
  gap: 20px;
`;

export const StyledAiOutlineArrowDown = styled(AiOutlineArrowDown)`
  width: 40px;
  height: 40px;
`;

export const StyledLuEdit2 = styled(LuEdit2)`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 20px;
  height: 20px;
  color: ${COLORS.font};
  transition: all 0.5s;

  &:hover {
    cursor: pointer;
    color: ${COLORS.link};
  }
`;

export const StyledLuClose = styled(MdClose)`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 20px;
  height: 20px;
  color: ${COLORS.font};
  transition: all 0.5s;

  &:hover {
    cursor: pointer;
    color: ${COLORS.link};
  }
`;

export const StyledBiCheckCircle = styled(MdCopyAll)`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 20px;
  height: 20px;
  color: ${COLORS.font};
  transition: all 0.5s;

  &:hover {
    cursor: pointer;
    color: ${COLORS.link};
  }
`;

export const StyledBiXCircle = styled(MdClose)`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 20px;
  height: 20px;
  color: ${COLORS.font};
  transition: all 0.5s;

  &:hover {
    cursor: pointer;
    color: ${COLORS.link};
  }
`;

export const StyledIonPopover = styled(IonPopover)`
  --box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
`;
