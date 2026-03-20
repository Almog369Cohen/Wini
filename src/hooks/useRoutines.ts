import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Routine, RoutineStep, RoutineCompletion, RoutineReflection, RoutineType } from '../types';
import { ROUTINE_TEMPLATES } from '../data/routineTemplates';

interface RoutinesState {
  routines: Routine[];
  completions: RoutineCompletion[];
  reflections: RoutineReflection[];
}

const DEFAULT_STATE: RoutinesState = {
  routines: [],
  completions: [],
  reflections: [],
};

export function useRoutines() {
  const [state, setState] = useLocalStorage<RoutinesState>('wini-routines', DEFAULT_STATE);

  const today = new Date().toISOString().split('T')[0];

  const addRoutine = useCallback((name: string, type: RoutineType, emoji: string, steps: RoutineStep[]) => {
    const routine: Routine = {
      id: crypto.randomUUID(),
      name,
      type,
      emoji,
      steps,
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, routines: [...prev.routines, routine] }));
    return routine;
  }, [setState]);

  const addFromTemplate = useCallback((templateId: string) => {
    const template = ROUTINE_TEMPLATES.find(t => t.id === templateId);
    if (!template) return null;
    const routine: Routine = {
      ...template,
      id: crypto.randomUUID(),
      isTemplate: false,
      createdAt: new Date().toISOString(),
      steps: template.steps.map(s => ({ ...s, id: crypto.randomUUID() })),
    };
    setState(prev => ({ ...prev, routines: [...prev.routines, routine] }));
    return routine;
  }, [setState]);

  const updateRoutine = useCallback((id: string, updates: Partial<Pick<Routine, 'name' | 'emoji' | 'steps'>>) => {
    setState(prev => ({
      ...prev,
      routines: prev.routines.map(r => r.id === id ? { ...r, ...updates } : r),
    }));
  }, [setState]);

  const deleteRoutine = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      routines: prev.routines.filter(r => r.id !== id),
      completions: prev.completions.filter(c => c.routineId !== id),
    }));
  }, [setState]);

  const toggleStep = useCallback((routineId: string, stepId: string) => {
    setState(prev => {
      const existing = prev.completions.find(c => c.routineId === routineId && c.date === today);
      if (existing) {
        const hasStep = existing.completedSteps.includes(stepId);
        return {
          ...prev,
          completions: prev.completions.map(c =>
            c.routineId === routineId && c.date === today
              ? {
                  ...c,
                  completedSteps: hasStep
                    ? c.completedSteps.filter(s => s !== stepId)
                    : [...c.completedSteps, stepId],
                  completedAt: new Date().toISOString(),
                }
              : c
          ),
        };
      }
      return {
        ...prev,
        completions: [...prev.completions, {
          routineId,
          date: today,
          completedSteps: [stepId],
          completedAt: new Date().toISOString(),
        }],
      };
    });
  }, [setState, today]);

  const addReflection = useCallback((whatWorks: string, whatToChange: string, newIdea?: string) => {
    const reflection: RoutineReflection = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      whatWorks,
      whatToChange,
      newIdea,
    };
    setState(prev => ({
      ...prev,
      reflections: [...prev.reflections.slice(-50), reflection],
    }));
    return reflection;
  }, [setState]);

  const getTodayCompletion = useCallback((routineId: string) => {
    return state.completions.find(c => c.routineId === routineId && c.date === today);
  }, [state.completions, today]);

  const getCompletionStreak = useCallback((routineId: string) => {
    const routine = state.routines.find(r => r.id === routineId);
    if (!routine) return 0;

    let streak = 0;
    const d = new Date();
    // Check from yesterday backwards (today might still be in progress)
    d.setDate(d.getDate() - 1);

    for (let i = 0; i < 365; i++) {
      const dateStr = d.toISOString().split('T')[0];
      const completion = state.completions.find(c => c.routineId === routineId && c.date === dateStr);
      if (completion && completion.completedSteps.length >= routine.steps.length * 0.5) {
        streak++;
      } else {
        break;
      }
      d.setDate(d.getDate() - 1);
    }

    // Check if today is also completed
    const todayCompletion = getTodayCompletion(routineId);
    if (todayCompletion && routine && todayCompletion.completedSteps.length >= routine.steps.length * 0.5) {
      streak++;
    }

    return streak;
  }, [state.routines, state.completions, getTodayCompletion]);

  const templates = ROUTINE_TEMPLATES;

  const routinesByType = useMemo(() => {
    const grouped: Record<RoutineType, Routine[]> = {
      morning: [],
      night: [],
      crisis: [],
      motivation: [],
      energy: [],
      calm: [],
      focus: [],
      social: [],
      growth: [],
      body: [],
      custom: [],
    };
    state.routines.forEach(r => {
      grouped[r.type].push(r);
    });
    return grouped;
  }, [state.routines]);

  return {
    routines: state.routines,
    routinesByType,
    completions: state.completions,
    reflections: state.reflections,
    templates,
    addRoutine,
    addFromTemplate,
    updateRoutine,
    deleteRoutine,
    toggleStep,
    addReflection,
    getTodayCompletion,
    getCompletionStreak,
  };
}
