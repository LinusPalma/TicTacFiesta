import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Firework = () => {
  const [rockets, setRockets] = useState([]);
  const [explosions, setExplosions] = useState([]);

  // Diese Funktion erstellt eine neue Rakete mit festen Startkoordinaten
  const createRocket = () => {
    // Wir berechnen die Bildschirmbreite für die horizontale Position
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    
    return {
      id: Date.now(),
      // Horizontale Startposition ist zufällig über die Bildschirmbreite verteilt
      startX: Math.random() * screenWidth,
      // Vertikale Startposition ist am unteren Bildschirmrand
      startY: typeof window !== 'undefined' ? window.innerHeight : 1000,
      // Zielposition ist etwas über der Bildschirmmitte
      targetX: Math.random() * screenWidth,
      targetY: (typeof window !== 'undefined' ? window.innerHeight : 1000) * 0.3,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`
    };
  };

  // Diese Funktion erstellt die Funken für eine Explosion
  const createExplosion = (rocket) => {
    // Wir erstellen 24 Funken für jede Explosion
    const sparkCount = 24;
    const sparks = [];
    
    for (let i = 0; i < sparkCount; i++) {
      const angle = (i * 360) / sparkCount;
      sparks.push({
        id: i,
        angle: angle,
        // Zufällige Distanz zwischen 100 und 150 Pixeln
        distance: 100 + Math.random() * 50,
        // Zufällige Dauer zwischen 1.5 und 2 Sekunden
        duration: 1.5 + Math.random() * 0.5
      });
    }

    return {
      id: Date.now(),
      x: rocket.targetX,
      y: rocket.targetY,
      sparks: sparks,
      color: rocket.color
    };
  };

  // Dieser Effekt startet alle 2 Sekunden eine neue Rakete
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
            className="absolute w-2 h-2 rounded-full"
            style={{ backgroundColor: rocket.color }}
            initial={{ x: rocket.startX, y: rocket.startY }}
            animate={{ x: rocket.targetX, y: rocket.targetY }}
            transition={{ duration: 1, ease: "easeOut" }}
            onAnimationComplete={() => {
              // Rakete entfernen und Explosion starten
              setRockets(prev => prev.filter(r => r.id !== rocket.id));
              setExplosions(prev => [...prev, createExplosion(rocket)]);
            }}
          />
        ))}

        {/* Explosionen */}
        {explosions.map(explosion => (
          <React.Fragment key={explosion.id}>
            {explosion.sparks.map(spark => (
              <motion.div
                key={`${explosion.id}-${spark.id}`}
                className="absolute w-1 h-1 rounded-full"
                style={{ 
                  backgroundColor: explosion.color,
                  boxShadow: `0 0 4px ${explosion.color}`
                }}
                initial={{ 
                  x: explosion.x,
                  y: explosion.y,
                  opacity: 1
                }}
                animate={{
                  x: explosion.x + Math.cos(spark.angle * Math.PI / 180) * spark.distance,
                  y: explosion.y + Math.sin(spark.angle * Math.PI / 180) * spark.distance,
                  opacity: 0
                }}
                transition={{ 
                  duration: spark.duration,
                  ease: "easeOut"
                }}
                onAnimationComplete={() => {
                  // Explosion entfernen, wenn der letzte Funke erloschen ist
                  if (spark.id === explosion.sparks.length - 1) {
                    setExplosions(prev => 
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