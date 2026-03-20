import { motion } from 'framer-motion';
import { AlertCircle, TrendingUp, Settings, Trophy, ThumbsDown, Zap } from 'lucide-react';
import { differenceInDays, differenceInMinutes } from 'date-fns';
import type { Habit, Page } from '../../types';
import { getDailyQuote } from '../../data/quotes';
import GrowingTree from './GrowingTree';
import LiveTimer from './LiveTimer';
import MoodWidget from '../MoodCheckIn/MoodWidget';
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
}

export default function Dashboard({ habits, onNavigate, todaySummary, hardHours, dopamineCount, dopamineGoal, dopamineGoalProgress, moodState, onChangeMood, onUrgeHelp, userName }: DashboardProps) {
  const activeQuitHabits = habits.filter((h) => h.type === 'quit' && h.isActive);
  const activeBuildHabits = habits.filter((h) => h.type === 'build' && h.isActive);
  const quote = getDailyQuote();

  // Find the primary quit habit (longest running)
  const primaryHabit = activeQuitHabits.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  )[0];

  const daysSinceStart = primaryHabit
    ? differenceInDays(new Date(), new Date(primaryHabit.startDate))
    : 0;

  // Calculate total money saved
  const totalSaved = activeQuitHabits.reduce((sum, h) => {
    if (!h.dailyCost) return sum;
    const minutes = differenceInMinutes(new Date(), new Date(h.startDate));
    return sum + (h.dailyCost / 1440) * minutes;
  }, 0);

  const hasHabits = habits.length > 0;

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 pt-6 max-w-lg mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onNavigate('settings')}
          className="w-8 h-8 rounded-full bg-card shadow-sm flex items-center justify-center text-text-light hover:text-sage transition-colors"
        >
          <Settings size={16} />
        </button>
        <h1 className="text-2xl font-bold text-text">{userName ? `הגן של ${userName}` : 'הגן שלי'}</h1>
        <div className="w-8" />
      </div>

      {/* Tree visualization */}
      {hasHabits ? (
        <div className="bg-card rounded-2xl p-4 shadow-sm mb-4">
          <GrowingTree daysSinceStart={daysSinceStart} />
          {primaryHabit && (
            <LiveTimer
              startDate={primaryHabit.startDate}
              label={`ללא ${primaryHabit.name}`}
            />
          )}
        </div>
      ) : (
        <div className="bg-card rounded-2xl p-8 shadow-sm mb-4 text-center">
          <div className="text-4xl mb-3">🌱</div>
          <h2 className="text-lg font-semibold text-text mb-2">ברוך הבא ל-Wini</h2>
          <p className="text-sm text-text-light mb-4">
            הוסף את ההרגל הראשון שלך כדי להתחיל את המסע
          </p>
          <button
            onClick={() => onNavigate('habits')}
            className="bg-sage text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-sage-dark transition-colors"
          >
            בואו נתחיל
          </button>
        </div>
      )}

      {/* Mood Widget */}
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

      {/* Stats cards */}
      {hasHabits && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {totalSaved > 0 && (
            <div className="bg-card rounded-xl p-3 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp size={14} className="text-sage" />
                <span className="text-xs text-text-light">נחסך</span>
              </div>
              <p className="text-lg font-bold text-sage">
                {totalSaved.toFixed(0)} ₪
              </p>
            </div>
          )}
          <div className="bg-card rounded-xl p-3 shadow-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs text-text-light">הרגלים פעילים</span>
            </div>
            <p className="text-lg font-bold text-text">
              <span className="text-coral">{activeQuitHabits.length}</span>
              {' / '}
              <span className="text-sage">{activeBuildHabits.length}</span>
            </p>
            <p className="text-[10px] text-text-light">גומל / בונה</p>
          </div>
        </div>
      )}

      {/* Today's moments */}
      {todaySummary.total > 0 && (
        <div className="bg-card rounded-xl p-3 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-light">הרגעים שלי היום</span>
            <span className="text-[10px] text-text-light">{todaySummary.total} רגעים</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Trophy size={14} className="text-sage" />
              <span className="text-sm font-bold text-sage">{todaySummary.victories}</span>
              <span className="text-[10px] text-text-light">ניצחונות</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsDown size={14} className="text-coral" />
              <span className="text-sm font-bold text-coral">{todaySummary.falls}</span>
              <span className="text-[10px] text-text-light">נפילות</span>
            </div>
          </div>
          {todaySummary.total > 0 && (
            <div className="mt-2 h-1.5 bg-cream-dark rounded-full overflow-hidden flex">
              <div
                className="h-full bg-sage rounded-r-full"
                style={{
                  width: `${(todaySummary.victories / todaySummary.total) * 100}%`,
                }}
              />
              <div
                className="h-full bg-coral rounded-l-full"
                style={{
                  width: `${(todaySummary.falls / todaySummary.total) * 100}%`,
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Hard hour warning */}
      {hasHabits && hardHours.length > 0 && (() => {
        const now = new Date().getHours();
        const nextHard = hardHours.find((h) => h > now) ?? hardHours[0];
        return (
          <div className="bg-sand/10 border border-sand/20 rounded-xl p-3 mb-4 flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="text-xs font-medium text-sand">שעת סיכון קרובה: {nextHard}:00</p>
              <p className="text-[10px] text-text-light">הכן את עצמך - תרגיל נשימה או הליכה קצרה</p>
            </div>
          </div>
        );
      })()}

      {/* Dopamine tracker shortcut */}
      <button
        onClick={() => onNavigate('sos')}
        className="w-full bg-card rounded-xl p-3 shadow-sm mb-4 flex items-center gap-3 text-right"
      >
        <div className="w-9 h-9 rounded-full bg-sage/15 flex items-center justify-center flex-shrink-0">
          <Zap size={18} className="text-sage" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-text">דופמין בריא</span>
            <span className="text-xs font-bold text-sage">{dopamineCount}/{dopamineGoal}</span>
          </div>
          <div className="h-1.5 bg-cream-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-sage rounded-full transition-all duration-500"
              style={{ width: `${dopamineGoalProgress * 100}%` }}
            />
          </div>
        </div>
      </button>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => onNavigate('innerspace')}
          className="bg-gradient-to-l from-sage/10 to-sea/10 border border-sage/15 rounded-xl p-3 flex items-center gap-2 text-right"
        >
          <span className="text-lg">🌙</span>
          <div>
            <p className="text-xs font-medium text-sage">המרחב שלי</p>
            <p className="text-[9px] text-text-light">שיקוף ומסע פנימי</p>
          </div>
        </button>
        <button
          onClick={() => onNavigate('milestones')}
          className="bg-gradient-to-l from-sand/10 to-sand/5 border border-sand/15 rounded-xl p-3 flex items-center gap-2 text-right"
        >
          <span className="text-lg">🏆</span>
          <div>
            <p className="text-xs font-medium text-sand">הישגים</p>
            <p className="text-[9px] text-text-light">אבני דרך שלי</p>
          </div>
        </button>
      </div>

      {/* Quote */}
      <div className="bg-sage/10 rounded-xl p-4 mb-4 text-center">
        <p className="text-sm text-sage-dark leading-relaxed italic">"{quote}"</p>
      </div>

      {/* Urge help button */}
      {hasHabits && (
        <button
          onClick={onUrgeHelp}
          className="w-full bg-coral/10 border border-coral/20 rounded-xl p-4 flex items-center justify-center gap-2 text-coral hover:bg-coral/20 transition-colors mb-6"
        >
          <AlertCircle size={20} />
          <span className="font-semibold">מרגיש דחף? בוא נתמודד ביחד</span>
        </button>
      )}
    </motion.div>
  );
}
