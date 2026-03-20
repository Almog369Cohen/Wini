import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useDailyChallenges } from '../../hooks/useDailyChallenges';
import type { Page } from '../../types';

interface ChallengeWidgetProps {
  onNavigate: (page: Page) => void;
}

export default function ChallengeWidget({ onNavigate }: ChallengeWidgetProps) {
  const { todayChallenges, todayCompleted, streak, categoryMeta } = useDailyChallenges();

  const completedCount = todayCompleted.length;
  const allDone = completedCount >= 3;

  // Find next uncompleted challenge
  const nextChallenge = todayChallenges.find(c => !todayCompleted.includes(c.id));

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => onNavigate('challenges')}
      className="w-full bg-card rounded-2xl shadow-sm p-3.5 mb-4 text-right"
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
          allDone ? 'bg-sage/15' : 'bg-amber-50'
        }`}>
          {allDone ? '🏆' : '🎯'}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-text">אתגר יומי</span>
            <div className="flex items-center gap-2">
              {streak > 0 && (
                <div className="flex items-center gap-0.5">
                  <Flame size={11} className="text-coral" />
                  <span className="text-[10px] font-bold text-coral">{streak}</span>
                </div>
              )}
              <span className="text-xs font-bold text-sage">{completedCount}/3</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-cream-dark rounded-full overflow-hidden mb-1.5">
            <motion.div
              className="h-full bg-sage rounded-full"
              initial={false}
              animate={{ width: `${(completedCount / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Next challenge preview or done message */}
          {allDone ? (
            <p className="text-[10px] text-sage font-medium">כל האתגרים הושלמו!</p>
          ) : nextChallenge ? (
            <div className="flex items-center gap-1.5">
              <span className="text-xs">{nextChallenge.emoji}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${categoryMeta[nextChallenge.category].color}`}>
                {categoryMeta[nextChallenge.category].label}
              </span>
              <span className="text-[10px] text-text-light truncate">{nextChallenge.title}</span>
            </div>
          ) : null}
        </div>

        <div className="text-text-light text-xs">←</div>
      </div>
    </motion.button>
  );
}
