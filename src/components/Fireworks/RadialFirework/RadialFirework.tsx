import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './radialStyles.module.css'

interface RadialFireworkProps {
  x: number
  y: number
  color: string
  onComplete: () => void
}

const RadialFirework = ({ x, y, color, onComplete }: RadialFireworkProps) => {
  const [isExploding, setIsExploding] = useState(false)
  const sparkCount = 16
  const targetY = window.innerHeight * 0.3 // Explosionshöhe
  
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

      {/* Explosion */}
      {isExploding && (
        <>
          {Array(sparkCount).fill(0).map((_, i) => {
            const angle = (i * 360) / sparkCount
            const distance = 150 + Math.random() * 100
            
            return (
              <motion.div
                key={`spark-${i}`}
                className={styles.spark}
                style={{
                  backgroundColor: color,
                  left: x,
                  top: targetY
                }}
                initial={{ scale: 1, opacity: 1 }}
                animate={{
                  x: Math.cos(angle * Math.PI / 180) * distance,
                  y: Math.sin(angle * Math.PI / 180) * distance,
                  opacity: 0,
                  scale: 0.1
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                onAnimationComplete={i === 0 ? onComplete : undefined}
              />
            )
          })}
        </>
      )}
    </AnimatePresence>
  )
}

export default RadialFirework
