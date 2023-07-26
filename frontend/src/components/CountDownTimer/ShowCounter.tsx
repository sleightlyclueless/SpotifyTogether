import { FunctionComponent } from "react";
import { ShowCounterContainer } from "../../styles";

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
    <ShowCounterContainer>
      {days}:{hours}:{minutes}:{seconds}
    </ShowCounterContainer>
  );
};
