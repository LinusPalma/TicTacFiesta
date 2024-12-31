import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './cascadeStyles.module.css'

interface CascadeFireworkProps {
  x: number
  y: number
  color: string
  onComplete: () => void
}

const CascadeFirework = ({ x, y, color, onComplete }: CascadeFireworkProps) => {
  const [isExploding, setIsExploding] = useState(false)
  const [secondaryExplosions, setSecondaryExplosions] = useState<Array<{
    id: number,
    x: number,
    y: number,
    angle: number
  }>>([])
  const targetY = window.innerHeight * 0.3 // Explosionshöhe

  const primarySparkCount = 12
  
  return (
    <AnimatePresence>
      {/* Rakete */}
      {!isExploding && (
        <motion.div
          className={styles.rocket}
          style={{
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}`,
            left: x
          }}
          initial={{ y }}
          animate={{ y: targetY }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          onAnimationComplete={() => setIsExploding(true)}
        />
      )}

      {/* Primäre Explosion */}
      {isExploding && Array(primarySparkCount).fill(0).map((_, i) => {
        const angle = (i * 360) / primarySparkCount + (Math.random() - 0.5) * 10
        const distance = 150 + Math.random() * 100
        const willCascade = Math.random() < 0.4
        const duration = 1.5

        return (
          <motion.div
            key={`primary-${x}-${y}-${i}`}
            className={styles.spark}
            style={{
              backgroundColor: color,
              left: x,
              top: targetY // Hier auf targetY statt y setzen
            }}
            initial={{ scale: 1, opacity: 1 }}
            animate={{
              x: Math.cos(angle * Math.PI / 180) * distance,
              y: Math.sin(angle * Math.PI / 180) * distance,
              opacity: 0,
              scale: 0.1
            }}
            transition={{ duration, ease: "easeOut" }}
            onAnimationStart={() => {
              if (willCascade) {
                setTimeout(() => {
                  const newX = x + Math.cos(angle * Math.PI / 180) * distance * 0.7
                  const newY = targetY + Math.sin(angle * Math.PI / 180) * distance * 0.7 // Hier targetY statt y
                  setSecondaryExplosions(prev => [...prev, {
                    id: Date.now() + Math.random(),
                    x: newX,
                    y: newY,
                    angle
                  }])
                }, duration * 700) // 70% durch die Animation
              }
            }}
            onAnimationComplete={i === 0 ? onComplete : undefined}
          />
        )
      })}

      {/* Sekundäre Explosionen */}
      {secondaryExplosions.map(explosion => (
        <AnimatePresence key={explosion.id}>
          {Array(8).fill(0).map((_, i) => {
            const angle = (i * 360) / 8
            const distance = 30 + Math.random() * 20

            return (
              <motion.div
                key={`secondary-${explosion.id}-${i}`}
                className={styles.spark}
                style={{
                  backgroundColor: color,
                  left: explosion.x,
                  top: explosion.y,
                  scale: 0.7 // Kleinere sekundäre Funken
                }}
                initial={{ scale: 1, opacity: 1 }}
                animate={{
                  x: Math.cos(angle * Math.PI / 180) * distance,
                  y: Math.sin(angle * Math.PI / 180) * distance,
                  opacity: 0,
                  scale: 0.1
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            )
          })}
        </AnimatePresence>
      ))}
    </AnimatePresence>
  )
}

export default CascadeFirework
