import { FunctionComponent } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const DateTimeDisplay = styled.div``;

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
      <DateTimeDisplay>{days}</DateTimeDisplay>
      <div>:</div>
      <DateTimeDisplay>{hours}</DateTimeDisplay>
      <div>:</div>
      <DateTimeDisplay>{minutes}</DateTimeDisplay>
      <div>:</div>
      <DateTimeDisplay>{seconds}</DateTimeDisplay>
    </Container>
  );
};
