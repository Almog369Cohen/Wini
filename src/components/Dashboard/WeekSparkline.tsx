import { motion } from 'framer-motion';

interface WeekSparklineProps {
  data: number[]; // 7 values, 0-1 (performance per day)
  labels?: string[];
}

const DAY_LABELS = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

export default function WeekSparkline({ data, labels = DAY_LABELS }: WeekSparklineProps) {
  const maxVal = Math.max(...data, 1);
  const today = new Date().getDay();

  return (
    <div className="flex items-end gap-1.5 justify-between px-1">
      {data.map((val, i) => {
        const height = Math.max((val / maxVal) * 36, 4);
        const isToday = i === today;
        const performance = val / maxVal;

        let barColor = 'bg-cream-dark';
        if (val > 0) {
          if (performance >= 0.7) barColor = 'bg-sage';
          else if (performance >= 0.4) barColor = 'bg-sea';
          else barColor = 'bg-coral/60';
        }

        return (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
              className={`w-full max-w-[18px] rounded-t-sm ${barColor} ${isToday ? 'ring-1 ring-sage ring-offset-1 ring-offset-card' : ''}`}
            />
            <span className={`text-[9px] ${isToday ? 'font-bold text-sage' : 'text-text-light'}`}>
              {labels[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
