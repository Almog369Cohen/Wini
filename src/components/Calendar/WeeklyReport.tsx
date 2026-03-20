import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Star, AlertTriangle } from 'lucide-react';
import type { Habit, JournalEntry, MoodEntry, MoodType } from '../../types';

interface WeeklyReportProps {
  habits: Habit[];
  journalEntries: JournalEntry[];
  moodHistory: MoodEntry[];
}

const HEBREW_DAYS_SHORT = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];

const HEBREW_MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];

const MOOD_SCORES: Record<MoodType, number> = {
  happy: 5,
  energetic: 5,
  hopeful: 4,
  calm: 4,
  neutral: 3,
  tired: 2,
  lonely: 2,
  frustrated: 2,
  irritable: 2,
  anxious: 1,
  exhausted: 1,
  sad: 1,
};

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatHebrewDate(date: Date): string {
  return `${date.getDate()} ${HEBREW_MONTHS[date.getMonth()]}`;
}

interface DailyScore {
  date: Date;
  checkIns: number;
  relapses: number;
  victories: number;
  falls: number;
  avgMood: number;
  hasMood: boolean;
  score: number; // 0-100
}

export default function WeeklyReport({ habits, journalEntries, moodHistory }: WeeklyReportProps) {
  // Get current week (Sunday to Saturday)
  const { weekStart, weekEnd, dailyScores, prevWeekScores } = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const start = new Date(today);
    start.setDate(today.getDate() - dayOfWeek);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    const prevStart = new Date(start);
    prevStart.setDate(start.getDate() - 7);
    const prevEnd = new Date(start);
    prevEnd.setMilliseconds(-1);

    const computeScores = (rangeStart: Date, rangeEnd: Date): DailyScore[] => {
      const scores: DailyScore[] = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(rangeStart);
        day.setDate(rangeStart.getDate() + i);
        const key = toDateKey(day);

        // Check-ins: count habits whose lastCheckIn matches this day
        let checkIns = 0;
        let relapses = 0;
        habits.forEach((h) => {
          if (h.lastCheckIn && toDateKey(new Date(h.lastCheckIn)) === key) {
            checkIns++;
          }
          h.relapses.forEach((r) => {
            if (toDateKey(new Date(r.date)) === key) {
              relapses++;
            }
          });
        });

        // Journal
        const dayJournal = journalEntries.filter(
          (e) => toDateKey(new Date(e.date)) === key
        );
        const victories = dayJournal.filter((e) => e.type === 'victory').length;
        const falls = dayJournal.filter((e) => e.type === 'fall').length;

        // Mood
        const dayMoods = moodHistory.filter(
          (m) => toDateKey(new Date(m.timestamp)) === key
        );
        const avgMood =
          dayMoods.length > 0
            ? dayMoods.reduce((sum, m) => sum + (MOOD_SCORES[m.mood] || 3), 0) / dayMoods.length
            : 0;

        // Compute composite score (0-100)
        let score = 50; // baseline
        score += checkIns * 10;
        score -= relapses * 15;
        score += victories * 10;
        score -= falls * 10;
        if (dayMoods.length > 0) {
          score += (avgMood - 3) * 8; // moods above 3 add points, below subtract
        }
        score = Math.max(0, Math.min(100, score));

        scores.push({
          date: day,
          checkIns,
          relapses,
          victories,
          falls,
          avgMood,
          hasMood: dayMoods.length > 0,
          score,
        });
      }
      return scores;
    };

    return {
      weekStart: start,
      weekEnd: end,
      dailyScores: computeScores(start, end),
      prevWeekScores: computeScores(prevStart, prevEnd),
    };
  }, [habits, journalEntries, moodHistory]);

  // Aggregate stats
  const stats = useMemo(() => {
    const totalCheckIns = dailyScores.reduce((s, d) => s + d.checkIns, 0);
    const totalRelapses = dailyScores.reduce((s, d) => s + d.relapses, 0);
    const totalVictories = dailyScores.reduce((s, d) => s + d.victories, 0);
    const moodDays = dailyScores.filter((d) => d.hasMood);
    const avgMood =
      moodDays.length > 0
        ? moodDays.reduce((s, d) => s + d.avgMood, 0) / moodDays.length
        : 0;

    // Best and hardest day
    const scoredDays = dailyScores.filter(
      (d) => d.checkIns > 0 || d.relapses > 0 || d.victories > 0 || d.falls > 0 || d.hasMood
    );
    const bestDay = scoredDays.length > 0
      ? scoredDays.reduce((best, d) => (d.score > best.score ? d : best), scoredDays[0])
      : null;
    const hardestDay = scoredDays.length > 0
      ? scoredDays.reduce((worst, d) => (d.score < worst.score ? d : worst), scoredDays[0])
      : null;

    // Active streak: max current streak from all habits
    const maxStreak = habits.reduce((max, h) => Math.max(max, h.currentStreak), 0);

    // Previous week comparison
    const prevCheckIns = prevWeekScores.reduce((s, d) => s + d.checkIns, 0);
    const prevRelapses = prevWeekScores.reduce((s, d) => s + d.relapses, 0);

    return {
      totalCheckIns,
      totalRelapses,
      totalVictories,
      avgMood,
      bestDay,
      hardestDay,
      maxStreak,
      prevCheckIns,
      prevRelapses,
      checkInsDelta: totalCheckIns - prevCheckIns,
      relapsesDelta: totalRelapses - prevRelapses,
    };
  }, [dailyScores, prevWeekScores, habits]);

  // Max score for bar chart scaling
  const maxScore = useMemo(
    () => Math.max(...dailyScores.map((d) => d.score), 1),
    [dailyScores]
  );

  // Motivational message based on performance
  const motivationalMessage = useMemo(() => {
    const avgScore = dailyScores.reduce((s, d) => s + d.score, 0) / 7;
    if (avgScore >= 75) return 'שבוע מדהים! אתה על גל של הצלחה, תמשיך ככה! 🌟';
    if (avgScore >= 55) return 'שבוע טוב! אתה בכיוון הנכון. כל צעד קטן חשוב 💪';
    if (avgScore >= 35) return 'שבוע מאתגר, אבל אתה עדיין כאן ונלחם. זה מה שחשוב 🌱';
    return 'שבוע קשה? זה בסדר. כל יום חדש הוא הזדמנות חדשה. אל תוותר 🤗';
  }, [dailyScores]);

  const ComparisonArrow = ({ delta, invertColors = false }: { delta: number; invertColors?: boolean }) => {
    if (delta === 0)
      return <Minus size={12} className="text-text-light" />;
    const isPositive = invertColors ? delta < 0 : delta > 0;
    return isPositive ? (
      <TrendingUp size={12} className="text-sage" />
    ) : (
      <TrendingDown size={12} className="text-coral" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Week Range Header */}
      <div className="bg-card rounded-2xl shadow-sm p-4 text-center">
        <h2 className="text-base font-bold text-text mb-1">סיכום שבועי</h2>
        <p className="text-xs text-text-light">
          {formatHebrewDate(weekStart)} - {formatHebrewDate(weekEnd)}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-3 shadow-sm"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <ComparisonArrow delta={stats.checkInsDelta} />
              <span className="text-[9px] text-text-light">
                {stats.checkInsDelta > 0 ? `+${stats.checkInsDelta}` : stats.checkInsDelta === 0 ? '=' : stats.checkInsDelta}
              </span>
            </div>
            <span className="text-[10px] text-text-light">צ׳ק-אינים</span>
          </div>
          <p className="text-xl font-bold text-sage text-left">{stats.totalCheckIns}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-xl p-3 shadow-sm"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <ComparisonArrow delta={stats.relapsesDelta} invertColors />
              <span className="text-[9px] text-text-light">
                {stats.relapsesDelta > 0 ? `+${stats.relapsesDelta}` : stats.relapsesDelta === 0 ? '=' : stats.relapsesDelta}
              </span>
            </div>
            <span className="text-[10px] text-text-light">נפילות</span>
          </div>
          <p className="text-xl font-bold text-coral text-left">{stats.totalRelapses}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-3 shadow-sm"
        >
          <span className="text-[10px] text-text-light block text-right mb-1">סטריק מקסימלי</span>
          <div className="flex items-center gap-1">
            <span className="text-lg">🔥</span>
            <p className="text-xl font-bold text-text">{stats.maxStreak}</p>
            <span className="text-[10px] text-text-light">ימים</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card rounded-xl p-3 shadow-sm"
        >
          <span className="text-[10px] text-text-light block text-right mb-1">מצב רוח ממוצע</span>
          <div className="flex items-center gap-1">
            <span className="text-lg">
              {stats.avgMood >= 4 ? '😊' : stats.avgMood >= 3 ? '😐' : stats.avgMood >= 2 ? '😕' : stats.avgMood > 0 ? '😢' : '—'}
            </span>
            <p className="text-xl font-bold text-text">
              {stats.avgMood > 0 ? stats.avgMood.toFixed(1) : '—'}
            </p>
            <span className="text-[10px] text-text-light">/5</span>
          </div>
        </motion.div>
      </div>

      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-2xl shadow-sm p-4"
      >
        <h3 className="text-xs font-semibold text-text mb-3 text-right">ביצועים יומיים</h3>
        <div className="flex items-end justify-between gap-2 h-32">
          {dailyScores.map((day, idx) => {
            const height = Math.max(8, (day.score / maxScore) * 100);
            const isToday = new Date().getDay() === idx;
            const barColor =
              day.score >= 70
                ? 'bg-sage'
                : day.score >= 45
                ? 'bg-sand'
                : day.score > 0
                ? 'bg-coral/70'
                : 'bg-cream-dark';

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-text-light font-medium">
                  {day.score > 0 ? day.score : ''}
                </span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 0.4 + idx * 0.05, duration: 0.4, ease: 'easeOut' }}
                  className={`w-full rounded-t-md ${barColor} ${
                    isToday ? 'ring-2 ring-sage/40' : ''
                  }`}
                />
                <span
                  className={`text-[10px] ${
                    isToday ? 'font-bold text-sage' : 'text-text-light'
                  }`}
                >
                  {HEBREW_DAYS_SHORT[idx]}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Best & Hardest Day */}
      <div className="grid grid-cols-2 gap-3">
        {stats.bestDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-sage/10 border border-sage/15 rounded-xl p-3"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Star size={14} className="text-sage" />
              <span className="text-[10px] font-semibold text-sage">היום הכי טוב</span>
            </div>
            <p className="text-xs font-bold text-text">
              {HEBREW_DAYS_SHORT[stats.bestDay.date.getDay()]} {formatHebrewDate(stats.bestDay.date)}
            </p>
            <p className="text-[10px] text-text-light mt-0.5">
              ציון: {stats.bestDay.score}
            </p>
          </motion.div>
        )}

        {stats.hardestDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55 }}
            className="bg-coral/10 border border-coral/15 rounded-xl p-3"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle size={14} className="text-coral" />
              <span className="text-[10px] font-semibold text-coral">היום הכי קשה</span>
            </div>
            <p className="text-xs font-bold text-text">
              {HEBREW_DAYS_SHORT[stats.hardestDay.date.getDay()]} {formatHebrewDate(stats.hardestDay.date)}
            </p>
            <p className="text-[10px] text-text-light mt-0.5">
              ציון: {stats.hardestDay.score}
            </p>
          </motion.div>
        )}
      </div>

      {/* Victories count */}
      {stats.totalVictories > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card rounded-xl shadow-sm p-3 flex items-center gap-3"
        >
          <span className="text-2xl">🏆</span>
          <div>
            <p className="text-xs font-semibold text-text">
              {stats.totalVictories} ניצחונות השבוע
            </p>
            <p className="text-[10px] text-text-light">
              כל ניצחון הוא צעד קדימה
            </p>
          </div>
        </motion.div>
      )}

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="bg-gradient-to-l from-sage/10 to-cream border border-sage/10 rounded-2xl p-4 text-center"
      >
        <p className="text-sm text-sage-dark leading-relaxed font-medium">
          {motivationalMessage}
        </p>
      </motion.div>
    </div>
  );
}
