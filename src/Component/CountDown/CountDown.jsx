import { useState, useEffect } from 'react';
import './CountDown.css';
import { getTimeToENdEngaged } from '../../services/reigisterService';

const getTimeLeft = (milliseconds) => {
  if (milliseconds <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true };
  }

  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const seconds = Math.floor((milliseconds / 1000) % 60);

  return { days, hours, minutes, seconds, isOver: false };
};

const CountDown = ({ showCelebration, setShowCelebration }) => {
  const [remainingMs, setRemainingMs] = useState(0);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(0));

  useEffect(() => {
    let timer;

    const fetchRemainingTime = async () => {
      try {
        const res = await getTimeToENdEngaged(); // GET /remaining-time
        if (res?.remaining_time_milliseconds !== undefined) {
          setRemainingMs(res.remaining_time_milliseconds);

          // start countdown
          timer = setInterval(() => {
            setRemainingMs((prev) => {
              const newMs = Math.max(0, prev - 1000);
              const updated = getTimeLeft(newMs);
              setTimeLeft(updated);

              if (updated.isOver) {
                if (!showCelebration) setShowCelebration(true);
                clearInterval(timer);
              }

              return newMs;
            });
          }, 1000);
        }
      } catch (error) {
        console.error('Failed to fetch remaining time', error);
      }
    };

    fetchRemainingTime();

    return () => clearInterval(timer); // clean up
  }, [setShowCelebration, showCelebration]);

  return (
    <div className="countdown">
      <h2 id="wedding">Հարսանիքին մնաց</h2>
      <div className="content">
        {['days', 'hours', 'minutes', 'seconds'].map((label) => {
          const value = timeLeft[label];
          const labelMap = {
            days: 'Օր',
            hours: 'Ժամ',
            minutes: 'րոպե',
            seconds: 'Վայրկյան',
          };

          return (
            <div className="box" key={label}>
              <div className="value">
                <span>{String(value).padStart(2, '0')}</span>
                <span className="label">{labelMap[label]}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CountDown;
