interface FinalCountdownProps {
  seconds: number
}

const FinalCountdown = ({ seconds }: FinalCountdownProps) => {
  return (
    <div>
      <h1>{seconds}</h1>
    </div>
  )
}

export default FinalCountdown
