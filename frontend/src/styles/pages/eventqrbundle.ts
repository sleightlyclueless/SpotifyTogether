import styled from "styled-components";
import { COLORS } from "../colors";

export const QrOverlay = styled.div`
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
  background: ${COLORS.white};
`;
