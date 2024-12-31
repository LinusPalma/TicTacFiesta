import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Firework = () => {
  const [rockets, setRockets] = useState([]);
  const [explosions, setExplosions] = useState([]);

  // Erstellt eine neue Rakete mit definierten Start- und Zielpositionen
  const createRocket = () => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
    
    return {
      id: Date.now(),
      startX: Math.random() * screenWidth,
      startY: screenHeight,
      targetX: Math.random() * screenWidth,
      targetY: screenHeight * 0.3,
      // Wir generieren eine helle, leuchtende Farbe für die Funken
      color: `hsl(${Math.random() * 360}, 100%, 70%)`
    };
  };

  // Erstellt eine Explosion mit Funken, die einen Trail hinterlassen
  const createExplosion = (rocket) => {
    const sparkCount = 24;
    const sparks = [];
    
    for (let i = 0; i < sparkCount; i++) {
      // Basiswinkel für gleichmäßige Verteilung
      const baseAngle = (i * 360) / sparkCount;
      // Füge kleine Zufallsvariation zum Winkel hinzu
      const angle = baseAngle + (Math.random() - 0.5) * 10;
      
      sparks.push({
        id: i,
        angle: angle,
        // Zufällige Distanz für natürlicheres Aussehen
        distance: 100 + Math.random() * 50,
        // Längere Duration für sichtbareren Trail
        duration: 2 + Math.random() * 0.5,
        // Zufällige Größe für Variation
        size: 1 + Math.random() * 2
      });
    }

    return {
      id: Date.now(),
      x: rocket.targetX,
      y: rocket.targetY,
      sparks,
      color: rocket.color
    };
  };

  // Starte regelmäßig neue Raketen
  useEffect(() => {
    const interval = setInterval(() => {
      setRockets(prev => [...prev, createRocket()]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <AnimatePresence>
        {/* Raketen mit Leuchteffekt */}
        {rockets.map(rocket => (
          <motion.div
            key={rocket.id}
            className="absolute"
            style={{
              width: '4px',
              height: '4px',
              backgroundColor: rocket.color,
              // Füge Leuchteffekt für die Rakete hinzu
              boxShadow: `0 0 6px ${rocket.color}`,
              filter: 'blur(0.5px)',
              borderRadius: '50%'
            }}
            initial={{ x: rocket.startX, y: rocket.startY }}
            animate={{ x: rocket.targetX, y: rocket.targetY }}
            transition={{ duration: 1, ease: "easeOut" }}
            onAnimationComplete={() => {
              setRockets(prev => prev.filter(r => r.id !== rocket.id));
              setExplosions(prev => [...prev, createExplosion(rocket)]);
            }}
          />
        ))}

        {/* Explosionen mit Trail-Effekt */}
        {explosions.map(explosion => (
          <React.Fragment key={explosion.id}>
            {explosion.sparks.map(spark => (
              <motion.div
                key={`${explosion.id}-${spark.id}`}
                className="absolute origin-center"
                style={{
                  // Erstelle ein längliches Partikel für den Trail-Effekt
                  width: `${spark.size * 3}px`,
                  height: `${spark.size}px`,
                  backgroundColor: explosion.color,
                  // Verstärke den Leuchteffekt
                  boxShadow: `0 0 ${spark.size * 2}px ${explosion.color}`,
                  // Füge Bewegungsunschärfe hinzu
                  filter: 'blur(0.5px)',
                  // Runde die Enden ab
                  borderRadius: `${spark.size}px`,
                  // Transformationsursprung am hinteren Ende
                  transformOrigin: 'left center'
                }}
                initial={{ 
                  x: explosion.x,
                  y: explosion.y,
                  opacity: 1,
                  scale: 1,
                  // Initialer Rotationswinkel
                  rotate: spark.angle
                }}
                animate={{
                  x: explosion.x + Math.cos(spark.angle * Math.PI / 180) * spark.distance,
                  y: explosion.y + Math.sin(spark.angle * Math.PI / 180) * spark.distance,
                  opacity: 0,
                  scale: 0.1,
                  // Behalte den Rotationswinkel bei
                  rotate: spark.angle
                }}
                transition={{ 
                  duration: spark.duration,
                  ease: "easeOut",
                  // Füge unterschiedliche Timing-Funktionen für verschiedene Eigenschaften hinzu
                  opacity: {
                    duration: spark.duration * 0.8,
                    ease: "easeIn"
                  }
                }}
                onAnimationComplete={() => {
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