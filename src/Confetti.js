import { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';

const Confetti = () => {
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: document.documentElement.scrollHeight,
  });

  const detectSize = () => {
    setWindowDimension({
      width: window.innerWidth,
      height: document.documentElement.scrollHeight,
    });
  };

  useEffect(() => {
    detectSize();
    window.addEventListener('resize', detectSize);
    window.addEventListener('scroll', detectSize);

    return () => {
      window.removeEventListener('resize', detectSize);
      window.removeEventListener('scroll', detectSize);
    };
  }, []);

  return (
    <ReactConfetti
      width={windowDimension.width}
      height={windowDimension.height}
      tweenDuration={1000}
    />
  );
};

export default Confetti;
