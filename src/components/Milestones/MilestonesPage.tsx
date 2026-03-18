import { useState } from 'react';
import { motion } from 'framer-motion';
import { differenceInDays, differenceInMinutes } from 'date-fns';
import type { Habit } from '../../types';
import { getMilestonesForCategory } from '../../data/healthTimeline';
import HealthTimeline from './HealthTimeline';

interface MilestonesPageProps {
  habits: Habit[];
}

const streakBadges = [
  { days: 1, icon: '🌱', label: 'יום ראשון' },
  { days: 3, icon: '🌿', label: '3 ימים' },
  { days: 7, icon: '🌳', label: 'שבוע' },
  { days: 14, icon: '💪', label: 'שבועיים' },
  { days: 30, icon: '⭐', label: 'חודש' },
  { days: 60, icon: '🌟', label: 'חודשיים' },
  { days: 90, icon: '🏆', label: '3 חודשים' },
  { days: 180, icon: '👑', label: 'חצי שנה' },
  { days: 365, icon: '🎉', label: 'שנה!' },
];

export default function MilestonesPage({ habits }: MilestonesPageProps) {
  const activeQuitHabits = habits.filter((h) => h.type === 'quit' && h.isActive);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(
    activeQuitHabits[0]?.id || null
  );

  const selectedHabit = habits.find((h) => h.id === selectedHabitId);
  const milestones = selectedHabit
    ? getMilestonesForCategory(selectedHabit.category)
    : [];

  // Calculate stats
  const totalDaysClean = activeQuitHabits.reduce(
    (sum, h) => sum + differenceInDays(new Date(), new Date(h.startDate)),
    0
  );
  const totalSaved = activeQuitHabits.reduce((sum, h) => {
    if (!h.dailyCost) return sum;
    const minutes = differenceInMinutes(new Date(), new Date(h.startDate));
    return sum + (h.dailyCost / 1440) * minutes;
  }, 0);

  const longestStreak = Math.max(0, ...habits.map((h) => h.longestStreak));

  return (
    <motion.div
      key="milestones"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 pt-6 max-w-lg mx-auto"
    >
      <h1 className="text-2xl font-bold text-text mb-5">ההישגים שלי</h1>

      {habits.length === 0 ? (
        <div className="bg-card rounded-2xl p-8 shadow-sm text-center">
          <div className="text-4xl mb-3">🏆</div>
          <p className="text-sm text-text-light">
            הוסף הרגלים כדי לראות את ההישגים שלך כאן
          </p>
        </div>
      ) : (
        <>
          {/* Stats summary */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <div className="bg-card rounded-xl p-3 shadow-sm text-center">
              <p className="text-lg font-bold text-sage">{totalDaysClean}</p>
              <p className="text-[10px] text-text-light">ימים נקיים</p>
            </div>
            {totalSaved > 0 && (
              <div className="bg-card rounded-xl p-3 shadow-sm text-center">
                <p className="text-lg font-bold text-sand">{totalSaved.toFixed(0)}₪</p>
                <p className="text-[10px] text-text-light">נחסך</p>
              </div>
            )}
            <div className="bg-card rounded-xl p-3 shadow-sm text-center">
              <p className="text-lg font-bold text-coral">{longestStreak}</p>
              <p className="text-[10px] text-text-light">streak שיא</p>
            </div>
          </div>

          {/* Streak badges */}
          <div className="bg-card rounded-2xl p-4 shadow-sm mb-5">
            <h2 className="text-sm font-semibold text-text mb-3">תגי streak</h2>
            <div className="flex flex-wrap gap-3">
              {streakBadges.map((badge) => {
                const earned = longestStreak >= badge.days;
                return (
                  <motion.div
                    key={badge.days}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={`flex flex-col items-center w-14 ${
                      earned ? '' : 'opacity-30 grayscale'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        earned ? 'bg-sand/20' : 'bg-cream-dark'
                      }`}
                    >
                      {badge.icon}
                    </div>
                    <span className="text-[9px] text-text-light mt-1 text-center">
                      {badge.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Health timeline */}
          {activeQuitHabits.length > 0 && (
            <div className="bg-card rounded-2xl p-4 shadow-sm mb-6">
              <h2 className="text-sm font-semibold text-text mb-3">ציר זמן בריאותי</h2>

              {activeQuitHabits.length > 1 && (
                <div className="flex gap-2 mb-3 overflow-x-auto">
                  {activeQuitHabits.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => setSelectedHabitId(h.id)}
                      className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                        selectedHabitId === h.id
                          ? 'bg-sage text-white'
                          : 'bg-cream-dark text-text-light'
                      }`}
                    >
                      {h.name}
                    </button>
                  ))}
                </div>
              )}

              {selectedHabit && (
                <HealthTimeline
                  milestones={milestones}
                  startDate={selectedHabit.startDate}
                />
              )}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
