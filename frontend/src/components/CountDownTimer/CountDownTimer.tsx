import { FunctionComponent } from "react";
import { useCountdown } from "../../hooks";
import { ExpiredNotice } from "./ExpiredNotice";
import { ShowCounter } from "./ShowCounter";

type CountDownTimerProps = {
  targetDate: Date;
};

export const CountdownTimer: FunctionComponent<CountDownTimerProps> = ({
  targetDate,
}) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />;
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};
