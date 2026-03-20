import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface UrgeLog {
  id: string;
  timestamp: string;
  habitId?: string;
  urgeIntensity: number;
  trigger: string;
  overcame: boolean;
  whatItGives: string[];
  whatItCosts: string[];
  realNeed: string[];
}

export function useUrgeLog() {
  const [logs, setLogs] = useLocalStorage<UrgeLog[]>('wini-urge-logs', []);

  const today = new Date().toISOString().split('T')[0];

  const logUrge = useCallback(
    (data: Omit<UrgeLog, 'id' | 'timestamp'>) => {
      const entry: UrgeLog = {
        ...data,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      };
      setLogs((prev) => [...prev, entry]);
      return entry;
    },
    [setLogs]
  );

  const todayLogs = useMemo(() => {
    return logs.filter((l) => l.timestamp.startsWith(today));
  }, [logs, today]);

  const overcomeTodayCount = useMemo(() => {
    return todayLogs.filter((l) => l.overcame).length;
  }, [todayLogs]);

  const totalOvercome = useMemo(() => {
    return logs.filter((l) => l.overcame).length;
  }, [logs]);

  const streak = useMemo(() => {
    // Find consecutive days (going backward from today) that have at least one overcome
    const overcomeDates = new Set(
      logs
        .filter((l) => l.overcame)
        .map((l) => l.timestamp.split('T')[0])
    );

    let count = 0;
    const d = new Date();
    // Start from today
    while (true) {
      const dateStr = d.toISOString().split('T')[0];
      if (overcomeDates.has(dateStr)) {
        count++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  }, [logs]);

  return {
    logs,
    logUrge,
    todayLogs,
    overcomeTodayCount,
    totalOvercome,
    streak,
  };
}
