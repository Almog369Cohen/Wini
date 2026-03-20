import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CravingTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 minutes
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) {
      if (secondsLeft <= 0 && isRunning) {
        setIsDone(true);
        setIsRunning(false);
      }
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const reset = () => {
    setSecondsLeft(600);
    setIsRunning(false);
    setIsDone(false);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = 1 - secondsLeft / 600;
  const circumference = 2 * Math.PI * 45;

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs text-text-light mb-3">
        {isDone
          ? 'עברת את זה! הדחף חלף.'
          : 'רוב הדחפים עוברים תוך 10 דקות'}
      </p>

      <div className="relative w-32 h-32 mb-3">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#dceee9"
            strokeWidth="4"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={isDone ? '#03b28c' : '#059cc0'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: circumference * (1 - progress) }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isDone ? (
            <span className="text-2xl">🎉</span>
          ) : (
            <>
              <span className="text-2xl font-mono font-bold text-text">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
              <span className="text-[10px] text-text-light">נשאר</span>
            </>
          )}
        </div>
      </div>

      {!isRunning && !isDone && (
        <button
          onClick={() => setIsRunning(true)}
          className="bg-sand text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-sand-light transition-colors"
        >
          התחל טיימר
        </button>
      )}

      {isRunning && (
        <button
          onClick={() => setIsRunning(false)}
          className="text-text-light text-xs hover:text-text transition-colors"
        >
          עצור
        </button>
      )}

      {isDone && (
        <div className="text-center">
          <p className="text-sage text-sm font-medium mb-2">
            מדהים! עברת את הדחף בהצלחה! 💪
          </p>
          <button
            onClick={reset}
            className="text-xs text-text-light hover:text-text transition-colors"
          >
            איפוס
          </button>
        </div>
      )}
    </div>
  );
}
