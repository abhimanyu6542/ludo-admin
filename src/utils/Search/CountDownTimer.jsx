import React, { useState, useEffect } from 'react';

const CountDownTimer = ({ startDateTime }) => {
  const [timeLeft, setTimeLeft] = useState(5 * 60 * 1000); // Set initial time left to 5 minutes in milliseconds

  useEffect(() => {
    const targetTime = new Date(startDateTime).getTime() + 5 * 60 * 1000; // Add 5 minutes to the start time

    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        clearInterval(intervalId); // Clear the interval when time reaches 0
        setTimeLeft(0); // Set time left to 0
      } else {
        setTimeLeft(difference); // Update the time left
      }
    }, 1000);

    return () => clearInterval(intervalId); // Clear the interval on component unmount
  }, [startDateTime]);

  const formatTimeLeft = (timeLeft) => {
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div>
      <p>{formatTimeLeft(timeLeft)} min</p>
    </div>
  );
};

export default CountDownTimer;