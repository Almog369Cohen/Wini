import { motion } from 'framer-motion';

interface MiniRingProps {
  value: number; // 0-1
  label: string;
  detail: string;
  color: string;
  emoji: string;
  onClick?: () => void;
}

export default function MiniRing({ value, label, detail, color, emoji, onClick }: MiniRingProps) {
  const size = 52;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - Math.min(value, 1) * circumference;

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 flex-1 py-2"
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="var(--color-cream-dark)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm">{emoji}</span>
        </div>
      </div>
      <span className="text-[10px] font-medium text-text">{label}</span>
      <span className="text-[9px] text-text-light mt-[-4px]">{detail}</span>
    </button>
  );
}
