import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import type { Habit, JournalEntry, MoodEntry, MoodType } from '../../types';
import WeeklyReport from './WeeklyReport';

interface CalendarPageProps {
  habits: Habit[];
  journalEntries: JournalEntry[];
  moodHistory: MoodEntry[];
}

const HEBREW_MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];

const HEBREW_DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const HEBREW_DAYS_SHORT = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];

const MOOD_LABELS: Record<MoodType, string> = {
  sad: 'עצוב',
  tired: 'עייף',
  exhausted: 'תשוש',
  anxious: 'חרד',
  irritable: 'עצבני',
  energetic: 'מלא אנרגיה',
  happy: 'שמח',
  calm: 'רגוע',
  frustrated: 'מתוסכל',
  lonely: 'בודד',
  hopeful: 'מלא תקווה',
  neutral: 'ניטרלי',
};

const MOOD_EMOJIS: Record<MoodType, string> = {
  sad: '😢',
  tired: '😴',
  exhausted: '🥱',
  anxious: '😰',
  irritable: '😤',
  energetic: '⚡',
  happy: '😊',
  calm: '🧘',
  frustrated: '😣',
  lonely: '🫂',
  hopeful: '🌅',
  neutral: '😐',
};

const POSITIVE_MOODS: MoodType[] = ['happy', 'calm', 'energetic', 'hopeful'];

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

interface DayData {
  checkIns: { habitName: string; habitType: string }[];
  relapses: { habitName: string; note?: string; trigger?: string }[];
  journalEntries: JournalEntry[];
  moods: MoodEntry[];
}

export default function CalendarPage({ habits, journalEntries, moodHistory }: CalendarPageProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);

  // Build a map of date -> day data
  const dayDataMap = useMemo(() => {
    const map = new Map<string, DayData>();

    const getOrCreate = (key: string): DayData => {
      if (!map.has(key)) {
        map.set(key, { checkIns: [], relapses: [], journalEntries: [], moods: [] });
      }
      return map.get(key)!;
    };

    // Process habits - check-ins and relapses
    habits.forEach((habit) => {
      // lastCheckIn is a single date, add it
      if (habit.lastCheckIn) {
        const key = toDateKey(new Date(habit.lastCheckIn));
        getOrCreate(key).checkIns.push({ habitName: habit.name, habitType: habit.type });
      }

      // Relapses have dates
      habit.relapses.forEach((r) => {
        const key = toDateKey(new Date(r.date));
        getOrCreate(key).relapses.push({
          habitName: habit.name,
          note: r.note,
          trigger: r.trigger,
        });
      });
    });

    // Process journal entries
    journalEntries.forEach((entry) => {
      const key = toDateKey(new Date(entry.date));
      getOrCreate(key).journalEntries.push(entry);
    });

    // Process mood history
    moodHistory.forEach((entry) => {
      const key = toDateKey(new Date(entry.timestamp));
      getOrCreate(key).moods.push(entry);
    });

    return map;
  }, [habits, journalEntries, moodHistory]);

  // Get calendar grid data
  const calendarGrid = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDayOfWeek = firstDay.getDay(); // 0 = Sunday
    const totalDays = lastDay.getDate();

    const grid: (Date | null)[] = [];

    // Fill empty cells before the 1st
    for (let i = 0; i < startDayOfWeek; i++) {
      grid.push(null);
    }

    // Fill actual days
    for (let d = 1; d <= totalDays; d++) {
      grid.push(new Date(currentYear, currentMonth, d));
    }

    // Fill remaining cells to complete the last row
    while (grid.length % 7 !== 0) {
      grid.push(null);
    }

    return grid;
  }, [currentMonth, currentYear]);

  const navigateMonth = useCallback((delta: number) => {
    setSelectedDate(null);
    const newDate = new Date(currentYear, currentMonth + delta, 1);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  }, [currentMonth, currentYear]);

  const getDayPerformance = useCallback((date: Date): 'great' | 'good' | 'neutral' | 'bad' | 'none' => {
    const key = toDateKey(date);
    const data = dayDataMap.get(key);
    if (!data) return 'none';

    const hasCheckIns = data.checkIns.length > 0;
    const hasRelapses = data.relapses.length > 0;
    const victories = data.journalEntries.filter(e => e.type === 'victory').length;
    const falls = data.journalEntries.filter(e => e.type === 'fall').length;
    const positiveMoods = data.moods.filter(m => POSITIVE_MOODS.includes(m.mood)).length;

    if (hasRelapses || falls > victories) return 'bad';
    if (hasCheckIns && victories > 0 && positiveMoods > 0) return 'great';
    if (hasCheckIns || victories > 0) return 'good';
    if (data.moods.length > 0 || data.journalEntries.length > 0) return 'neutral';
    return 'none';
  }, [dayDataMap]);

  const performanceBg: Record<string, string> = {
    great: 'bg-sage/20 border-sage/30',
    good: 'bg-sage/10 border-sage/15',
    neutral: 'bg-sand/10 border-sand/15',
    bad: 'bg-coral/10 border-coral/15',
    none: 'bg-transparent border-transparent',
  };

  const selectedDayData = useMemo(() => {
    if (!selectedDate) return null;
    return dayDataMap.get(toDateKey(selectedDate)) || null;
  }, [selectedDate, dayDataMap]);

  const isToday = useCallback((date: Date) => isSameDay(date, today), [today]);

  return (
    <motion.div
      key="calendar"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 pt-6 pb-8 max-w-lg mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="w-8" />
        <h1 className="text-xl font-bold text-text">לוח שנה</h1>
        <div className="w-8" />
      </div>

      {/* Weekly Report Toggle */}
      <button
        onClick={() => setShowWeeklyReport(!showWeeklyReport)}
        className="w-full bg-gradient-to-l from-sage/15 to-sage/5 border border-sage/20 rounded-xl p-3 mb-4 flex items-center justify-between"
      >
        <ChevronLeft size={16} className="text-sage" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-sage">
            {showWeeklyReport ? 'חזרה ללוח שנה' : 'דוח שבועי'}
          </span>
          <span className="text-lg">📊</span>
        </div>
      </button>

      <AnimatePresence mode="wait">
        {showWeeklyReport ? (
          <motion.div
            key="weekly-report"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <WeeklyReport
              habits={habits}
              journalEntries={journalEntries}
              moodHistory={moodHistory}
            />
          </motion.div>
        ) : (
          <motion.div
            key="calendar-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Month Navigation */}
            <div className="bg-card rounded-2xl shadow-sm p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateMonth(1)}
                  className="w-11 h-11 rounded-full bg-cream flex items-center justify-center text-text-light hover:text-sage transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
                <h2 className="text-lg font-bold text-text">
                  {HEBREW_MONTHS[currentMonth]} {currentYear}
                </h2>
                <button
                  onClick={() => navigateMonth(-1)}
                  className="w-11 h-11 rounded-full bg-cream flex items-center justify-center text-text-light hover:text-sage transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {HEBREW_DAYS_SHORT.map((day) => (
                  <div
                    key={day}
                    className="text-center text-[10px] font-medium text-text-light py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarGrid.map((date, idx) => {
                  if (!date) {
                    return <div key={`empty-${idx}`} className="aspect-square" />;
                  }

                  const key = toDateKey(date);
                  const data = dayDataMap.get(key);
                  const performance = getDayPerformance(date);
                  const selected = selectedDate && isSameDay(date, selectedDate);
                  const todayDate = isToday(date);
                  const isFuture = date > today;

                  return (
                    <motion.button
                      key={key}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => !isFuture && setSelectedDate(selected ? null : date)}
                      disabled={isFuture}
                      className={`aspect-square rounded-lg border flex flex-col items-center justify-center relative transition-all duration-200 ${
                        isFuture
                          ? 'opacity-30 cursor-default'
                          : 'cursor-pointer'
                      } ${
                        selected
                          ? 'ring-2 ring-sage border-sage bg-sage/15 scale-105'
                          : performanceBg[performance]
                      } ${
                        todayDate && !selected
                          ? 'ring-2 ring-sage/40'
                          : ''
                      }`}
                    >
                      <span
                        className={`text-xs font-medium ${
                          todayDate
                            ? 'text-sage font-bold'
                            : selected
                            ? 'text-sage-dark font-bold'
                            : 'text-text'
                        }`}
                      >
                        {date.getDate()}
                      </span>

                      {/* Indicator dots */}
                      {data && !isFuture && (
                        <div className="flex gap-[2px] mt-0.5">
                          {data.checkIns.length > 0 && (
                            <div className="w-1 h-1 rounded-full bg-sage" />
                          )}
                          {data.relapses.length > 0 && (
                            <div className="w-1 h-1 rounded-full bg-coral" />
                          )}
                          {data.journalEntries.length > 0 && (
                            <div className="w-1 h-1 rounded-full bg-sea" />
                          )}
                          {data.moods.length > 0 && (
                            <div className="w-1 h-1 rounded-full bg-sand" />
                          )}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-sage" />
                  <span className="text-[9px] text-text-light">צ׳ק-אין</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-coral" />
                  <span className="text-[9px] text-text-light">נפילה</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-sea" />
                  <span className="text-[9px] text-text-light">יומן</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-sand" />
                  <span className="text-[9px] text-text-light">מצב רוח</span>
                </div>
              </div>
            </div>

            {/* Selected Day Detail Panel */}
            <AnimatePresence>
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-card rounded-2xl shadow-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                      <button
                        onClick={() => setSelectedDate(null)}
                        className="w-6 h-6 rounded-full bg-cream flex items-center justify-center text-text-light hover:text-coral transition-colors"
                      >
                        <X size={14} />
                      </button>
                      <h3 className="text-sm font-bold text-text">
                        {HEBREW_DAYS[selectedDate.getDay()]}, {selectedDate.getDate()} {HEBREW_MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                      </h3>
                    </div>

                    {!selectedDayData ? (
                      <div className="text-center py-6">
                        <span className="text-3xl mb-2 block">📭</span>
                        <p className="text-xs text-text-light">אין נתונים ליום זה</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Check-ins */}
                        {selectedDayData.checkIns.length > 0 && (
                          <div className="bg-sage/5 rounded-xl p-3">
                            <div className="flex items-center gap-1.5 mb-2">
                              <div className="w-2 h-2 rounded-full bg-sage" />
                              <span className="text-xs font-semibold text-sage">
                                צ׳ק-אין ({selectedDayData.checkIns.length})
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedDayData.checkIns.map((ci, i) => (
                                <span
                                  key={i}
                                  className="text-[11px] bg-sage/10 text-sage-dark px-2 py-0.5 rounded-full"
                                >
                                  {ci.habitName}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Relapses */}
                        {selectedDayData.relapses.length > 0 && (
                          <div className="bg-coral/5 rounded-xl p-3">
                            <div className="flex items-center gap-1.5 mb-2">
                              <div className="w-2 h-2 rounded-full bg-coral" />
                              <span className="text-xs font-semibold text-coral">
                                נפילות ({selectedDayData.relapses.length})
                              </span>
                            </div>
                            {selectedDayData.relapses.map((r, i) => (
                              <div key={i} className="mb-1 last:mb-0">
                                <span className="text-[11px] text-text font-medium">
                                  {r.habitName}
                                </span>
                                {r.trigger && (
                                  <span className="text-[10px] text-text-light mr-1">
                                    | טריגר: {r.trigger}
                                  </span>
                                )}
                                {r.note && (
                                  <p className="text-[10px] text-text-light mt-0.5">
                                    {r.note}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Mood */}
                        {selectedDayData.moods.length > 0 && (
                          <div className="bg-sand/5 rounded-xl p-3">
                            <div className="flex items-center gap-1.5 mb-2">
                              <div className="w-2 h-2 rounded-full bg-sand" />
                              <span className="text-xs font-semibold text-sand">
                                מצב רוח
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {selectedDayData.moods.map((m, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-1 bg-sand/10 rounded-lg px-2 py-1"
                                >
                                  <span className="text-sm">
                                    {MOOD_EMOJIS[m.mood]}
                                  </span>
                                  <span className="text-[10px] text-text">
                                    {MOOD_LABELS[m.mood]}
                                  </span>
                                  <span className="text-[9px] text-text-light">
                                    (אנרגיה: {m.energy}/5)
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Journal entries */}
                        {selectedDayData.journalEntries.length > 0 && (
                          <div className="bg-sea/10 rounded-xl p-3">
                            <div className="flex items-center gap-1.5 mb-2">
                              <div className="w-2 h-2 rounded-full bg-sea" />
                              <span className="text-xs font-semibold text-sea">
                                יומן ({selectedDayData.journalEntries.length})
                              </span>
                            </div>
                            {selectedDayData.journalEntries.map((entry, i) => (
                              <div
                                key={i}
                                className={`mb-2 last:mb-0 border-r-2 pr-2 ${
                                  entry.type === 'victory'
                                    ? 'border-sage'
                                    : 'border-coral'
                                }`}
                              >
                                <div className="flex items-center gap-1 mb-0.5">
                                  <span className="text-[10px]">
                                    {entry.type === 'victory' ? '🏆' : '📝'}
                                  </span>
                                  <span
                                    className={`text-[10px] font-medium ${
                                      entry.type === 'victory'
                                        ? 'text-sage'
                                        : 'text-coral'
                                    }`}
                                  >
                                    {entry.type === 'victory' ? 'ניצחון' : 'נפילה'}
                                  </span>
                                </div>
                                {entry.note && (
                                  <p className="text-[11px] text-text-light line-clamp-2">
                                    {entry.note}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
