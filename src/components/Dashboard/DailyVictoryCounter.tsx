import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DailyVictoryCounterProps {
  count: number;
  goal?: number;
}

const RING_DOTS = 20;
const DOT_SIZE = 5;
const RING_RADIUS = 36;

export default function DailyVictoryCounter({ count, goal = 5 }: DailyVictoryCounterProps) {
  const [displayCount, setDisplayCount] = useState(count);
  const [pulse, setPulse] = useState(false);
  const prevCount = useRef(count);
  const goalReached = count >= goal;
  const progress = Math.min(count / goal, 1);
  const filledDots = Math.round(progress * RING_DOTS);

  // Animate count change
  useEffect(() => {
    if (count > prevCount.current) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 600);
      setDisplayCount(count);
      prevCount.current = count;
      return () => clearTimeout(timer);
    }
    setDisplayCount(count);
    prevCount.current = count;
  }, [count]);

  return (
    <motion.div
      className={`bg-card rounded-2xl shadow-sm p-4 flex items-center gap-4 transition-colors duration-500 ${
        goalReached ? 'ring-2 ring-amber-400/50 bg-amber-50/30' : ''
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Ring with counter */}
      <div className="relative flex-shrink-0" style={{ width: RING_RADIUS * 2 + DOT_SIZE * 2, height: RING_RADIUS * 2 + DOT_SIZE * 2 }}>
        {/* Dot ring */}
        <svg
          width={RING_RADIUS * 2 + DOT_SIZE * 2}
          height={RING_RADIUS * 2 + DOT_SIZE * 2}
          className="absolute inset-0"
        >
          {Array.from({ length: RING_DOTS }).map((_, i) => {
            const angle = (360 / RING_DOTS) * i - 90; // Start from top
            const rad = (angle * Math.PI) / 180;
            const cx = RING_RADIUS + DOT_SIZE + Math.cos(rad) * RING_RADIUS;
            const cy = RING_RADIUS + DOT_SIZE + Math.sin(rad) * RING_RADIUS;
            const filled = i < filledDots;

            return (
              <motion.circle
                key={i}
                cx={cx}
                cy={cy}
                r={DOT_SIZE / 2}
                fill={filled ? (goalReached ? '#f59e0b' : '#03b28c') : '#e5e7eb'}
                initial={false}
                animate={{
                  fill: filled ? (goalReached ? '#f59e0b' : '#03b28c') : '#e5e7eb',
                  scale: filled ? 1 : 0.7,
                }}
                transition={{ duration: 0.3, delay: filled ? i * 0.02 : 0 }}
              />
            );
          })}
        </svg>

        {/* Center number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={displayCount}
              className={`text-2xl font-black ${goalReached ? 'text-amber-500' : 'text-sage'}`}
              initial={pulse ? { scale: 1.8, opacity: 0 } : { scale: 1, opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 15,
              }}
            >
              {displayCount}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Goal reached glow */}
        {goalReached && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.4), 0 0 40px rgba(245, 158, 11, 0.15)',
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-text">ניצחונות היום</p>
        <div className="flex items-center gap-2 mt-0.5">
          <div className="flex-1 h-1.5 bg-cream-dark rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${goalReached ? 'bg-amber-400' : 'bg-sage'}`}
              initial={false}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <span className="text-[11px] text-text-light font-medium whitespace-nowrap">
            {count}/{goal}
          </span>
        </div>
        {goalReached && (
          <motion.p
            className="text-[11px] font-semibold text-amber-500 mt-0.5"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            יעד יומי הושג! 🌟
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
