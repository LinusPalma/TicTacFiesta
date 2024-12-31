import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Firework = () => {
  const [rockets, setRockets] = useState([]);
  const [explosions, setExplosions] = useState([]);
  const [secondaryExplosions, setSecondaryExplosions] = useState([]);

  // Diese Funktion hilft uns, natürlichere Zufallswerte zu erzeugen
  const randomGaussian = () => {
    return ((Math.random() + Math.random() + Math.random() + Math.random()) - 2) / 2;
  };

  const createRocket = () => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
    
    // Wähle einen zufälligen Explosionstyp für jede Rakete
    const explosionType = Math.random() < 0.33 ? 'radial' : 
                         Math.random() < 0.5 ? 'trail' : 'cascading';
    
    return {
      id: Date.now(),
      x: Math.random() * screenWidth,
      startY: screenHeight,
      targetY: screenHeight * 0.2,
      explosionType,
      color: `hsl(${Math.random() * 360}, 100%, 70%)`
    };
  };

  // Erzeugt die initiale Explosion wenn die Rakete ihr Ziel erreicht
  const createExplosion = (rocket) => {
    // Unterschiedliche Konfigurationen je nach Explosionstyp
    const config = {
      radial: {
        sparkCount: 16,
        sparkSize: [1.5, 3],
        distance: [80, 120],
        duration: [1.2, 1.8],
        explosionChance: 0.4
      },
      trail: {
        sparkCount: 10,
        sparkSize: [1, 2.5],
        distance: [60, 100],
        duration: [1, 1.5],
        explosionChance: 0.3
      },
      cascading: {
        sparkCount: 12,
        sparkSize: [2, 4],
        distance: [100, 150],
        duration: [1.5, 2],
        explosionChance: 0.7
      }
    }[rocket.explosionType];

    const sparks = [];
    
    for (let i = 0; i < config.sparkCount; i++) {
      const angle = (i * 360) / config.sparkCount + (randomGaussian() * 15);
      const distance = config.distance[0] + Math.random() * (config.distance[1] - config.distance[0]);
      
      sparks.push({
        id: i,
        angle,
        distance,
        duration: config.duration[0] + Math.random() * (config.duration[1] - config.duration[0]),
        size: config.sparkSize[0] + Math.random() * (config.sparkSize[1] - config.sparkSize[0]),
        willExplode: Math.random() < config.explosionChance, // Explosionswahrscheinlichkeit je nach Typ
        explosionDelay: 0.5 + Math.random() * 0.8 // Zeitpunkt der Sekundärexplosion
      });
    }

    return {
      id: Date.now(),
      x: rocket.x,
      y: rocket.targetY,
      sparks,
      color: rocket.color
    };
  };

  // Erzeugt eine kleinere Sekundärexplosion für einzelne Funken
  const createSecondaryExplosion = (x, y, color) => {
    const sparkCount = 8; // Weniger Funken für Sekundärexplosionen
    const sparks = [];
    
    for (let i = 0; i < sparkCount; i++) {
      const angle = (i * 360) / sparkCount + (randomGaussian() * 20);
      
      sparks.push({
        id: i,
        angle,
        distance: 30 + Math.random() * 20, // Kleinere Explosionen
        duration: 0.8 + Math.random() * 0.4,
        size: 1 + Math.random()
      });
    }

    return {
      id: Date.now() + Math.random(),
      x,
      y,
      sparks,
      color: color
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRockets(prev => [...prev, createRocket()]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <AnimatePresence>
        {/* Raketen */}
        {rockets.map(rocket => (
          <motion.div
            key={rocket.id}
            className="absolute"
            style={{
              width: '4px',
              height: '4px',
              backgroundColor: rocket.color,
              boxShadow: `0 0 8px ${rocket.color}`,
              filter: 'blur(0.5px)',
              borderRadius: '50%',
              left: rocket.x
            }}
            initial={{ y: rocket.startY }}
            animate={{ y: rocket.targetY }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            onAnimationComplete={() => {
              setRockets(prev => prev.filter(r => r.id !== rocket.id));
              const explosion = createExplosion(rocket);
              if (explosion) {
                setExplosions(prev => [...prev, explosion]);
              }
            }}
          />
        ))}

        {/* Primäre Explosionen */}
        {explosions.map(explosion => (
          <React.Fragment key={explosion.id}>
            {explosion.sparks.map(spark => (
              <motion.div
                key={`${explosion.id}-${spark.id}`}
                className="absolute origin-center"
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
                  ease: "easeOut"
                }}
                onAnimationStart={() => {
                  if (spark.willExplode) {
                    // Plane die Sekundärexplosion
                    setTimeout(() => {
                      const currentX = explosion.x + Math.cos(spark.angle * Math.PI / 180) * (spark.distance * 0.7);
                      const currentY = explosion.y + Math.sin(spark.angle * Math.PI / 180) * (spark.distance * 0.7);
                      const secondaryExplosion = createSecondaryExplosion(currentX, currentY, explosion.color);
                      setSecondaryExplosions(prev => [...prev, secondaryExplosion]);
                    }, spark.explosionDelay * 1000);
                  }
                }}
              />
            ))}
          </React.Fragment>
        ))}

        {/* Sekundäre Explosionen */}
        {secondaryExplosions.map(explosion => (
          <React.Fragment key={explosion.id}>
            {explosion.sparks.map(spark => (
              <motion.div
                key={`${explosion.id}-${spark.id}`}
                className="absolute origin-center"
                style={{
                  width: `${spark.size * 2}px`,
                  height: `${spark.size}px`,
                  backgroundColor: explosion.color,
                  boxShadow: `0 0 ${spark.size * 2}px ${explosion.color}`,
                  filter: 'blur(0.3px)',
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
                  ease: "easeOut"
                }}
                onAnimationComplete={() => {
                  if (spark.id === explosion.sparks.length - 1) {
                    setSecondaryExplosions(prev => 
                      prev.filter(e => e.id !== explosion.id)
                    );
                  }
                }}
              />
            ))}
          </React.Fragment>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Firework;