import React, { useState, useEffect } from 'react';
import './CountDown.css';
import Confetti from '../../Confetti';

const COUNTDOWN_DURATION = 10;

const getOrCreateCountdownTarget = () => {
  const savedTarget = localStorage.getItem('countdownTarget');
  const savedDuration = localStorage.getItem('countdownDuration');

  // if duration changed, reset everything
  if (savedDuration !== COUNTDOWN_DURATION.toString()) {
    const newTarget = Date.now() + COUNTDOWN_DURATION;
    localStorage.setItem('countdownTarget', newTarget.toString());
    localStorage.setItem('countdownDuration', COUNTDOWN_DURATION.toString());
    return new Date(newTarget);
  }

  if (savedTarget) {
    return new Date(parseInt(savedTarget));
  }

  const newTarget = Date.now() + COUNTDOWN_DURATION;
  localStorage.setItem('countdownTarget', newTarget.toString());
  localStorage.setItem('countdownDuration', COUNTDOWN_DURATION.toString());
  return new Date(newTarget);
};

const getTimeLeft = (target) => {
  const totalTimeLeft = target - new Date();

  if (totalTimeLeft <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true };
  }

  const days = Math.floor(totalTimeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalTimeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((totalTimeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((totalTimeLeft / 1000) % 60);

  return { days, hours, minutes, seconds, isOver: false };
};

const CountDown = ({ showCelebration, setShowCelebration }) => {
  const countdownTarget = getOrCreateCountdownTarget();
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(countdownTarget));

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = getTimeLeft(countdownTarget);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.isOver && !showCelebration) {
        setShowCelebration(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countdownTarget, showCelebration]);

  return (
    <div className="countdown">
      <h2 id="wedding">Հարսանիքին մնաց</h2>

      <div className="content">
        {['days', 'hours', 'minutes', 'seconds'].map((label) => {
          const value = timeLeft[label];
          let armenianLabel = '';
          switch (label) {
            case 'days':
              armenianLabel = 'Օր';
              break;
            case 'hours':
              armenianLabel = 'Ժամ';
              break;
            case 'minutes':
              armenianLabel = 'րոպե';
              break;
            case 'seconds':
              armenianLabel = 'Վայրկյան';
              break;
          }

          return (
            <div className="box" key={label}>
              <div className="value">
                <span>{String(value).padStart(2, '0')}</span>
                <span className="label">{armenianLabel}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CountDown;
