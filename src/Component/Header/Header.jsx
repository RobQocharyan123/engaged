import './Header.css';

import endIcon from '../../Assets/header/end-icon.svg';
import musicFile from '../../Assets/music.mp4';
import { useRef, useState, useEffect } from 'react';
import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const Header = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Create the Audio object only once
    audioRef.current = new Audio(musicFile);
    audioRef.current.loop = true; // Optional: loop the music
    return () => {
      // Cleanup on component unmount
      audioRef.current.pause();
    };
  }, []);

  const handleClick = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);

      // Scroll to #wedding after play
      const weddingSection = document.getElementById('wedding');
      if (weddingSection) {
        weddingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const childVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div className="header">
      <h1>Հարսանյաց հրավեր</h1>

      <motion.div
        className="name"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.p variants={childVariants}>Հակոբ</motion.p>
        <motion.p variants={childVariants}>Լիլիթ</motion.p>
        <motion.img
          src={endIcon}
          alt="end icon"
          className="endIcon"
          variants={childVariants}
        />
        <motion.div
          className="music"
          onClick={handleClick}
          variants={childVariants}
        >
          {isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Header;
