import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { differenceInDays, differenceInMinutes } from 'date-fns';
import type { Habit, Page } from '../../types';
import { getDailyQuote } from '../../data/quotes';
import GrowingTree from './GrowingTree';
import LiveTimer from './LiveTimer';
import MoodWidget from '../MoodCheckIn/MoodWidget';
import ChallengeWidget from '../Challenges/ChallengeWidget';
import type { useMood } from '../../hooks/useMood';

interface DashboardProps {
  habits: Habit[];
  onNavigate: (page: Page) => void;
  todaySummary: { falls: number; victories: number; total: number };
  hardHours: number[];
  dopamineCount: number;
  dopamineGoal: number;
  dopamineGoalProgress: number;
  moodState: ReturnType<typeof useMood>;
  onChangeMood: () => void;
  onUrgeHelp: () => void;
  userName?: string;
  userPhotoURL?: string | null;
  mealData?: {
    todayCompletedCount: number;
    todayWater: number;
    waterGoal: number;
  };
}

export default function Dashboard({ habits, onNavigate, todaySummary, hardHours, dopamineCount, dopamineGoal, dopamineGoalProgress, moodState, onChangeMood, onUrgeHelp, userName, userPhotoURL, mealData }: DashboardProps) {
  const [showMore, setShowMore] = useState(false);
  const activeQuitHabits = habits.filter((h) => h.type === 'quit' && h.isActive);
  const activeBuildHabits = habits.filter((h) => h.type === 'build' && h.isActive);
  const quote = getDailyQuote();

  const primaryHabit = activeQuitHabits.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  )[0];

  const daysSinceStart = primaryHabit
    ? differenceInDays(new Date(), new Date(primaryHabit.startDate))
    : 0;

  const totalSaved = activeQuitHabits.reduce((sum, h) => {
    if (!h.dailyCost) return sum;
    const minutes = differenceInMinutes(new Date(), new Date(h.startDate));
    return sum + (h.dailyCost / 1440) * minutes;
  }, 0);

  const hasHabits = habits.length > 0;

  // Hard hour check
  const now = new Date().getHours();
  const nextHardHour = hasHabits && hardHours.length > 0
    ? (hardHours.find((h) => h > now) ?? hardHours[0])
    : null;

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 pt-6 pb-24 max-w-lg mx-auto"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => onNavigate('settings')}
          className="w-9 h-9 rounded-full bg-card shadow-sm flex items-center justify-center text-text-light hover:text-sage transition-colors"
        >
          <Settings size={16} />
        </button>
        <h1 className="text-xl font-bold text-text">{userName ? `הגן של ${userName}` : 'הגן שלי'}</h1>
        {userPhotoURL ? (
          <img src={userPhotoURL} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-sage/20" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-9" />
        )}
      </div>

      {/* ── HERO: Tree + Timer ── */}
      {hasHabits ? (
        <div className="bg-card rounded-2xl p-5 shadow-sm mb-4">
          <GrowingTree daysSinceStart={daysSinceStart} />
          {primaryHabit && (
            <LiveTimer startDate={primaryHabit.startDate} label={`ללא ${primaryHabit.name}`} />
          )}

          {/* Inline stats row */}
          <div className="flex items-center justify-around mt-4 pt-3 border-t border-cream-dark/50">
            {totalSaved > 0 && (
              <div className="text-center">
                <p className="text-lg font-bold text-sage">{totalSaved.toFixed(0)}₪</p>
                <p className="text-[10px] text-text-light">נחסך</p>
              </div>
            )}
            <div className="text-center">
              <p className="text-lg font-bold text-text">{activeQuitHabits.length + activeBuildHabits.length}</p>
              <p className="text-[10px] text-text-light">הרגלים</p>
            </div>
            {todaySummary.victories > 0 && (
              <div className="text-center">
                <p className="text-lg font-bold text-sage">{todaySummary.victories}</p>
                <p className="text-[10px] text-text-light">ניצחונות</p>
              </div>
            )}
            {todaySummary.falls > 0 && (
              <div className="text-center">
                <p className="text-lg font-bold text-coral">{todaySummary.falls}</p>
                <p className="text-[10px] text-text-light">נפילות</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl p-8 shadow-sm mb-4 text-center">
          <div className="text-4xl mb-3">🌱</div>
          <h2 className="text-lg font-semibold text-text mb-2">ברוך הבא ל-Wini</h2>
          <p className="text-sm text-text-light mb-4">הוסף את ההרגל הראשון שלך כדי להתחיל</p>
          <button
            onClick={() => onNavigate('habits')}
            className="bg-sage text-white px-6 py-2.5 rounded-xl text-sm font-medium"
          >
            בואו נתחיל
          </button>
        </div>
      )}

      {/* ── Hard hour warning ── */}
      {nextHardHour !== null && (
        <div className="bg-coral/8 border border-coral/15 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
          <span className="text-xl">⚡</span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-coral">שעת סיכון: {nextHardHour}:00</p>
            <p className="text-[10px] text-text-light">הכן תרגיל נשימה או הליכה קצרה</p>
          </div>
          <button onClick={onUrgeHelp} className="bg-coral text-white text-[10px] font-bold px-3 py-1.5 rounded-lg">
            SOS
          </button>
        </div>
      )}

      {/* ── Mood ── */}
      {hasHabits && moodState.hasCheckedInToday && (
        <div className="mb-4">
          <MoodWidget
            currentMood={moodState.currentMood}
            currentMoods={moodState.currentMoods}
            currentEnergy={moodState.currentEnergy}
            todayEntries={moodState.todayEntries}
            moodEmojis={moodState.moodEmojis}
            moodLabels={moodState.moodLabels}
            onChangeMood={onChangeMood}
            onViewPlan={() => onNavigate('dailyplan')}
          />
        </div>
      )}

      {/* ── Daily challenge ── */}
      <ChallengeWidget onNavigate={onNavigate} />

      {/* ── Quick actions: 4 main buttons ── */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { page: 'nutrition' as Page, emoji: '🍽️', label: 'תזונה', stat: mealData ? `${mealData.todayCompletedCount}/5` : undefined },
          { page: 'tasks' as Page, emoji: '📋', label: 'משימות' },
          { page: 'calendar' as Page, emoji: '📅', label: 'לוח שנה' },
          { page: 'sos' as Page, emoji: '⚡', label: 'דופמין', stat: `${dopamineCount}/${dopamineGoal}` },
        ].map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className="bg-card rounded-xl p-3 shadow-sm flex flex-col items-center gap-1.5 hover:shadow-md transition-shadow"
          >
            <span className="text-xl">{item.emoji}</span>
            <span className="text-[10px] font-medium text-text">{item.label}</span>
            {item.stat && <span className="text-[9px] font-bold text-sage">{item.stat}</span>}
          </button>
        ))}
      </div>

      {/* ── Quote ── */}
      <div className="bg-sage/8 rounded-xl px-4 py-3 mb-4 text-center">
        <p className="text-xs text-sage-dark leading-relaxed italic">"{quote}"</p>
      </div>

      {/* ── More section (collapsed) ── */}
      <button
        onClick={() => setShowMore(!showMore)}
        className="w-full flex items-center justify-center gap-1.5 text-text-light text-xs py-2 mb-2"
      >
        <span>{showMore ? 'הסתר' : 'עוד כלים'}</span>
        {showMore ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { page: 'reminders' as Page, emoji: '🔔', label: 'תזכורות' },
                { page: 'innerspace' as Page, emoji: '🌙', label: 'המרחב שלי' },
                { page: 'milestones' as Page, emoji: '🏆', label: 'הישגים' },
                { page: 'partner' as Page, emoji: '👥', label: 'שותף' },
                { page: 'routines' as Page, emoji: '🔄', label: 'שגרות' },
                { page: 'journal' as Page, emoji: '📓', label: 'יומן' },
              ].map((item) => (
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className="bg-card rounded-xl p-3 shadow-sm flex flex-col items-center gap-1 hover:shadow-md transition-shadow"
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span className="text-[10px] font-medium text-text">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SOS bar ── */}
      {hasHabits && (
        <button
          onClick={onUrgeHelp}
          className="w-full bg-coral text-white rounded-xl py-3.5 flex items-center justify-center gap-2 font-semibold text-sm shadow-sm mb-4 active:scale-[0.98] transition-transform"
        >
          🆘 מרגיש דחף? בוא נתמודד ביחד
        </button>
      )}
    </motion.div>
  );
}
