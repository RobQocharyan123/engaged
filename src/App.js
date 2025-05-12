import { useState } from 'react';
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

function App() {
  const [showCelebration, setShowCelebration] = useState(false);
  return (
    <>
      {showCelebration && <Confetti />}

      <Background />
      <div className="App">
        <Header />
        <CountDown
          showCelebration={showCelebration}
          setShowCelebration={setShowCelebration}
        />
        <InfoPage />
        <Wedding />
        <Restaurant />
        <ContactUs />
        <Footer />
      </div>
    </>
  );
}

export default App;
