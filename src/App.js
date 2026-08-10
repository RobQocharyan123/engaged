import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import Background from './Component/Background/background';
import ContactUs from './Component/ContactUs/ContactUs';
import CountDown from './Component/CountDown/CountDown';
import Footer from './Component/Footer/Footer';
import Header from './Component/Header/Header';
import InfoPage from './Component/InfoPage/InfoPage';
import Restaurant from './Component/Restaurant/Restaurant';
import Wedding from './Component/Wedding/Wedding';
import Confetti from './Confetti';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import OpeningCover from './Component/OpeningCover/OpeningCover';
import RevealSection from './Component/RevealSection/RevealSection';
import musicFile from './Assets/music.mp3';

function App() {
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(musicFile);
    audio.loop = true;
    audio.preload = 'metadata';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const playMusic = useCallback(async () => {
    if (!audioRef.current) return;

    try {
      await audioRef.current.play();
      setIsMusicPlaying(true);
    } catch {
      setIsMusicPlaying(false);
    }
  }, []);

  const toggleMusic = useCallback(async () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      await playMusic();
    } else {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    }
  }, [playMusic]);

  const handleInvitationOpened = () => {
    setIsInvitationOpen(true);
    window.requestAnimationFrame(() => contentRef.current?.focus());
  };

  return (
    <>
      {!isInvitationOpen && (
        <OpeningCover
          onOpenStart={playMusic}
          onOpened={handleInvitationOpened}
        />
      )}
      <Background />
      <main
        className="App"
        ref={contentRef}
        tabIndex="-1"
      >
        {isInvitationOpen && (
          <>
            {showCelebration && <Confetti />}
            <Header isPlaying={isMusicPlaying} onToggleMusic={toggleMusic} />
            <RevealSection>
              <CountDown setShowCelebration={setShowCelebration} />
            </RevealSection>
            <RevealSection>
              <InfoPage />
            </RevealSection>
            <RevealSection>
              <Wedding />
            </RevealSection>
            <RevealSection delay={0.06}>
              <Restaurant />
            </RevealSection>
            <RevealSection>
              <ContactUs />
            </RevealSection>
            <RevealSection>
              <Footer />
            </RevealSection>
          </>
        )}
      </main>
      <ToastContainer position="bottom-center" theme="dark" />
    </>
  );
}

export default App;
