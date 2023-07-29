import styled from "styled-components";
import { RoundButton } from "../basics";

export const VidOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: -1;
`;

export const VideoBackground = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
`;

export const NewEventButton = styled(RoundButton)`
  animation: 0.3s slide-out-top-right forwards;
  @keyframes slide-out-top-right {
    from {
      transform: translateY(0) translateX(0);
    }
    to {
      transform: translateY(-100%) translateX(-100%);
    }
  }
`;

export const JoinEventButton = styled(RoundButton)`
  animation: 0.3s slide-out-top-left forwards;
  @keyframes slide-out-top-left {
    from {
      transform: translateY(0) translateX(0);
    }
    to {
      transform: translateY(-100%) translateX(100%);
    }
  }
`;
