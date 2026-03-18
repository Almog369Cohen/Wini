import { useCallback } from 'react';
import type { Reflection, LetterToSelf, InnerSpaceData } from '../types';
import { useLocalStorage } from './useLocalStorage';

const defaultData: InnerSpaceData = {
  reflections: [],
  emotionalNeeds: [],
  needNotes: {},
  letters: [],
  journeyStage: 0,
};

export function useInnerSpace() {
  const [data, setData] = useLocalStorage<InnerSpaceData>('wini-innerspace', defaultData);

  const addReflection = useCallback(
    (promptId: string, answer: string) => {
      const reflection: Reflection = {
        id: crypto.randomUUID(),
        promptId,
        answer,
        date: new Date().toISOString(),
      };
      setData((prev) => ({
        ...prev,
        reflections: [reflection, ...prev.reflections],
      }));
    },
    [setData]
  );

  const toggleNeed = useCallback(
    (needId: string) => {
      setData((prev) => {
        const needs = prev.emotionalNeeds.includes(needId)
          ? prev.emotionalNeeds.filter((n) => n !== needId)
          : [...prev.emotionalNeeds, needId];
        return { ...prev, emotionalNeeds: needs };
      });
    },
    [setData]
  );

  const setNeedNote = useCallback(
    (needId: string, note: string) => {
      setData((prev) => ({
        ...prev,
        needNotes: { ...prev.needNotes, [needId]: note },
      }));
    },
    [setData]
  );

  const addLetter = useCallback(
    (content: string, type: 'past' | 'future', openDate?: string) => {
      const letter: LetterToSelf = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        content,
        type,
        openDate,
      };
      setData((prev) => ({
        ...prev,
        letters: [letter, ...prev.letters],
      }));
    },
    [setData]
  );

  const setJourneyStage = useCallback(
    (stage: number) => {
      setData((prev) => ({ ...prev, journeyStage: stage }));
    },
    [setData]
  );

  return {
    data,
    addReflection,
    toggleNeed,
    setNeedNote,
    addLetter,
    setJourneyStage,
  };
}
