import { useState, useEffect } from 'react'
import { calculateTimeToNewYear } from '../utils/timeCalculation'

// Wir ändern den Export zu einem "named export"
export function useCountdown() {
  const [seconds, setSeconds] = useState(calculateTimeToNewYear())
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          setIsFinished(true)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return { seconds, isFinished }
}
