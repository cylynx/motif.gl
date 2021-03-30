import { useState, useEffect, useRef } from 'react';
import Timeout = NodeJS.Timeout;

/**
 * A progress timer that start from 0 to provided destination number
 *
 * @param {number} destinationNumber
 * @param {int} delayInMilliseconds
 * @param {number} step
 *
 * @return {array}
 */
const useProgressTimer = (
  destinationNumber: number,
  delayInMilliseconds: number,
  step = 1,
) => {
  const [timer, setTimer] = useState<number>(0);
  const internalRef = useRef<Timeout>();

  const startCountdown = () => {
    const intervalId = setInterval(() => {
      setTimer((previousSecond: number) => {
        if (internalRef.current) {
          if (previousSecond === destinationNumber) {
            clearInterval(intervalId);
            internalRef.current = null;
            return previousSecond;
          }

          return previousSecond + step;
        }

        return previousSecond;
      });
    }, delayInMilliseconds);

    internalRef.current = intervalId;
  };

  useEffect(() => {
    startCountdown();
  }, []);

  return [timer];
};

export default useProgressTimer;
