import React, { useState, useEffect } from 'react';

const ReverseCounter = () => {
  const [count, setCount] = useState(60);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCount(prevCount => {
        if (prevCount === 1) {
          return 60; // Reset the count to 60 when it reaches 0
        } else {
          return prevCount - 1;
        }
      });
    }, 1000);

    return () => clearInterval(timerId); // Cleanup the interval on component unmount
  }, []); // Empty dependency array to set up the interval only once

  return (
    <div>
      <h1>{count} Sec</h1>
    </div>
  );
};

export default ReverseCounter;
