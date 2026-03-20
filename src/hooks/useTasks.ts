import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  category: 'general' | 'health' | 'food' | 'exercise' | 'self-care';
  recurring?: boolean; // resets daily
}

interface TasksState {
  tasks: Task[];
  lastResetDate: string;
}

const CATEGORY_CONFIG = {
  general: { label: 'כללי', emoji: '📋' },
  health: { label: 'בריאות', emoji: '💊' },
  food: { label: 'אוכל', emoji: '🍽️' },
  exercise: { label: 'ספורט', emoji: '🏃' },
  'self-care': { label: 'טיפול עצמי', emoji: '🧘' },
};

export { CATEGORY_CONFIG as TASK_CATEGORIES };

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function useTasks() {
  const [state, setState] = useLocalStorage<TasksState>('wini-tasks', {
    tasks: [],
    lastResetDate: getToday(),
  });

  const today = getToday();

  // Auto-reset recurring tasks each day
  const tasks = useMemo(() => {
    if (state.lastResetDate !== today) {
      // Reset recurring tasks
      const updated = state.tasks.map(t =>
        t.recurring ? { ...t, completed: false, completedAt: undefined } : t
      );
      return updated;
    }
    return state.tasks;
  }, [state.tasks, state.lastResetDate, today]);

  // Sync reset
  useMemo(() => {
    if (state.lastResetDate !== today) {
      setState(prev => ({
        ...prev,
        lastResetDate: today,
        tasks: prev.tasks.map(t =>
          t.recurring ? { ...t, completed: false, completedAt: undefined } : t
        ),
      }));
    }
  }, [state.lastResetDate, today, setState]);

  const addTask = useCallback((title: string, category: Task['category'] = 'general', recurring = false) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
      category,
      recurring,
    };
    setState(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
  }, [setState]);

  const toggleTask = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t =>
        t.id === id
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined }
          : t
      ),
    }));
  }, [setState]);

  const deleteTask = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id),
    }));
  }, [setState]);

  const completedCount = useMemo(() =>
    tasks.filter(t => t.completed).length
  , [tasks]);

  const totalCount = tasks.length;

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    completedCount,
    totalCount,
  };
}
