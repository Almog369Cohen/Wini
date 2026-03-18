import { useCallback, useMemo } from 'react';
import type { JournalEntry, MomentType, WithdrawalSymptom, HourlyStats } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useJournal() {
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>('wini-journal', []);

  const addEntry = useCallback(
    (data: {
      type: MomentType;
      mood: number;
      cravingIntensity: number;
      note: string;
      triggers?: string[];
      whatHelped?: string;
      habitId?: string;
      symptoms?: WithdrawalSymptom[];
    }) => {
      const entry: JournalEntry = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        type: data.type,
        mood: data.mood,
        cravingIntensity: data.cravingIntensity,
        note: data.note,
        triggers: data.triggers || [],
        whatHelped: data.whatHelped || '',
        habitId: data.habitId,
        symptoms: data.symptoms,
      };
      setEntries((prev) => [entry, ...prev]);
      return entry;
    },
    [setEntries]
  );

  const getTodayEntries = useCallback(() => {
    const today = new Date().toDateString();
    return entries.filter((e) => new Date(e.date).toDateString() === today);
  }, [entries]);

  const getRecentEntries = useCallback(
    (days: number = 7) => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      return entries.filter((e) => new Date(e.date) >= cutoff);
    },
    [entries]
  );

  const hourlyStats = useMemo((): HourlyStats[] => {
    const stats: HourlyStats[] = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      falls: 0,
      victories: 0,
    }));
    entries.forEach((e) => {
      const hour = new Date(e.date).getHours();
      if (e.type === 'fall') stats[hour].falls++;
      else stats[hour].victories++;
    });
    return stats;
  }, [entries]);

  const hardHours = useMemo(() => {
    return [...hourlyStats]
      .filter((s) => s.falls > 0)
      .sort((a, b) => b.falls - a.falls)
      .slice(0, 3)
      .map((s) => s.hour);
  }, [hourlyStats]);

  const strongHours = useMemo(() => {
    return [...hourlyStats]
      .filter((s) => s.victories > 0)
      .sort((a, b) => b.victories - a.victories)
      .slice(0, 3)
      .map((s) => s.hour);
  }, [hourlyStats]);

  const insights = useMemo(() => {
    const tips: string[] = [];
    if (entries.length < 3) {
      tips.push('תעד רגעים של נפילה וניצחון כדי שנוכל לזהות דפוסים');
      return tips;
    }

    // Hard hours tip
    if (hardHours.length > 0) {
      const hardRange = hardHours.map((h) => `${h}:00`).join(', ');
      tips.push(`השעות הקשות ביותר שלך: ${hardRange}. הכן את עצמך מראש בזמנים האלה`);
    }

    // Strong hours tip
    if (strongHours.length > 0) {
      const strongRange = strongHours.map((h) => `${h}:00`).join(', ');
      tips.push(`אתה הכי חזק בשעות ${strongRange}. נצל את הכוח הזה!`);
    }

    // Trend analysis - last 7 days vs previous 7
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 86400000);

    const thisWeekFalls = entries.filter(
      (e) => e.type === 'fall' && new Date(e.date) >= weekAgo
    ).length;
    const lastWeekFalls = entries.filter(
      (e) =>
        e.type === 'fall' &&
        new Date(e.date) >= twoWeeksAgo &&
        new Date(e.date) < weekAgo
    ).length;

    if (lastWeekFalls > 0 && thisWeekFalls < lastWeekFalls) {
      const pct = Math.round(((lastWeekFalls - thisWeekFalls) / lastWeekFalls) * 100);
      tips.push(`הנפילות ירדו ב-${pct}% בשבוע האחרון. אתה מתקדם!`);
    }

    // Most common trigger
    const triggerCounts = new Map<string, number>();
    entries
      .filter((e) => e.type === 'fall')
      .forEach((e) => {
        e.triggers.forEach((t) => {
          triggerCounts.set(t, (triggerCounts.get(t) || 0) + 1);
        });
      });

    if (triggerCounts.size > 0) {
      const topTrigger = [...triggerCounts.entries()].sort((a, b) => b[1] - a[1])[0];
      tips.push(`הטריגר הנפוץ ביותר שלך: "${topTrigger[0]}". נסה להיערך מראש`);
    }

    // Victory ratio
    const totalFalls = entries.filter((e) => e.type === 'fall').length;
    const totalVictories = entries.filter((e) => e.type === 'victory').length;
    if (totalVictories > totalFalls) {
      tips.push(`${totalVictories} ניצחונות מול ${totalFalls} נפילות. אתה מנצח!`);
    }

    return tips;
  }, [entries, hardHours, strongHours]);

  const todaySummary = useMemo(() => {
    const todayEntries = getTodayEntries();
    return {
      falls: todayEntries.filter((e) => e.type === 'fall').length,
      victories: todayEntries.filter((e) => e.type === 'victory').length,
      total: todayEntries.length,
    };
  }, [getTodayEntries]);

  return {
    entries,
    addEntry,
    getTodayEntries,
    getRecentEntries,
    hourlyStats,
    hardHours,
    strongHours,
    insights,
    todaySummary,
  };
}
