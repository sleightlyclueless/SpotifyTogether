import styled from "styled-components";
import { LuEdit2 } from "react-icons/lu";
import { IonPopover } from "@ionic/react";
import { BiCopy } from "react-icons/bi";
import { MdClose, MdCopyAll } from "react-icons/md";
import { AiOutlineArrowDown } from "react-icons/ai";
import { COLORS } from "../colors";
import { IonContainer80 } from "../basics";

export const PlaylistContainer = styled.div`
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
  background: rgba(${COLORS.linkRGB}, 0.75);
  transition: all 0.5s;

  &:hover {
    cursor: pointer;
    background: rgba(${COLORS.linkRGB}, 1);
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 16px;
  flex-wrap: wrap;
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

export const TimerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TimerText = styled.div`
  color: ${COLORS.font};
`;

export const DetailViewEventContainer = styled(IonContainer80)`
  justify-content: space-between;
  height: 75%;
`;

export const StyledCode = styled.div`
  height: 60px;
  color: ${COLORS.background};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

export const StyledRoleDropdown = styled.select`
  padding: 8px;
  border-radius: 8px;
  background: ${COLORS.link};
  color: ${COLORS.font};
  border: none;
  font-size: 14px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
`;

export const StyledRoleText = styled.div`
  min-width: 100px;
`;

export const StyledAiOutlineArrowDown = styled(AiOutlineArrowDown)`
  width: 40px;
  height: 40px;
`;

export const StyledBiCopy = styled(BiCopy)`
  width: 20px;
  height: 20px;
  color: ${COLORS.background};
  cursor: pointer;
  transition: 0.2s ease-in-out;
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
  width: 20px;
  height: 20px;
  color: ${COLORS.font};
  transition: all 0.5s;

  &:hover {
    cursor: pointer;
    color: ${COLORS.link};
  }
`;

export const StyledLuCloseTop = styled(StyledLuClose)`
  position: absolute;
  top: 16px;
  right: 16px;
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
