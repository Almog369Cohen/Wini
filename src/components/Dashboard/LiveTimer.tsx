import { useState, useEffect } from 'react';
import { differenceInSeconds } from 'date-fns';

interface LiveTimerProps {
  startDate: string;
  label: string;
}

export default function LiveTimer({ startDate, label }: LiveTimerProps) {
  const [elapsed, setElapsed] = useState(() =>
    differenceInSeconds(new Date(), new Date(startDate))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(differenceInSeconds(new Date(), new Date(startDate)));
    }, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  const days = Math.floor(elapsed / 86400);
  const hours = Math.floor((elapsed % 86400) / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="text-center">
      <p className="text-xs text-text-light mb-1">{label}</p>
      <div className="flex items-center justify-center gap-1 font-mono text-sage">
        {days > 0 && (
          <>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">{days}</span>
              <span className="text-[9px] text-text-light">ימים</span>
            </div>
            <span className="text-xl text-sage-light mb-3">:</span>
          </>
        )}
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">{pad(hours)}</span>
          <span className="text-[9px] text-text-light">שעות</span>
        </div>
        <span className="text-xl text-sage-light mb-3">:</span>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">{pad(minutes)}</span>
          <span className="text-[9px] text-text-light">דקות</span>
        </div>
        <span className="text-xl text-sage-light mb-3">:</span>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">{pad(seconds)}</span>
          <span className="text-[9px] text-text-light">שניות</span>
        </div>
      </div>
    </div>
  );
}
