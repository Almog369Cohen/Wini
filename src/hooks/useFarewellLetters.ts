import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { FarewellLetter } from '../types';

export function useFarewellLetters() {
  const [letters, setLetters] = useLocalStorage<FarewellLetter[]>('wini-farewell-letters', []);

  const startLetter = useCallback((habitId: string, habitName: string): FarewellLetter => {
    const letter: FarewellLetter = {
      id: crypto.randomUUID(),
      habitId,
      habitName,
      createdAt: new Date().toISOString(),
      moments: [],
      needs: [],
      thankYou: '',
      costs: [],
      missedMoments: '',
      letterText: '',
      newResponses: [],
      mantra: '',
      isComplete: false,
    };
    setLetters(prev => [letter, ...prev]);
    return letter;
  }, [setLetters]);

  const updateLetter = useCallback((id: string, updates: Partial<FarewellLetter>) => {
    setLetters(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  }, [setLetters]);

  const completeLetter = useCallback((id: string) => {
    setLetters(prev => prev.map(l =>
      l.id === id ? { ...l, isComplete: true, completedAt: new Date().toISOString() } : l
    ));
  }, [setLetters]);

  const getLetterForHabit = useCallback((habitId: string) => {
    return letters.find(l => l.habitId === habitId);
  }, [letters]);

  const deleteLetter = useCallback((id: string) => {
    setLetters(prev => prev.filter(l => l.id !== id));
  }, [setLetters]);

  return {
    letters,
    startLetter,
    updateLetter,
    completeLetter,
    getLetterForHabit,
    deleteLetter,
  };
}
