import { useEffect, useState } from "react";
const TIME_LIMIT_IN_SECONDS = 20;

const handleClearInterval = (intervalID: NodeJS.Timeout) => {
  clearInterval(intervalID);
};

const useCountDown = () => {
  const [timeRemaining, setTimeRemaining] = useState(TIME_LIMIT_IN_SECONDS);

  useEffect(() => {
    let intervalID: NodeJS.Timeout = null;
    const x = timeRemaining - 1;
    if (x >= 0) {
      intervalID = setInterval(() => {
        setTimeRemaining(x);
        if (x <= 0) {
          handleClearInterval(intervalID);
        }
      }, 1000);
    }

    return () => {
      handleClearInterval(intervalID);
    };
  }, [timeRemaining]);

  return timeRemaining;
};

export default useCountDown;
