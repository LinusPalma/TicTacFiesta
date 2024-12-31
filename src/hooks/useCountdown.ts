import { useState, useEffect } from 'react'
import { calculateTimeToNewYear } from '../utils/timeCalculation'

const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true'
const DEV_COUNTDOWN_TIME = Number(import.meta.env.VITE_DEV_COUNTDOWN_TIME) || 2

export function useCountdown() {
  const [seconds, setSeconds] = useState(DEV_MODE ? DEV_COUNTDOWN_TIME : calculateTimeToNewYear())
  const [isFinished, setIsFinished] = useState(false)
  const [isRunning, setIsRunning] = useState(true)

  const reset = () => {
    // Reset nur im DEV_MODE erlauben
    if (DEV_MODE) {
      setSeconds(DEV_COUNTDOWN_TIME)
      setIsFinished(false)
      setIsRunning(true)
    }
  }

  useEffect(() => {
    let timer: number
    
    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((prev: number) => {
          if (prev <= 1) {
            setIsFinished(true)
            setIsRunning(false)
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [isRunning])

  return { seconds, isFinished, reset }
}
