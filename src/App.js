import './App.css';
import Background from './Component/Background/background';
import CountDown from './Component/CountDown/CountDown';
import Header from './Component/Header/Header';
import InfoPage from './Component/InfoPage/InfoPage';
import Wedding from './Component/Wedding/Wedding';

function App() {
  return (
    <>
      <Background />
      <div className="App">
        <Header />
        <CountDown />
        <InfoPage />
        <Wedding />
      </div>
    </>
  );
}

export default App;
