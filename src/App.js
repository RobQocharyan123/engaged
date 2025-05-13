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
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
function App() {
  const [showCelebration, setShowCelebration] = useState(false);
  return (
    <>
      <Background />
      <div className="App">
        {showCelebration && <Confetti />}
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
      <ToastContainer />
    </>
  );
}

export default App;
