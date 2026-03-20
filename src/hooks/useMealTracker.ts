import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface MealEntry {
  id: string;
  date: string; // YYYY-MM-DD
  meal: MealType;
  completed: boolean;
  time?: string; // HH:MM when marked
  note?: string;
  rating?: 1 | 2 | 3; // 1=little, 2=ok, 3=good
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack1' | 'snack2';

export interface MealReminder {
  meal: MealType;
  enabled: boolean;
  time: string; // HH:MM
}

const DEFAULT_REMINDERS: MealReminder[] = [
  { meal: 'breakfast', enabled: true, time: '08:00' },
  { meal: 'snack1', enabled: true, time: '10:30' },
  { meal: 'lunch', enabled: true, time: '13:00' },
  { meal: 'snack2', enabled: true, time: '16:00' },
  { meal: 'dinner', enabled: true, time: '19:00' },
];

interface MealTrackerState {
  entries: MealEntry[];
  reminders: MealReminder[];
  dailyWaterGoal: number; // glasses
  waterLog: { date: string; count: number }[];
}

const DEFAULT_STATE: MealTrackerState = {
  entries: [],
  reminders: DEFAULT_REMINDERS,
  dailyWaterGoal: 8,
  waterLog: [],
};

export const MEAL_CONFIG: Record<MealType, { label: string; emoji: string; defaultTime: string }> = {
  breakfast: { label: 'ארוחת בוקר', emoji: '🌅', defaultTime: '08:00' },
  snack1: { label: 'חטיף בוקר', emoji: '🍎', defaultTime: '10:30' },
  lunch: { label: 'ארוחת צהריים', emoji: '☀️', defaultTime: '13:00' },
  snack2: { label: 'חטיף אחה"צ', emoji: '🥜', defaultTime: '16:00' },
  dinner: { label: 'ארוחת ערב', emoji: '🌙', defaultTime: '19:00' },
};

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function useMealTracker() {
  const [state, setState] = useLocalStorage<MealTrackerState>('wini-meals', DEFAULT_STATE);

  const today = getToday();

  const todayMeals = useMemo(() => {
    const existing = state.entries.filter(e => e.date === today);
    const mealTypes: MealType[] = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner'];
    return mealTypes.map(meal => {
      const entry = existing.find(e => e.meal === meal);
      return entry || { id: '', date: today, meal, completed: false };
    });
  }, [state.entries, today]);

  const todayCompletedCount = useMemo(() =>
    todayMeals.filter(m => m.completed).length
  , [todayMeals]);

  const todayWater = useMemo(() => {
    const entry = state.waterLog.find(w => w.date === today);
    return entry?.count || 0;
  }, [state.waterLog, today]);

  const toggleMeal = useCallback((meal: MealType, rating?: 1 | 2 | 3, note?: string) => {
    setState(prev => {
      const existing = prev.entries.find(e => e.date === today && e.meal === meal);
      if (existing?.completed) {
        // Untoggle
        return {
          ...prev,
          entries: prev.entries.filter(e => !(e.date === today && e.meal === meal)),
        };
      }
      // Mark as eaten
      const newEntry: MealEntry = {
        id: crypto.randomUUID(),
        date: today,
        meal,
        completed: true,
        time: new Date().toTimeString().slice(0, 5),
        rating,
        note,
      };
      return {
        ...prev,
        entries: [...prev.entries.filter(e => !(e.date === today && e.meal === meal)), newEntry],
      };
    });
  }, [setState, today]);

  const addWater = useCallback(() => {
    setState(prev => {
      const existing = prev.waterLog.find(w => w.date === today);
      if (existing) {
        return {
          ...prev,
          waterLog: prev.waterLog.map(w =>
            w.date === today ? { ...w, count: w.count + 1 } : w
          ),
        };
      }
      return {
        ...prev,
        waterLog: [...prev.waterLog, { date: today, count: 1 }],
      };
    });
  }, [setState, today]);

  const removeWater = useCallback(() => {
    setState(prev => {
      const existing = prev.waterLog.find(w => w.date === today);
      if (existing && existing.count > 0) {
        return {
          ...prev,
          waterLog: prev.waterLog.map(w =>
            w.date === today ? { ...w, count: Math.max(0, w.count - 1) } : w
          ),
        };
      }
      return prev;
    });
  }, [setState, today]);

  const updateReminders = useCallback((reminders: MealReminder[]) => {
    setState(prev => ({ ...prev, reminders }));
  }, [setState]);

  const setWaterGoal = useCallback((goal: number) => {
    setState(prev => ({ ...prev, dailyWaterGoal: goal }));
  }, [setState]);

  // Streak: consecutive days with 3+ meals
  const streak = useMemo(() => {
    let count = 0;
    const d = new Date();
    d.setDate(d.getDate() - 1); // start from yesterday
    while (true) {
      const dateStr = d.toISOString().split('T')[0];
      const dayMeals = state.entries.filter(e => e.date === dateStr && e.completed);
      if (dayMeals.length >= 3) {
        count++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    // Include today if 3+ meals done
    if (todayCompletedCount >= 3) count++;
    return count;
  }, [state.entries, todayCompletedCount]);

  // Weekly summary
  const weekSummary = useMemo(() => {
    const days: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = state.entries.filter(e => e.date === dateStr && e.completed).length;
      days.push({ date: dateStr, count });
    }
    return days;
  }, [state.entries]);

  return {
    todayMeals,
    todayCompletedCount,
    todayWater,
    waterGoal: state.dailyWaterGoal,
    reminders: state.reminders,
    streak,
    weekSummary,
    toggleMeal,
    addWater,
    removeWater,
    updateReminders,
    setWaterGoal,
  };
}
