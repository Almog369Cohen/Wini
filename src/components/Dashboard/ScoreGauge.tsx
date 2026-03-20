import { motion } from 'framer-motion';

interface ScoreGaugeProps {
  score: number; // 0-100
  label: string;
  size?: number;
}

export default function ScoreGauge({ score, label, size = 180 }: ScoreGaugeProps) {
  const radius = (size - 20) / 2;
  const circumference = Math.PI * radius; // semicircle
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 70) return '#03b28c';
    if (s >= 40) return '#059cc0';
    return '#e05c4d';
  };

  const getGlow = (s: number) => {
    if (s >= 70) return '0 0 20px rgba(3, 178, 140, 0.4)';
    if (s >= 40) return '0 0 20px rgba(5, 156, 192, 0.4)';
    return '0 0 20px rgba(224, 92, 77, 0.4)';
  };

  const getMessage = (s: number) => {
    if (s >= 90) return 'מדהים! 🔥';
    if (s >= 70) return 'כל הכבוד! 💪';
    if (s >= 50) return 'בכיוון הנכון 👍';
    if (s >= 30) return 'יום חדש, הזדמנות חדשה';
    return 'בוא נתחיל 🌱';
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
        <svg
          width={size}
          height={size / 2 + 10}
          viewBox={`0 0 ${size} ${size / 2 + 10}`}
          className="overflow-visible"
        >
          {/* Background arc */}
          <path
            d={`M 10 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2}`}
            fill="none"
            stroke="var(--color-cream-dark)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Score arc */}
          <motion.path
            d={`M 10 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2}`}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            style={{ filter: getGlow(score) }}
          />
          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = Math.PI - (tick / 100) * Math.PI;
            const x1 = size / 2 + (radius - 20) * Math.cos(angle);
            const y1 = size / 2 - (radius - 20) * Math.sin(angle);
            const x2 = size / 2 + (radius - 14) * Math.cos(angle);
            const y2 = size / 2 - (radius - 14) * Math.sin(angle);
            return (
              <line
                key={tick}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="var(--color-text-light)"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.3"
              />
            );
          })}
        </svg>

        {/* Center score */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="text-4xl font-black"
            style={{ color }}
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-text-light mt-[-2px]">{label}</span>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-xs font-medium text-text-light mt-1"
      >
        {getMessage(score)}
      </motion.p>
    </div>
  );
}
