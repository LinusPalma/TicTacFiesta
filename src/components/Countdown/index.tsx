import { formatTime } from '../../utils/timeCalculation'

interface CountdownProps {
  seconds: number
}

const Countdown = ({ seconds }: CountdownProps) => {
  return (
    <div>
      <h1>{formatTime(seconds)}</h1>
    </div>
  )
}

export default Countdown
