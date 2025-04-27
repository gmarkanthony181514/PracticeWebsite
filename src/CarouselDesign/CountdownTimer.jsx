import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ endTime }) => {

  //Time Functionality based on Date.Now
  const calculateTimeLeft = () => {
    const difference = new Date(endTime) - new Date();
      if (isNaN(difference)) {
        return { hours: '00', minutes: '00', seconds: '00' };
      }

    //Time Setter
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
        minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0'),
        seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, '0'),
      };
    } else {
      timeLeft = { hours: '00', minutes: '00', seconds: '00' };
    }

    return timeLeft;
  };

  //Time Left Countdown
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <span>
      {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
    </span>
  );
};

export default CountdownTimer;
