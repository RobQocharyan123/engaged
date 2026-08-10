import './Header.css';

import endIcon from '../../Assets/header/end-icon.svg';
import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const Header = ({ isPlaying, onToggleMusic }) => {
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
    <motion.header className="header">
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
        <motion.button
          type="button"
          className="music"
          onClick={onToggleMusic}
          variants={childVariants}
          aria-label={isPlaying ? 'Դադարեցնել երաժշտությունը' : 'Միացնել երաժշտությունը'}
          aria-pressed={isPlaying}
        >
          {isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
        </motion.button>
      </motion.div>
    </motion.header>
  );
};

export default Header;
