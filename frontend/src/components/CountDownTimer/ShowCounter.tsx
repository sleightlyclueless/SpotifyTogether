import { FunctionComponent } from "react";
import styled from "styled-components";
import { COLORS } from "../../constants";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  color: ${COLORS.font};
`;

type ShowCounterProps = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export const ShowCounter: FunctionComponent<ShowCounterProps> = ({
  days,
  hours,
  minutes,
  seconds,
}) => {
  return (
    <Container className="show-counter">
      {days}:{hours}:{minutes}:{seconds}
    </Container>
  );
};
