import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'idle';

const phaseDurations: Record<BreathPhase, number> = {
  inhale: 4000,
  hold: 7000,
  exhale: 8000,
  idle: 0,
};

const phaseLabels: Record<BreathPhase, string> = {
  inhale: 'שאף...',
  hold: 'החזק...',
  exhale: 'נשוף...',
  idle: 'לחץ להתחיל',
};

export default function BreathingExercise() {
  const [phase, setPhase] = useState<BreathPhase>('idle');
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);

  const nextPhase = useCallback((current: BreathPhase): BreathPhase => {
    switch (current) {
      case 'inhale': return 'hold';
      case 'hold': return 'exhale';
      case 'exhale': return 'inhale';
      default: return 'inhale';
    }
  }, []);

  useEffect(() => {
    if (!isActive || phase === 'idle') return;

    const timer = setTimeout(() => {
      const next = nextPhase(phase);
      if (phase === 'exhale') setCycles((c) => c + 1);
      setPhase(next);
    }, phaseDurations[phase]);

    return () => clearTimeout(timer);
  }, [phase, isActive, nextPhase]);

  const start = () => {
    setIsActive(true);
    setPhase('inhale');
    setCycles(0);
  };

  const stop = () => {
    setIsActive(false);
    setPhase('idle');
  };

  const circleScale = phase === 'inhale' ? 1.5 : phase === 'hold' ? 1.5 : 1;

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs text-text-light mb-4">תרגיל נשימה 4-7-8</p>

      <button
        onClick={isActive ? stop : start}
        className="relative flex items-center justify-center w-44 h-44 mb-4"
      >
        {/* Outer glow */}
        <motion.div
          className="absolute rounded-full bg-sage/10"
          animate={{
            scale: circleScale * 1.1,
            opacity: isActive ? 0.3 : 0,
          }}
          transition={{ duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 8 : 0.3 }}
          style={{ width: 160, height: 160 }}
        />

        {/* Main circle */}
        <motion.div
          className="absolute rounded-full bg-sage/20 border-2 border-sage/40 flex items-center justify-center"
          animate={{ scale: circleScale }}
          transition={{
            duration:
              phase === 'inhale' ? 4 : phase === 'exhale' ? 8 : 0.3,
            ease: 'easeInOut',
          }}
          style={{ width: 130, height: 130 }}
        >
          <span className="text-sage text-sm font-medium">{phaseLabels[phase]}</span>
        </motion.div>
      </button>

      {isActive && (
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {['inhale', 'hold', 'exhale'].map((p) => (
              <div
                key={p}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  phase === p ? 'bg-sage' : 'bg-cream-dark'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-text-light">
            מחזור {cycles + 1}
          </span>
        </div>
      )}

      <p className="text-[10px] text-text-light mt-3 text-center max-w-[200px]">
        {isActive
          ? 'התמקד רק בנשימה. הדחף יעבור.'
          : 'לחץ על העיגול להתחלה'}
      </p>
    </div>
  );
}
