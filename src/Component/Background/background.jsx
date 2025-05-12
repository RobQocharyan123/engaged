import './background.css';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import img1 from '../../Assets/background/img1.jpg';
import img2 from '../../Assets/background/img2.jpg';

const images = [img1, img2];

const Background = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="background">
      <AnimatePresence exitBeforeEnter>
        <motion.img
          key={index}
          src={images[index]}
          alt={`background-${index}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3 }}
          className="background"
        />
      </AnimatePresence>
    </div>
  );
};

export default Background;
