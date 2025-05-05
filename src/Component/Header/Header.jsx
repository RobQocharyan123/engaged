import './Header.css';

import endIcon from '../../Assets/header/end-icon.svg';
import musicPlayIcon from '../../Assets/header/music-play-icon.svg';
import musicFile from '../../Assets/music.mp3';
import { useState } from 'react';
import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';

const Header = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = () => {
    const audio = new Audio(musicFile);

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };
  return (
    <div className="header">
      <h1>Հարսանյաց հրավեր</h1>

      <div className="name">
        <p>Poxos</p>
        <p>petros</p>
        <img src={endIcon} alt={endIcon} className="endIcon" />
        <div className="music" onClick={handleClick}>
          {isPlaying ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
          {/* <img
            src={musicPlayIcon}
            alt={musicPlayIcon}
            className="musicPlayIcon"
            onClick={handleClick}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default Header;
