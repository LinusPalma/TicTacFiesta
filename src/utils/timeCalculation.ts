export const calculateTimeToNewYear = (): number => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const newYear = new Date(currentYear + 1, 0, 1)
  return Math.floor((newYear.getTime() - now.getTime()) / 1000)
}

// Exportiere die formatTime Funktion
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}
