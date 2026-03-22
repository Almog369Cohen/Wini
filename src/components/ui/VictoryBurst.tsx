import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Sound System (Web Audio API) ───────────────────────────────────

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playNote(freq: number, startTime: number, duration: number, gain: number = 0.15) {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const envelope = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);

  envelope.gain.setValueAtTime(0, startTime);
  envelope.gain.linearRampToValueAtTime(gain, startTime + 0.01);
  envelope.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(envelope);
  envelope.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

function playChord(freqs: number[], startTime: number, duration: number, gain: number = 0.1) {
  freqs.forEach(f => playNote(f, startTime, duration, gain));
}

export function playVictorySound(tier: 1 | 2 | 3) {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;

    switch (tier) {
      case 1:
        // Quick ascending beep: C5 → E5
        playNote(523.25, now, 0.08, 0.12);
        playNote(659.25, now + 0.06, 0.12, 0.15);
        break;

      case 2:
        // Ascending arpeggio: C5 → E5 → G5
        playNote(523.25, now, 0.12, 0.12);
        playNote(659.25, now + 0.1, 0.12, 0.14);
        playNote(783.99, now + 0.2, 0.18, 0.16);
        // Gentle shimmer
        playNote(1046.5, now + 0.3, 0.25, 0.06);
        break;

      case 3:
        // Full triumphant chord → higher octave
        playChord([523.25, 659.25, 783.99], now, 0.2, 0.1);
        playChord([659.25, 783.99, 1046.5], now + 0.18, 0.25, 0.12);
        playChord([783.99, 1046.5, 1318.5], now + 0.35, 0.35, 0.1);
        // Sparkle top
        playNote(1567.98, now + 0.5, 0.3, 0.06);
        playNote(2093.0, now + 0.6, 0.4, 0.04);
        break;
    }
  } catch {
    // Web Audio not available, silently ignore
  }
}

// ─── Haptic System ──────────────────────────────────────────────────

function vibrate(pattern: number | number[]) {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Not supported
  }
}

// ─── Particle Generators ────────────────────────────────────────────

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  rotation: number;
  size: number;
  color: string;
  shape: 'rect' | 'circle';
}

interface Ring {
  id: number;
  delay: number;
  scale: number;
  color: string;
}

const BRAND = '#03b28c';
const GOLD = '#f59e0b';
const COLORS = [BRAND, '#059cc0', '#2cc9a5', '#e05c4d', '#8b5cf6', '#ec4899', GOLD];

function makeSparkles(count: number): Sparkle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 80,
    y: 50 + (Math.random() - 0.5) * 80,
    size: 3 + Math.random() * 5,
    delay: Math.random() * 0.6,
    duration: 0.6 + Math.random() * 0.8,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
}

function makeConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.4,
    rotation: Math.random() * 720 - 360,
    size: 4 + Math.random() * 6,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: Math.random() > 0.4 ? 'rect' : 'circle',
  }));
}

function makeRings(count: number): Ring[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: i * 0.15,
    scale: 1 + i * 0.6,
    color: i === 0 ? BRAND : i === 1 ? GOLD : '#059cc0',
  }));
}

// ─── Sub-components ─────────────────────────────────────────────────

function PulseRings({ rings }: { rings: Ring[] }) {
  return (
    <>
      {rings.map(ring => (
        <motion.div
          key={ring.id}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 1.2, delay: ring.delay, ease: 'easeOut' }}
        >
          <motion.div
            className="rounded-full border-2"
            style={{ borderColor: ring.color }}
            initial={{ width: 40, height: 40, opacity: 0.8 }}
            animate={{ width: 300 * ring.scale, height: 300 * ring.scale, opacity: 0 }}
            transition={{ duration: 1.4, delay: ring.delay, ease: 'easeOut' }}
          />
        </motion.div>
      ))}
    </>
  );
}

function RadialBurst({ count = 16, color = GOLD }: { count?: number; color?: string }) {
  const lines = Array.from({ length: count }, (_, i) => i);
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {lines.map(i => {
        const angle = (360 / count) * i;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: 3,
              height: 24,
              backgroundColor: color,
              borderRadius: 2,
              transformOrigin: 'center bottom',
              rotate: `${angle}deg`,
            }}
            initial={{ scaleY: 0, opacity: 0, y: 0 }}
            animate={{
              scaleY: [0, 1, 0.3],
              opacity: [0, 1, 0],
              y: [0, -80, -120],
            }}
            transition={{
              duration: 0.8,
              delay: 0.1 + (i % 3) * 0.05,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );
}

function SparkleField({ sparkles }: { sparkles: Sparkle[] }) {
  return (
    <>
      {sparkles.map(s => (
        <motion.div
          key={s.id}
          className="absolute pointer-events-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
            borderRadius: '50%',
            boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  );
}

function ConfettiRain({ pieces }: { pieces: ConfettiPiece[] }) {
  return (
    <>
      {pieces.map(p => (
        <motion.div
          key={p.id}
          className="absolute pointer-events-none"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.shape === 'rect' ? p.size * 1.5 : p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : 2,
          }}
          initial={{ y: -10, opacity: 1, rotate: 0 }}
          animate={{
            y: '105vh',
            opacity: [1, 1, 0.6],
            rotate: p.rotation,
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: p.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      ))}
    </>
  );
}

function ScreenFlash() {
  return (
    <motion.div
      className="absolute inset-0 bg-card pointer-events-none"
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    />
  );
}

// ─── Counter Animation ──────────────────────────────────────────────

function FlyingCounter({ text }: { text: string }) {
  return (
    <motion.div
      className="absolute top-1/3 left-1/2 font-black text-4xl pointer-events-none"
      style={{ color: BRAND, textShadow: `0 2px 12px ${BRAND}66` }}
      initial={{ x: '-50%', y: 0, scale: 0.5, opacity: 0 }}
      animate={{
        y: -80,
        scale: [0.5, 1.4, 1.1],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 1.2,
        times: [0, 0.3, 0.7, 1],
        ease: 'easeOut',
      }}
    >
      {text}
    </motion.div>
  );
}

// ─── Badge Drop ─────────────────────────────────────────────────────

function BadgeDrop({ emoji, label }: { emoji: string; label: string }) {
  return (
    <motion.div
      className="absolute top-[15%] left-1/2 flex flex-col items-center pointer-events-none"
      initial={{ x: '-50%', y: -100, scale: 0.3, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 12,
        delay: 0.3,
      }}
    >
      <motion.div
        className="w-20 h-20 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-lg"
        animate={{ rotate: [0, -5, 5, -3, 0] }}
        transition={{ duration: 0.6, delay: 0.8, ease: 'easeInOut' }}
      >
        {emoji}
      </motion.div>
      <motion.span
        className="mt-2 text-sm font-bold text-amber-500"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────

export interface VictoryBurstProps {
  tier: 1 | 2 | 3;
  message: string;
  subMessage?: string;
  emoji?: string;
  mantra?: string;
  onComplete: () => void;
}

export default function VictoryBurst({ tier, message, subMessage, emoji, mantra, onComplete }: VictoryBurstProps) {
  const sparkles = makeSparkles(tier === 3 ? 30 : tier === 2 ? 18 : 8);
  const confetti = tier >= 2 ? makeConfetti(tier === 3 ? 50 : 35) : [];
  const rings = makeRings(tier === 3 ? 4 : tier === 2 ? 2 : 1);

  const handleAnimationStart = useCallback(() => {
    // Play sound
    playVictorySound(tier);

    // Haptic feedback
    switch (tier) {
      case 1:
        vibrate(50);
        break;
      case 2:
        vibrate([50, 50, 80]);
        break;
      case 3:
        vibrate([60, 40, 60, 40, 120]);
        break;
    }
  }, [tier]);

  useEffect(() => {
    handleAnimationStart();

    const timeout = setTimeout(() => {
      onComplete();
    }, tier === 3 ? 3000 : tier === 2 ? 2500 : 2000);

    return () => clearTimeout(timeout);
  }, [tier, onComplete, handleAnimationStart]);

  return (
    <motion.div
      key="victory-burst"
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Semi-transparent backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Tier 3: Screen Flash */}
      {tier === 3 && <ScreenFlash />}

      {/* Pulse Rings */}
      <PulseRings rings={rings} />

      {/* Tier 2+: Radial Burst */}
      {tier >= 2 && <RadialBurst count={tier === 3 ? 24 : 16} color={tier === 3 ? GOLD : BRAND} />}

      {/* Sparkle Field */}
      <SparkleField sparkles={sparkles} />

      {/* Tier 2+: Confetti Rain */}
      {confetti.length > 0 && <ConfettiRain pieces={confetti} />}

      {/* Tier 2+: Badge Drop */}
      {tier >= 2 && emoji && (
        <BadgeDrop
          emoji={emoji}
          label={tier === 3 ? 'אלוף!' : 'כל הכבוד!'}
        />
      )}

      {/* Center Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          delay: tier === 3 ? 0.2 : 0.1,
        }}
      >
        {/* Emoji */}
        {emoji && (
          <motion.div
            className="text-6xl mb-3"
            animate={{
              scale: tier === 3 ? [1, 1.3, 1.1] : [1, 1.2, 1],
              rotate: tier === 3 ? [0, -10, 10, 0] : [0, 5, -5, 0],
            }}
            transition={{
              duration: tier === 3 ? 0.8 : 0.5,
              delay: 0.2,
              ease: 'easeOut',
            }}
          >
            {emoji}
          </motion.div>
        )}

        {/* Message */}
        <motion.h2
          className="text-2xl font-black text-white drop-shadow-lg mb-1"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          {message}
        </motion.h2>

        {/* Sub-message */}
        {subMessage && (
          <motion.p
            className="text-base font-semibold text-white/90 drop-shadow"
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {subMessage}
          </motion.p>
        )}

        {/* Personal mantra */}
        {mantra && tier >= 2 && (
          <motion.p
            className="text-sm font-bold text-white/80 mt-2 drop-shadow italic"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            &ldquo;{mantra}&rdquo;
          </motion.p>
        )}

        {/* Tier 1: Flying +1 counter */}
        {tier === 1 && <FlyingCounter text="+1" />}
      </motion.div>
    </motion.div>
  );
}
