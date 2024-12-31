import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './trailStyles.module.css'

interface TrailFireworkProps {
  startX: number
  startY: number
  targetY: number
  color: string
  onComplete: () => void
}

interface Spark {
  id: number
  x: number
  y: number
  size: number
  offsetX: number
  offsetY: number
}

const TrailFirework = ({ startX, startY, targetY, color, onComplete }: TrailFireworkProps) => {
  const [sparks, setSparks] = useState<Spark[]>([])
  const [rocketPosition, setRocketPosition] = useState(startY)

  // Hilfsfunktion für Gauß-verteilte Zufallswerte
  const randomGaussian = () => {
    return ((Math.random() + Math.random() + Math.random() + Math.random()) - 2) / 2
  }

  useEffect(() => {
    const rocketDuration = 2000 // 2 Sekunden Flugzeit
    const startTime = Date.now()
    let sparkCounter = 0 // Counter für eindeutige IDs

    // Raketen-Animation
    const rocketInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / rocketDuration, 1)
      const currentY = startY + (targetY - startY) * progress
      
      setRocketPosition(currentY)

      // Funken erzeugen
      if (progress < 1) {
        const newSparks = Array(1 + Math.floor(Math.random() * 2))
          .fill(0)
          .map(() => ({
            // Kombiniere mehrere Werte für eine eindeutige ID
            id: Date.now() + sparkCounter++ + Math.random(),
            x: startX,
            y: currentY,
            size: 0.5 + Math.random() * 1.5,
            offsetX: randomGaussian() * 20,
            offsetY: randomGaussian() * 20
          }))
        setSparks(prev => [...prev, ...newSparks])
      } else {
        clearInterval(rocketInterval)
        onComplete()
      }
    }, 20)

    // Aufräumen
    const cleanupInterval = setInterval(() => {
      setSparks(prev => prev.filter(spark => 
        Date.now() - spark.id < 500 // Funken leben 500ms
      ))
    }, 100)

    return () => {
      clearInterval(rocketInterval)
      clearInterval(cleanupInterval)
    }
  }, [startX, startY, targetY, onComplete])

  return (
    <AnimatePresence>
      {/* Rakete */}
      <motion.div
        className={styles.rocket}
        style={{
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}`,
          left: startX,
          top: rocketPosition
        }}
      />

      {/* Funken */}
      {sparks.map(spark => (
        <motion.div
          key={spark.id}
          className={styles.spark}
          style={{
            backgroundColor: color,
            boxShadow: `0 0 ${spark.size * 2}px ${color}`,
            width: `${spark.size}px`,
            height: `${spark.size}px`,
            left: spark.x,
            top: spark.y
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            x: spark.offsetX,
            y: spark.offsetY,
            opacity: 0,
            scale: 0.1
          }}
          transition={{ duration: 0.5, ease: "linear" }}
        />
      ))}
    </AnimatePresence>
  )
}

export default TrailFirework
