import './App.css';
import Background from './Component/Background/background';
import CountDown from './Component/CountDown/CountDown';
import Header from './Component/Header/Header';
import Confetti from './Confetti';

function App() {
  return (
    <>
      <Background />
      <div className="App">
        <Header />
        <CountDown />
      </div>
    </>
  );
}

export default App;
