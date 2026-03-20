import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const particles: Particle[] = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 4 + 4,
        delay: Math.random() * 2,
        opacity: Math.random() * 0.4 + 0.1,
      })),
    []
  );

  return (
    <AnimatePresence>
      <motion.div
        key="splash"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #03b28c 0%, #029a79 100%)',
        }}
      >
        {/* Floating particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${p.x}%`,
              bottom: -10,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -window.innerHeight - 20],
              opacity: [0, p.opacity, p.opacity, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}

        {/* Centered content wrapper - fades out at end */}
        <motion.div
          className="flex flex-col items-center"
          animate={{ opacity: [1, 1, 0] }}
          transition={{ duration: 2.2, times: [0, 0.8, 1], ease: 'easeInOut' }}
        >
          {/* Seedling emoji - spring bounce in */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 12,
              duration: 0.5,
            }}
            className="text-7xl mb-4"
          >
            🌱
          </motion.div>

          {/* "Wini" text - fade in + slide up */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
            className="text-5xl font-bold text-white mb-3 tracking-wide"
          >
            Wini
          </motion.h1>

          {/* Subtitle - fade in */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.3, ease: 'easeOut' }}
            className="text-white/80 text-base"
          >
            המסע שלך לחיים טובים יותר
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
