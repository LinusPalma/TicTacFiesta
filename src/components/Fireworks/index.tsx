import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import RadialFirework from './RadialFirework/RadialFirework'
import TrailFirework from './TrailFirework/TrailFirework'
import CascadeFirework from './CascadeFirework/CascadeFirework'
import styles from './styles.module.css'

const Fireworks = () => {
  const [fireworks, setFireworks] = useState<Array<{
    id: number
    type: 'radial' | 'trail' | 'cascade'
    x: number
    y: number
    color: string
  }>>([])

  useEffect(() => {
    // Begrenze die Anzahl der gleichzeitigen Feuerwerke
    const maxFireworks = 15

    // Initial mehrere Raketen erzeugen
    const createInitialFireworks = () => {
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      
      return Array(3).fill(0).map(() => ({
        id: Date.now() + Math.random(), // Eindeutige ID
        type: ['radial', 'trail', 'cascade'][Math.floor(Math.random() * 3)] as 'radial' | 'trail' | 'cascade',
        x: Math.random() * screenWidth,
        y: screenHeight,
        color: `hsl(${Math.random() * 360}, 100%, 70%)`
      }))
    }

    setFireworks(createInitialFireworks())

    const interval = setInterval(() => {
      setFireworks(prev => {
        // Wenn zu viele Feuerwerke aktiv sind, keine neuen hinzufügen
        if (prev.length >= maxFireworks) return prev;

        const screenWidth = window.innerWidth
        const screenHeight = window.innerHeight
        const types = ['radial', 'trail', 'cascade']
        const type = types[Math.floor(Math.random() * types.length)]
        
        return [...prev, {
          id: Date.now() + Math.random(), // Eindeutige ID
          type: type as 'radial' | 'trail' | 'cascade',
          x: Math.random() * screenWidth,
          y: screenHeight,
          color: `hsl(${Math.random() * 360}, 100%, 70%)`
        }]
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {fireworks.map(fw => {
          switch (fw.type) {
            case 'radial':
              return <RadialFirework 
                key={fw.id}
                x={fw.x}
                y={fw.y} // Explosion in 30% Bildschirmhöhe
                color={fw.color}
                onComplete={() => setFireworks(prev => 
                  prev.filter(f => f.id !== fw.id)
                )}
              />
            case 'trail':
              return <TrailFirework 
                key={fw.id}
                startX={fw.x}
                startY={fw.y}
                targetY={-50}
                color={fw.color}
                onComplete={() => setFireworks(prev => 
                  prev.filter(f => f.id !== fw.id)
                )}
              />
            case 'cascade':
              return <CascadeFirework 
                key={fw.id}
                x={fw.x}
                y={fw.y} // Explosion in 30% Bildschirmhöhe
                color={fw.color}
                onComplete={() => setFireworks(prev => 
                  prev.filter(f => f.id !== fw.id)
                )}
              />
          }
        })}
      </AnimatePresence>
    </div>
  )
}

export default Fireworks
