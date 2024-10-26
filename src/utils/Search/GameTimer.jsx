/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';

const GameTimer = ({ createdAt }) => {
  const [elapsedTime, setElapsedTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateElapsedTime = () => {
      const now = new Date();
      const createdTime = new Date(createdAt);
      const difference = now - createdTime;

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setElapsedTime({ hours, minutes, seconds });
    };

    calculateElapsedTime();
    const intervalId = setInterval(calculateElapsedTime, 1000);

    return () => clearInterval(intervalId);
  }, [createdAt]);
  return (
    <div>
      <h1>
        {`${String(elapsedTime.hours).padStart(2, '0')}:${String(elapsedTime.minutes).padStart(
          2,
          '0'
        )}:${String(elapsedTime.seconds).padStart(2, '0')}`}
      </h1>
    </div>
  );
};

export default GameTimer;
