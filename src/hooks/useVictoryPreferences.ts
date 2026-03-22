import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { VictoryPreferences, PersonalVictory, CelebrationVisual, CelebrationSound, CelebrationIntensity } from '../types';

const DEFAULT_VICTORIES: PersonalVictory[] = [
  { id: 'resist-urge', label: 'עמדתי בדחף', emoji: '🦁', description: 'הרגשתי דחף ולא נכנעתי' },
  { id: 'full-day', label: 'יום נקי שלם', emoji: '⭐', description: 'עברתי יום שלם בלי ליפול' },
  { id: 'checkin', label: 'צ\'ק-אין להרגל', emoji: '✅', description: 'עשיתי את מה שהתחייבתי' },
  { id: 'helped-self', label: 'עזרתי לעצמי', emoji: '🧘', description: 'עשיתי פעולה מודעת של טיפול עצמי' },
  { id: 'asked-help', label: 'ביקשתי עזרה', emoji: '🤝', description: 'פניתי למישהו כשהיה לי קשה' },
  { id: 'recognized', label: 'זיהיתי טריגר', emoji: '🔍', description: 'שמתי לב לטריגר לפני שנפלתי' },
];

const DEFAULT_PREFERENCES: VictoryPreferences = {
  personalVictories: DEFAULT_VICTORIES,
  mantra: '',
  celebrationVisual: 'confetti',
  celebrationSound: 'ding',
  celebrationIntensity: 'medium',
  dailyGoal: 5,
  setupDone: false,
};

export function useVictoryPreferences() {
  const [preferences, setPreferences] = useLocalStorage<VictoryPreferences>(
    'wini-victory-preferences',
    DEFAULT_PREFERENCES
  );

  const updatePreferences = useCallback(
    (updates: Partial<VictoryPreferences>) => {
      setPreferences((prev) => ({ ...prev, ...updates }));
    },
    [setPreferences]
  );

  const addPersonalVictory = useCallback(
    (victory: PersonalVictory) => {
      setPreferences((prev) => ({
        ...prev,
        personalVictories: [...prev.personalVictories, { ...victory, isCustom: true }],
      }));
    },
    [setPreferences]
  );

  const removePersonalVictory = useCallback(
    (id: string) => {
      setPreferences((prev) => ({
        ...prev,
        personalVictories: prev.personalVictories.filter((v) => v.id !== id),
      }));
    },
    [setPreferences]
  );

  const toggleVictory = useCallback(
    (id: string) => {
      setPreferences((prev) => {
        const exists = prev.personalVictories.some((v) => v.id === id);
        if (exists) {
          return {
            ...prev,
            personalVictories: prev.personalVictories.filter((v) => v.id !== id),
          };
        }
        const defaultVictory = DEFAULT_VICTORIES.find((v) => v.id === id);
        if (defaultVictory) {
          return {
            ...prev,
            personalVictories: [...prev.personalVictories, defaultVictory],
          };
        }
        return prev;
      });
    },
    [setPreferences]
  );

  const setMantra = useCallback(
    (mantra: string) => {
      setPreferences((prev) => ({ ...prev, mantra }));
    },
    [setPreferences]
  );

  const setVisual = useCallback(
    (celebrationVisual: CelebrationVisual) => {
      setPreferences((prev) => ({ ...prev, celebrationVisual }));
    },
    [setPreferences]
  );

  const setSound = useCallback(
    (celebrationSound: CelebrationSound) => {
      setPreferences((prev) => ({ ...prev, celebrationSound }));
    },
    [setPreferences]
  );

  const setIntensity = useCallback(
    (celebrationIntensity: CelebrationIntensity) => {
      setPreferences((prev) => ({ ...prev, celebrationIntensity }));
    },
    [setPreferences]
  );

  const setDailyGoal = useCallback(
    (dailyGoal: number) => {
      setPreferences((prev) => ({ ...prev, dailyGoal }));
    },
    [setPreferences]
  );

  const completeSetup = useCallback(() => {
    setPreferences((prev) => ({ ...prev, setupDone: true }));
  }, [setPreferences]);

  return {
    preferences,
    updatePreferences,
    addPersonalVictory,
    removePersonalVictory,
    toggleVictory,
    setMantra,
    setVisual,
    setSound,
    setIntensity,
    setDailyGoal,
    completeSetup,
    defaultVictories: DEFAULT_VICTORIES,
  };
}
