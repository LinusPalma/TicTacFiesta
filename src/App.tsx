import { useCountdown } from './hooks/useCountdown'
import Countdown from './components/Countdown'
import FinalCountdown from './components/FinalCountdown'
import Fireworks from './components/Fireworks'
import './App.css'

function App() {
  const { seconds, isFinished, reset } = useCountdown()
  const isFinalCountdown = seconds <= 10 && !isFinished

  return (
    <div className="app">
      {isFinished ? (
        <Fireworks onReset={reset} />
      ) : isFinalCountdown ? (
        <FinalCountdown seconds={seconds} />
      ) : (
        <Countdown seconds={seconds} />
      )}
    </div>
  )
}

export default App
