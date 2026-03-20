import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, ChevronDown, ChevronUp, Flame, Trophy, TrendingUp, Zap, Calendar } from 'lucide-react';
import { differenceInDays, differenceInMinutes, subDays, isSameDay } from 'date-fns';
import type { Habit, Page } from '../../types';
import { getDailyQuote } from '../../data/quotes';
import LiveTimer from './LiveTimer';
import ScoreGauge from './ScoreGauge';
import MiniRing from './MiniRing';
import WeekSparkline from './WeekSparkline';
import ChallengeWidget from '../Challenges/ChallengeWidget';
import DailyVictoryCounter from './DailyVictoryCounter';
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
  victoryCount?: number;
}

export default function Dashboard({ habits, onNavigate, todaySummary, hardHours, dopamineCount, dopamineGoal, dopamineGoalProgress, moodState, onChangeMood, onUrgeHelp, userName, userPhotoURL, mealData, victoryCount = 0 }: DashboardProps) {
  const [showMore, setShowMore] = useState(false);
  const activeQuitHabits = habits.filter((h) => h.type === 'quit' && h.isActive);
  const activeBuildHabits = habits.filter((h) => h.type === 'build' && h.isActive);
  const allActive = [...activeQuitHabits, ...activeBuildHabits];
  const quote = getDailyQuote();
  const hasHabits = habits.length > 0;

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

  // Calculate overall daily score (0-100)
  const dailyScore = useMemo(() => {
    if (!hasHabits) return 0;
    let score = 0;
    let weight = 0;

    // Streak contribution (40% weight)
    const maxStreak = Math.max(...allActive.map(h => h.currentStreak), 0);
    const streakScore = Math.min(maxStreak / 30, 1) * 100; // 30 days = 100%
    score += streakScore * 0.4;
    weight += 0.4;

    // Today's victories vs falls (30% weight)
    if (todaySummary.total > 0) {
      const winRate = todaySummary.victories / todaySummary.total;
      score += winRate * 100 * 0.3;
    } else {
      score += 70 * 0.3; // No entries = neutral-good
    }
    weight += 0.3;

    // Meals (15% weight)
    if (mealData) {
      score += (mealData.todayCompletedCount / 5) * 100 * 0.15;
      weight += 0.15;
    }

    // Dopamine (15% weight)
    score += dopamineGoalProgress * 100 * 0.15;
    weight += 0.15;

    return Math.round(Math.min(score / weight * (weight > 0 ? 1 : 0), 100));
  }, [hasHabits, allActive, todaySummary, mealData, dopamineGoalProgress]);

  // Weekly performance data for sparkline
  const weekData = useMemo(() => {
    const data: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = subDays(new Date(), i);
      let dayScore = 0;
      let count = 0;

      // Check-ins on that day
      allActive.forEach(h => {
        if (h.lastCheckIn && isSameDay(new Date(h.lastCheckIn), day)) {
          dayScore += 1;
        }
        count += 1;
      });

      // Normalize
      data.push(count > 0 ? dayScore / count : 0);
    }
    return data;
  }, [allActive]);

  // Achievements - recent milestones
  const achievements = useMemo(() => {
    const items: { emoji: string; text: string }[] = [];

    allActive.forEach(h => {
      if (h.currentStreak === 7) items.push({ emoji: '🔥', text: `שבוע ב${h.name}!` });
      if (h.currentStreak === 30) items.push({ emoji: '🏆', text: `חודש ב${h.name}!` });
      if (h.currentStreak === 100) items.push({ emoji: '💎', text: `100 ימים ב${h.name}!` });
      if (h.longestStreak > 0 && h.currentStreak === h.longestStreak && h.currentStreak > 3) {
        items.push({ emoji: '⭐', text: `שיא חדש ב${h.name}!` });
      }
    });

    if (totalSaved >= 100) items.push({ emoji: '💰', text: `חסכת ${totalSaved.toFixed(0)}₪!` });
    if (todaySummary.victories >= 3) items.push({ emoji: '🎯', text: `${todaySummary.victories} ניצחונות היום!` });

    return items.slice(0, 3);
  }, [allActive, totalSaved, todaySummary]);

  // Best streak across all habits
  const bestCurrentStreak = Math.max(...allActive.map(h => h.currentStreak), 0);

  // Hard hour
  const now = new Date().getHours();
  const nextHardHour = hasHabits && hardHours.length > 0
    ? (hardHours.find((h) => h > now) ?? hardHours[0])
    : null;

  // No habits - onboarding
  if (!hasHabits) {
    return (
      <motion.div
        key="dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-4 pt-6 pb-24 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[70vh]"
      >
        <div className="text-6xl mb-4">🌱</div>
        <h2 className="text-xl font-bold text-text mb-2">ברוך הבא ל-Wini</h2>
        <p className="text-sm text-text-light mb-6 text-center">הוסף את ההרגל הראשון שלך כדי להתחיל את המסע</p>
        <button
          onClick={() => onNavigate('habits')}
          className="bg-sage text-white px-8 py-3 rounded-xl text-sm font-semibold shadow-sm"
        >
          בואו נתחיל
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 pt-5 pb-24 max-w-lg mx-auto"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onNavigate('settings')}
          className="w-9 h-9 rounded-full bg-card shadow-sm flex items-center justify-center text-text-light hover:text-sage transition-colors"
        >
          <Settings size={16} />
        </button>
        <h1 className="text-lg font-bold text-text">{userName ? `הגן של ${userName}` : 'הגן שלי'}</h1>
        {userPhotoURL ? (
          <img src={userPhotoURL} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-sage/20" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-9" />
        )}
      </div>

      {/* ══════════════════════════════════════════════
          SECTION 1: SCORE GAUGE + TIMER
          ══════════════════════════════════════════════ */}
      <div className="bg-card rounded-2xl pt-4 pb-3 px-4 shadow-sm mb-3">
        <ScoreGauge score={dailyScore} label="ציון יומי" />

        {/* Timer strip */}
        {primaryHabit && (
          <div className="mt-2 pt-3 border-t border-cream-dark/50">
            <LiveTimer startDate={primaryHabit.startDate} label={`ללא ${primaryHabit.name}`} />
          </div>
        )}

        {/* Streak + Saved strip */}
        <div className="flex items-center justify-center gap-6 mt-3">
          {bestCurrentStreak > 0 && (
            <div className="flex items-center gap-1.5">
              <Flame size={14} className="text-coral" />
              <span className="text-sm font-bold text-text">{bestCurrentStreak}</span>
              <span className="text-[10px] text-text-light">ימים</span>
            </div>
          )}
          {totalSaved > 0 && (
            <div className="flex items-center gap-1.5">
              <TrendingUp size={14} className="text-sage" />
              <span className="text-sm font-bold text-sage">{totalSaved.toFixed(0)}₪</span>
              <span className="text-[10px] text-text-light">נחסך</span>
            </div>
          )}
          {todaySummary.victories > 0 && (
            <div className="flex items-center gap-1.5">
              <Trophy size={14} className="text-sage" />
              <span className="text-sm font-bold text-text">{todaySummary.victories}</span>
              <span className="text-[10px] text-text-light">ניצחונות</span>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          SECTION 2: MINI RINGS - 4 METRICS
          ══════════════════════════════════════════════ */}
      <div className="bg-card rounded-2xl shadow-sm px-2 py-3 mb-3 flex items-center justify-around">
        <MiniRing
          value={allActive.length > 0 ? allActive.filter(h => {
            if (h.type === 'build' && h.lastCheckIn) {
              return isSameDay(new Date(h.lastCheckIn), new Date());
            }
            return h.type === 'quit' && h.currentStreak > 0;
          }).length / allActive.length : 0}
          label="הרגלים"
          detail={`${allActive.filter(h => h.type === 'build' && h.lastCheckIn && isSameDay(new Date(h.lastCheckIn), new Date())).length + activeQuitHabits.filter(h => h.currentStreak > 0).length}/${allActive.length}`}
          color="#03b28c"
          emoji="🎯"
          onClick={() => onNavigate('habits')}
        />
        <MiniRing
          value={mealData ? mealData.todayCompletedCount / 5 : 0}
          label="ארוחות"
          detail={mealData ? `${mealData.todayCompletedCount}/5` : '0/5'}
          color="#059cc0"
          emoji="🍽️"
          onClick={() => onNavigate('nutrition')}
        />
        <MiniRing
          value={mealData ? mealData.todayWater / mealData.waterGoal : 0}
          label="מים"
          detail={mealData ? `${mealData.todayWater}/${mealData.waterGoal}` : '0/8'}
          color="#059cc0"
          emoji="💧"
          onClick={() => onNavigate('nutrition')}
        />
        <MiniRing
          value={dopamineGoalProgress}
          label="דופמין"
          detail={`${dopamineCount}/${dopamineGoal}`}
          color="#03b28c"
          emoji="⚡"
          onClick={() => onNavigate('sos')}
        />
      </div>

      {/* ══════════════════════════════════════════════
          VICTORY COUNTER
          ══════════════════════════════════════════════ */}
      <div className="mb-3">
        <DailyVictoryCounter count={victoryCount} goal={5} />
      </div>

      {/* ══════════════════════════════════════════════
          SECTION 3: WEEKLY TREND
          ══════════════════════════════════════════════ */}
      <button
        onClick={() => onNavigate('calendar')}
        className="w-full bg-card rounded-2xl shadow-sm px-4 py-3 mb-3 text-right"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-text-light" />
            <span className="text-xs font-medium text-text">השבוע שלי</span>
          </div>
          <span className="text-[10px] text-sage">לוח שנה →</span>
        </div>
        <WeekSparkline data={weekData} />
      </button>

      {/* ══════════════════════════════════════════════
          SECTION 4: ACHIEVEMENTS + HARD HOUR
          ══════════════════════════════════════════════ */}
      {achievements.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
          {achievements.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.15 }}
              className="flex-shrink-0 bg-sage/8 border border-sage/15 rounded-xl px-3 py-2 flex items-center gap-1.5"
            >
              <span className="text-sm">{a.emoji}</span>
              <span className="text-[11px] font-medium text-sage whitespace-nowrap">{a.text}</span>
            </motion.div>
          ))}
        </div>
      )}

      {nextHardHour !== null && (
        <div className="bg-coral/8 border border-coral/15 rounded-xl px-4 py-2.5 mb-3 flex items-center gap-3">
          <span className="text-lg">⚡</span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-coral">שעת סיכון: {nextHardHour}:00</p>
            <p className="text-[10px] text-text-light">הכן תרגיל נשימה או הליכה</p>
          </div>
          <button onClick={onUrgeHelp} className="bg-coral text-white text-[10px] font-bold px-3 py-1.5 rounded-lg">
            SOS
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          SECTION 5: MOOD + CHALLENGE
          ══════════════════════════════════════════════ */}
      {moodState.hasCheckedInToday ? (
        <button
          onClick={onChangeMood}
          className="w-full bg-card rounded-2xl shadow-sm px-4 py-3 mb-3 flex items-center gap-3 text-right"
        >
          <div className="text-2xl">
            {moodState.moodEmojis[moodState.currentMood] || '😐'}
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-text">
              {moodState.moodLabels[moodState.currentMood] || 'ניטרלי'}
            </p>
            <div className="flex items-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className={`w-4 h-1.5 rounded-full ${
                    i <= moodState.currentEnergy ? 'bg-sage' : 'bg-cream-dark'
                  }`}
                />
              ))}
              <span className="text-[9px] text-text-light mr-1">אנרגיה</span>
            </div>
          </div>
          <span className="text-[10px] text-sage">עדכן →</span>
        </button>
      ) : hasHabits && (
        <button
          onClick={onChangeMood}
          className="w-full bg-sage/8 border border-sage/15 rounded-xl px-4 py-3 mb-3 flex items-center gap-2 text-sage text-sm font-medium"
        >
          <span>😊</span>
          <span>איך אתה מרגיש? לחץ לעדכון מצב רוח</span>
        </button>
      )}

      <ChallengeWidget onNavigate={onNavigate} />

      {/* ══════════════════════════════════════════════
          SECTION 6: QUOTE
          ══════════════════════════════════════════════ */}
      <div className="bg-sage/6 rounded-xl px-4 py-3 mb-3 text-center">
        <p className="text-[11px] text-sage-dark leading-relaxed italic">"{quote}"</p>
      </div>

      {/* ══════════════════════════════════════════════
          SECTION 7: MORE TOOLS (COLLAPSED)
          ══════════════════════════════════════════════ */}
      <button
        onClick={() => setShowMore(!showMore)}
        className="w-full flex items-center justify-center gap-1.5 text-text-light text-xs py-2 mb-1"
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
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[
                { page: 'tasks' as Page, emoji: '📋', label: 'משימות' },
                { page: 'reminders' as Page, emoji: '🔔', label: 'תזכורות' },
                { page: 'innerspace' as Page, emoji: '🌙', label: 'המרחב שלי' },
                { page: 'milestones' as Page, emoji: '🏆', label: 'הישגים' },
                { page: 'partner' as Page, emoji: '👥', label: 'שותף' },
                { page: 'routines' as Page, emoji: '🔄', label: 'שגרות' },
                { page: 'journal' as Page, emoji: '📓', label: 'יומן' },
                { page: 'calendar' as Page, emoji: '📅', label: 'לוח שנה' },
              ].map((item) => (
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className="bg-card rounded-xl py-3 shadow-sm flex flex-col items-center gap-1 hover:shadow-md transition-shadow"
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span className="text-[9px] font-medium text-text">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════
          SECTION 8: SOS
          ══════════════════════════════════════════════ */}
      <button
        onClick={onUrgeHelp}
        className="w-full bg-coral text-white rounded-xl py-3.5 flex items-center justify-center gap-2 font-semibold text-sm shadow-sm mb-2 active:scale-[0.98] transition-transform"
      >
        🆘 מרגיש דחף? בוא נתמודד ביחד
      </button>
    </motion.div>
  );
}
