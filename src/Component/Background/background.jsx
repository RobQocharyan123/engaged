import './background.css';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import img1 from '../../Assets/background/img1.jpg';
import img2 from '../../Assets/background/img2.jpg';

const Background = () => {
  return (
    <div className="background">
      <img src={img1} alt={img1} />
    </div>
  );
};

export default Background;
