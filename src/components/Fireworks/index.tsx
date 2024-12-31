import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './styles.module.css'

interface FireworksProps {
  onReset: () => void
}

interface Rocket {
  id: number
  startX: number
  startY: number
  targetX: number
  targetY: number
  color: string
}

interface Explosion {
  id: number
  x: number
  y: number
  sparks: Array<{
    id: number
    angle: number
    distance: number
    duration: number
    size: number
  }>
  color: string
}

const Fireworks = ({ onReset }: FireworksProps) => {
  const [rockets, setRockets] = useState<Rocket[]>([])
  const [explosions, setExplosions] = useState<Explosion[]>([])

  const createRocket = () => {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    
    return {
      id: Date.now(),
      startX: Math.random() * screenWidth,
      startY: screenHeight,
      targetX: Math.random() * screenWidth,
      targetY: screenHeight * 0.3,
      color: `hsl(${Math.random() * 360}, 100%, 70%)`
    }
  }

  const createExplosion = (rocket: Rocket) => {
    const sparkCount = 24
    const sparks = Array.from({ length: sparkCount }, (_, i) => {
      const baseAngle = (i * 360) / sparkCount
      const angle = baseAngle + (Math.random() - 0.5) * 10
      
      return {
        id: i,
        angle,
        distance: 100 + Math.random() * 50,
        duration: 2 + Math.random() * 0.5,
        size: 1 + Math.random() * 2
      }
    })

    return {
      id: Date.now(),
      x: rocket.targetX,
      y: rocket.targetY,
      sparks,
      color: rocket.color
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setRockets(prev => [...prev, createRocket()])
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.fireworks}>
      <AnimatePresence>
        {rockets.map(rocket => (
          <motion.div
            key={rocket.id}
            className={styles.rocket}
            style={{
              backgroundColor: rocket.color,
              boxShadow: `0 0 6px ${rocket.color}`,
              filter: 'blur(0.5px)',
              width: '4px',
              height: '4px',
              borderRadius: '50%'
            }}
            initial={{ x: rocket.startX, y: rocket.startY }}
            animate={{ x: rocket.targetX, y: rocket.targetY }}
            transition={{ duration: 1, ease: "easeOut" }}
            onAnimationComplete={() => {
              setRockets(prev => prev.filter(r => r.id !== rocket.id))
              setExplosions(prev => [...prev, createExplosion(rocket)])
            }}
          />
        ))}

        {explosions.map(explosion => (
          <React.Fragment key={explosion.id}>
            {explosion.sparks.map(spark => (
              <motion.div
                key={`${explosion.id}-${spark.id}`}
                className={styles.spark}
                style={{
                  width: `${spark.size * 3}px`,
                  height: `${spark.size}px`,
                  backgroundColor: explosion.color,
                  boxShadow: `0 0 ${spark.size * 2}px ${explosion.color}`,
                  filter: 'blur(0.5px)',
                  borderRadius: `${spark.size}px`,
                  transformOrigin: 'left center'
                }}
                initial={{ 
                  x: explosion.x,
                  y: explosion.y,
                  opacity: 1,
                  scale: 1,
                  rotate: spark.angle
                }}
                animate={{
                  x: explosion.x + Math.cos(spark.angle * Math.PI / 180) * spark.distance,
                  y: explosion.y + Math.sin(spark.angle * Math.PI / 180) * spark.distance,
                  opacity: 0,
                  scale: 0.1,
                  rotate: spark.angle
                }}
                transition={{ 
                  duration: spark.duration,
                  ease: "easeOut",
                  opacity: {
                    duration: spark.duration * 0.8,
                    ease: "easeIn"
                  }
                }}
                onAnimationComplete={() => {
                  if (spark.id === explosion.sparks.length - 1) {
                    setExplosions(prev => prev.filter(e => e.id !== explosion.id))
                  }
                }}
              />
            ))}
          </React.Fragment>
        ))}
      </AnimatePresence>
      {import.meta.env.VITE_DEV_MODE === 'true' && (
        <button onClick={onReset} className={styles.resetButton}>
          Neustart
        </button>
      )}
    </div>
  )
}

export default Fireworks
