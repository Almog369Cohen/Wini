import { useCallback } from 'react';
import type { Habit, HabitType, HabitCategory } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useHabits() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('wini-habits', []);

  const addHabit = useCallback(
    (data: {
      name: string;
      type: HabitType;
      category: HabitCategory;
      dailyCost?: number;
      triggers?: string[];
      reasons?: string[];
    }) => {
      const habit: Habit = {
        id: crypto.randomUUID(),
        name: data.name,
        type: data.type,
        category: data.category,
        startDate: new Date().toISOString(),
        dailyCost: data.dailyCost,
        triggers: data.triggers || [],
        reasons: data.reasons || [],
        currentStreak: 0,
        longestStreak: 0,
        relapses: [],
        isActive: true,
      };
      setHabits((prev) => [...prev, habit]);
      return habit;
    },
    [setHabits]
  );

  const checkIn = useCallback(
    (habitId: string) => {
      setHabits((prev) =>
        prev.map((h) => {
          if (h.id !== habitId) return h;
          const newStreak = h.currentStreak + 1;
          return {
            ...h,
            currentStreak: newStreak,
            longestStreak: Math.max(h.longestStreak, newStreak),
            lastCheckIn: new Date().toISOString(),
          };
        })
      );
    },
    [setHabits]
  );

  const relapse = useCallback(
    (habitId: string, note?: string, trigger?: string) => {
      setHabits((prev) =>
        prev.map((h) => {
          if (h.id !== habitId) return h;
          return {
            ...h,
            currentStreak: 0,
            startDate: new Date().toISOString(),
            relapses: [
              ...h.relapses,
              { date: new Date().toISOString(), note, trigger },
            ],
          };
        })
      );
    },
    [setHabits]
  );

  const deleteHabit = useCallback(
    (habitId: string) => {
      setHabits((prev) => prev.filter((h) => h.id !== habitId));
    },
    [setHabits]
  );

  const updateHabit = useCallback(
    (habitId: string, updates: Partial<Habit>) => {
      setHabits((prev) =>
        prev.map((h) => (h.id === habitId ? { ...h, ...updates } : h))
      );
    },
    [setHabits]
  );

  const getQuitHabits = useCallback(
    () => habits.filter((h) => h.type === 'quit' && h.isActive),
    [habits]
  );

  const getBuildHabits = useCallback(
    () => habits.filter((h) => h.type === 'build' && h.isActive),
    [habits]
  );

  return {
    habits,
    addHabit,
    checkIn,
    relapse,
    deleteHabit,
    updateHabit,
    getQuitHabits,
    getBuildHabits,
  };
}
