import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { MoodType, MoodEntry, MoodState } from '../types';

const DEFAULT_STATE: MoodState = {
  currentMood: 'neutral',
  currentMoods: ['neutral'],
  currentEnergy: 3,
  todayEntries: [],
  history: [],
};

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

const ENERGY_LABELS = ['', 'נמוכה מאוד', 'נמוכה', 'בינונית', 'גבוהה', 'גבוהה מאוד'];
const ENERGY_EMOJIS = ['', '🔋', '🔋🔋', '🔋🔋🔋', '⚡⚡', '⚡⚡⚡'];

export function useMood() {
  const [state, setState] = useLocalStorage<MoodState>('wini-mood', DEFAULT_STATE);

  const today = new Date().toISOString().split('T')[0];

  // Clean up today's entries (remove old days)
  const todayEntries = useMemo(() => {
    return state.todayEntries.filter(e => e.timestamp.startsWith(today));
  }, [state.todayEntries, today]);

  const setMood = useCallback((mood: MoodType, energy: number, note?: string, secondaryMoods?: MoodType[]) => {
    const allMoods = [mood, ...(secondaryMoods || [])];
    const entry: MoodEntry = {
      id: crypto.randomUUID(),
      mood,
      secondaryMoods,
      energy,
      timestamp: new Date().toISOString(),
      note,
    };

    setState(prev => ({
      ...prev,
      currentMood: mood,
      currentMoods: allMoods,
      currentEnergy: energy,
      todayEntries: [...prev.todayEntries.filter(e => e.timestamp.startsWith(today)), entry],
      history: [...prev.history.slice(-500), entry], // keep last 500
    }));
  }, [setState, today]);

  const hasCheckedInToday = useMemo(() => {
    return todayEntries.length > 0;
  }, [todayEntries]);

  const latestEntry = useMemo(() => {
    return todayEntries.length > 0 ? todayEntries[todayEntries.length - 1] : null;
  }, [todayEntries]);

  // Get mood trend for the week
  const weeklyMoodTrend = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return state.history.filter(e => new Date(e.timestamp) >= weekAgo);
  }, [state.history]);

  // Find hardest times based on mood history
  const hardestHours = useMemo(() => {
    const hourCounts: Record<number, { sad: number; anxious: number; total: number }> = {};
    state.history.forEach(e => {
      const hour = new Date(e.timestamp).getHours();
      if (!hourCounts[hour]) hourCounts[hour] = { sad: 0, anxious: 0, total: 0 };
      if (['sad', 'tired', 'exhausted', 'anxious', 'frustrated', 'lonely'].includes(e.mood)) {
        hourCounts[hour].sad++;
      }
      hourCounts[hour].total++;
    });
    return Object.entries(hourCounts)
      .filter(([, v]) => v.total >= 3)
      .sort(([, a], [, b]) => (b.sad / b.total) - (a.sad / a.total))
      .slice(0, 3)
      .map(([h]) => parseInt(h));
  }, [state.history]);

  return {
    currentMood: state.currentMood,
    currentMoods: state.currentMoods || [state.currentMood],
    currentEnergy: state.currentEnergy,
    todayEntries,
    hasCheckedInToday,
    latestEntry,
    weeklyMoodTrend,
    hardestHours,
    history: state.history,
    setMood,
    moodLabels: MOOD_LABELS,
    moodEmojis: MOOD_EMOJIS,
    energyLabels: ENERGY_LABELS,
    energyEmojis: ENERGY_EMOJIS,
  };
}
