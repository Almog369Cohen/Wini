import { useCallback, useMemo } from 'react';
import type { DopamineLog } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useDopamine() {
  const [logs, setLogs] = useLocalStorage<DopamineLog[]>('wini-dopamine', []);

  const logActivity = useCallback(
    (title: string, icon: string, custom = false) => {
      const log: DopamineLog = {
        id: crypto.randomUUID(),
        activityTitle: title,
        activityIcon: icon,
        date: new Date().toISOString(),
        customActivity: custom || undefined,
      };
      setLogs((prev) => [log, ...prev]);
      return log;
    },
    [setLogs]
  );

  const todayLogs = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return logs.filter((l) => l.date.split('T')[0] === today);
  }, [logs]);

  const todayCount = todayLogs.length;

  const streak = useMemo(() => {
    if (logs.length === 0) return 0;
    let count = 0;
    const now = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(now);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasLog = logs.some((l) => l.date.split('T')[0] === dateStr);
      if (hasLog) count++;
      else if (i > 0) break; // allow today to be empty
    }
    return count;
  }, [logs]);

  const weeklyStats = useMemo(() => {
    const stats: Record<string, number> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      stats[key] = logs.filter((l) => l.date.split('T')[0] === key).length;
    }
    return stats;
  }, [logs]);

  const dailyGoal = 5;
  const goalProgress = Math.min(1, todayCount / dailyGoal);

  return {
    logs,
    todayLogs,
    todayCount,
    streak,
    weeklyStats,
    dailyGoal,
    goalProgress,
    logActivity,
  };
}
