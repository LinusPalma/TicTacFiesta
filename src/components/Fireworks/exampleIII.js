import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Firework = () => {
  const [rockets, setRockets] = useState([]);
  const [sparks, setSparks] = useState([]);

  // Hilfsfunktion für zufällige Werte mit Gaußscher Verteilung
  const randomGaussian = () => {
    return ((Math.random() + Math.random() + Math.random() + Math.random()) - 2) / 2;
  };

  const createRocket = () => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
    
    // Wähle eine Basis-Farbe für die Rakete
    const baseHue = Math.random() * 360;
    // Erzeuge eine komplementäre Farbe für einige Funken
    const complementaryHue = (baseHue + 180) % 360;
    
    return {
      id: Date.now(),
      x: Math.random() * screenWidth,
      startY: screenHeight,
      targetY: -50,
      // Speichere beide Farben für verschiedene Funkentypen
      baseColor: `hsl(${baseHue}, 100%, 70%)`,
      accentColor: `hsl(${complementaryHue}, 100%, 70%)`,
      // Zufällige Geschwindigkeit für jede Rakete
      speed: 1.2 + Math.random() * 0.6
    };
  };

  const createSpark = (rocket, currentY) => {
    // Wähle zufällig zwischen verschiedenen Funkentypen
    const sparkType = Math.random();
    let sparkProps;

    if (sparkType < 0.6) {
      // Standard-Funken (60% Wahrscheinlichkeit)
      sparkProps = {
        size: 1 + Math.random() * 2,
        duration: 0.3 + Math.random() * 0.4,
        offsetX: randomGaussian() * 15,
        offsetY: randomGaussian() * 10,
        color: rocket.baseColor,
        type: 'normal'
      };
    } else if (sparkType < 0.8) {
      // Große, langsame Funken (20% Wahrscheinlichkeit)
      sparkProps = {
        size: 2 + Math.random() * 3,
        duration: 0.6 + Math.random() * 0.5,
        offsetX: randomGaussian() * 25,
        offsetY: randomGaussian() * 15,
        color: rocket.accentColor,
        type: 'large'
      };
    } else {
      // Kleine, schnelle Funken (20% Wahrscheinlichkeit)
      sparkProps = {
        size: 0.5 + Math.random() * 1,
        duration: 0.2 + Math.random() * 0.3,
        offsetX: randomGaussian() * 30,
        offsetY: randomGaussian() * 20,
        color: rocket.baseColor,
        type: 'small'
      };
    }

    return {
      id: Date.now() + Math.random(),
      x: rocket.x,
      y: currentY,
      ...sparkProps
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRockets(prev => [...prev, createRocket()]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (rockets.length === 0) return;

    const sparkInterval = setInterval(() => {
      rockets.forEach(rocket => {
        const progress = (Date.now() - rocket.id) / (rocket.speed * 1000);
        const currentY = rocket.startY + (rocket.targetY - rocket.startY) * progress;

        if (currentY > rocket.targetY) {
          // Erzeuge mehrere Funken pro Intervall für eine dichtere Spur
          const sparkCount = 1 + Math.floor(Math.random() * 3);
          const newSparks = Array(sparkCount).fill(0).map(() => 
            createSpark(rocket, currentY)
          );
          setSparks(prev => [...prev, ...newSparks]);
        }
      });
    }, 30); // Häufigere Funken-Erzeugung

    return () => clearInterval(sparkInterval);
  }, [rockets]);

  useEffect(() => {
    const cleanup = setInterval(() => {
      setSparks(prev => prev.filter(spark => 
        Date.now() - spark.id < spark.duration * 1000
      ));
    }, 100);

    return () => clearInterval(cleanup);
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
              backgroundColor: rocket.baseColor,
              boxShadow: `0 0 8px ${rocket.baseColor}`,
              filter: 'blur(0.5px)',
              borderRadius: '50%',
              left: rocket.x
            }}
            initial={{ y: rocket.startY }}
            animate={{ y: rocket.targetY }}
            transition={{ 
              duration: rocket.speed,
              ease: "linear"
            }}
            onAnimationComplete={() => {
              setRockets(prev => prev.filter(r => r.id !== rocket.id));
            }}
          />
        ))}

        {/* Funken mit verschiedenen Stilen */}
        {sparks.map(spark => {
          // Unterschiedliche Stile je nach Funkentyp
          const sparkStyle = {
            normal: {
              width: `${spark.size * 2}px`,
              height: `${spark.size}px`,
              blur: '0.5px',
              shadowSize: spark.size * 2
            },
            large: {
              width: `${spark.size * 3}px`,
              height: `${spark.size * 1.5}px`,
              blur: '1px',
              shadowSize: spark.size * 3
            },
            small: {
              width: `${spark.size}px`,
              height: `${spark.size}px`,
              blur: '0.3px',
              shadowSize: spark.size
            }
          }[spark.type];

          return (
            <motion.div
              key={spark.id}
              className="absolute"
              style={{
                width: sparkStyle.width,
                height: sparkStyle.height,
                backgroundColor: spark.color,
                boxShadow: `0 0 ${sparkStyle.shadowSize}px ${spark.color}`,
                filter: `blur(${sparkStyle.blur})`,
                borderRadius: `${spark.size}px`,
                left: spark.x,
                top: spark.y
              }}
              initial={{ 
                x: 0,
                y: 0,
                opacity: 0.8,
                scale: 1
              }}
              animate={{
                x: spark.offsetX,
                y: spark.offsetY,
                opacity: 0,
                scale: 0.1
              }}
              transition={{ 
                duration: spark.duration,
                ease: "linear"
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Firework;