import { motion } from 'framer-motion';
import { Check, RotateCcw, Trash2, Flame } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import type { Habit } from '../../types';
import { useState } from 'react';

interface HabitCardProps {
  habit: Habit;
  onCheckIn: (id: string) => void;
  onRelapse: (id: string, note?: string, trigger?: string) => void;
  onDelete: (id: string) => void;
}

import { HABIT_CATEGORIES } from '../../data/habitTemplates';

const getCategoryEmoji = (category: string) => {
  return HABIT_CATEGORIES[category]?.emoji || '✨';
};

export default function HabitCard({
  habit,
  onCheckIn,
  onRelapse,
  onDelete,
}: HabitCardProps) {
  const [showRelapse, setShowRelapse] = useState(false);
  const [relapseNote, setRelapseNote] = useState('');
  const days = differenceInDays(new Date(), new Date(habit.startDate));
  const isQuit = habit.type === 'quit';

  const todayChecked =
    habit.lastCheckIn &&
    new Date(habit.lastCheckIn).toDateString() === new Date().toDateString();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-xl p-4 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{getCategoryEmoji(habit.category)}</span>
          <div>
            <h3 className="text-sm font-semibold text-text">{habit.name}</h3>
            <p className="text-xs text-text-light">
              {isQuit ? 'גמילה' : 'בנייה'} · {days} ימים
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {habit.currentStreak > 0 && (
            <div className="flex items-center gap-0.5 bg-sand/20 px-2 py-0.5 rounded-full">
              <Flame size={12} className="text-sand" />
              <span className="text-xs font-bold text-sand">{habit.currentStreak}</span>
            </div>
          )}
        </div>
      </div>

      {/* Streak bar */}
      <div className="mt-3 mb-2">
        <div className="flex justify-between text-[10px] text-text-light mb-1">
          <span>streak נוכחי: {habit.currentStreak}</span>
          <span>שיא: {habit.longestStreak}</span>
        </div>
        <div className="h-1.5 bg-cream-dark rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor: isQuit ? '#c97b63' : '#5b8a72',
            }}
            initial={{ width: 0 }}
            animate={{
              width: habit.longestStreak > 0
                ? `${Math.min(100, (habit.currentStreak / Math.max(habit.longestStreak, 30)) * 100)}%`
                : '0%',
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3">
        {isQuit ? (
          <>
            <button
              onClick={() => setShowRelapse(!showRelapse)}
              className="flex items-center gap-1 text-xs text-coral/70 hover:text-coral px-2 py-1.5 rounded-lg hover:bg-coral/10 transition-colors"
            >
              <RotateCcw size={13} />
              <span>נפילה</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => onCheckIn(habit.id)}
            disabled={!!todayChecked}
            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors ${
              todayChecked
                ? 'bg-sage/20 text-sage cursor-default'
                : 'bg-sage text-white hover:bg-sage-dark'
            }`}
          >
            <Check size={13} />
            <span>{todayChecked ? 'בוצע היום' : 'צ\'ק-אין'}</span>
          </button>
        )}

        <button
          onClick={() => onDelete(habit.id)}
          className="mr-auto text-text-light/40 hover:text-coral/60 p-1.5 rounded-lg hover:bg-coral/5 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Relapse form */}
      {showRelapse && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-3 pt-3 border-t border-cream-dark"
        >
          <textarea
            value={relapseNote}
            onChange={(e) => setRelapseNote(e.target.value)}
            placeholder="מה קרה? מה היה הטריגר?"
            className="w-full text-xs bg-cream/50 border border-cream-dark rounded-lg p-2 resize-none h-16 focus:outline-none focus:border-sage"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                onRelapse(habit.id, relapseNote);
                setRelapseNote('');
                setShowRelapse(false);
              }}
              className="text-xs bg-coral/10 text-coral px-3 py-1.5 rounded-lg hover:bg-coral/20 transition-colors"
            >
              אישור ואתחול
            </button>
            <button
              onClick={() => setShowRelapse(false)}
              className="text-xs text-text-light px-3 py-1.5 rounded-lg hover:bg-cream-dark transition-colors"
            >
              ביטול
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
