import styled from "styled-components";
import { COLORS } from "../colors";

export const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const LoginText = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: white;
  text-align: center;
  margin-bottom: 16px;
`;

export const LoginButton = styled.div`
  border-radius: 8px;
  border: 1px solid white;
  color: white;
  padding: 10px;
  max-width: 200px;
  margin: 20px auto;
  text-align: center;
  cursor: pointer;
  background: ${COLORS.button};
  transition: all 0.5s;
`;

export const NewEventButton = styled.div`
  position: absolute;
  bottom: 100px;
  left: 25%;
  border-radius: 50%;
  background: ${COLORS.button};
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  transition: all 0.5s;

  animation: 0.3s slide-in;
  @keyframes slide-in {
    from {
      transform: translateY(100%) translateX(100%);
    }
    to {
      transform: translateY(0) translateX(0);
    }
  }
`;

export const JoinEventButton = styled.div`
  position: absolute;
  bottom: 100px;
  right: 25%;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${COLORS.button};
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s;

  animation: 0.3s slide-in2;
  @keyframes slide-in2 {
    from {
      transform: translateY(100%) translateX(-50%);
    }
    to {
      transform: translateY(0) translateX(0);
    }
  }
`;
