import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

// ─── Types ──────────────────────────────────────────────────────────

export interface VictoryEvent {
  tier: 1 | 2 | 3;
  message: string;
  subMessage?: string;
  emoji?: string;
}

interface VictoryLog {
  date: string; // YYYY-MM-DD
  count: number;
}

// ─── Streak Milestone helpers ───────────────────────────────────────

const STREAK_MILESTONES_TIER2 = [7, 14, 30];
const STREAK_MILESTONES_TIER3 = [60, 90, 100, 365];
const ALL_MILESTONES = [...STREAK_MILESTONES_TIER2, ...STREAK_MILESTONES_TIER3];

function isStreakMilestone(days: number): boolean {
  return ALL_MILESTONES.includes(days);
}

function getStreakTier(days: number): 1 | 2 | 3 {
  if (STREAK_MILESTONES_TIER3.includes(days)) return 3;
  if (STREAK_MILESTONES_TIER2.includes(days)) return 2;
  return 1;
}

function getStreakEmoji(days: number): string {
  if (days >= 365) return '👑';
  if (days >= 100) return '💎';
  if (days >= 60) return '⭐';
  if (days >= 30) return '🔥';
  if (days >= 14) return '💪';
  return '🎯';
}

// ─── Today helper ───────────────────────────────────────────────────

function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

// ─── Hook ───────────────────────────────────────────────────────────

export function useVictoryRewards() {
  const [queue, setQueue] = useState<VictoryEvent[]>([]);
  const [currentVictory, setCurrentVictory] = useState<VictoryEvent | null>(null);
  const isShowing = useRef(false);

  // Persist daily victory count
  const [victoryLogs, setVictoryLogs] = useLocalStorage<VictoryLog[]>('wini-victory-logs', []);

  const todayLog = victoryLogs.find(l => l.date === todayKey());
  const todayCount = todayLog?.count ?? 0;

  const incrementTodayCount = useCallback(() => {
    const key = todayKey();
    setVictoryLogs(prev => {
      const existing = prev.find(l => l.date === key);
      if (existing) {
        return prev.map(l => l.date === key ? { ...l, count: l.count + 1 } : l);
      }
      // Keep only the last 30 days of logs
      const recent = prev.filter(l => {
        const d = new Date(l.date);
        const daysAgo = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
        return daysAgo < 30;
      });
      return [...recent, { date: key, count: 1 }];
    });
  }, [setVictoryLogs]);

  // Process queue
  useEffect(() => {
    if (queue.length > 0 && !isShowing.current) {
      isShowing.current = true;
      const next = queue[0];
      setCurrentVictory(next);
      setQueue(prev => prev.slice(1));
    }
  }, [queue]);

  const triggerVictory = useCallback((event: VictoryEvent) => {
    incrementTodayCount();
    if (isShowing.current) {
      setQueue(prev => [...prev, event]);
    } else {
      isShowing.current = true;
      setCurrentVictory(event);
    }
  }, [incrementTodayCount]);

  const dismissVictory = useCallback(() => {
    isShowing.current = false;
    setCurrentVictory(null);
    // If there are more in queue, pick next on next tick
    setTimeout(() => {
      setQueue(prev => {
        if (prev.length > 0) {
          isShowing.current = true;
          setCurrentVictory(prev[0]);
          return prev.slice(1);
        }
        return prev;
      });
    }, 300);
  }, []);

  // ─── Helper functions ─────────────────────────────────────────────

  const celebrateCheckIn = useCallback((habitName: string, streak: number) => {
    const newStreak = streak + 1; // streak after check-in

    if (isStreakMilestone(newStreak)) {
      // Streak milestone - use celebrateStreak for it
      const tier = getStreakTier(newStreak);
      const emoji = getStreakEmoji(newStreak);
      triggerVictory({
        tier,
        message: tier === 3 ? `${newStreak} ימים! אגדה!` : `${newStreak} ימים רצופים!`,
        subMessage: `${habitName} - streak מטורף 🔥`,
        emoji,
      });
    } else {
      // Regular check-in
      triggerVictory({
        tier: 1,
        message: `נהדר! +1 ניצחון`,
        subMessage: habitName,
        emoji: '✅',
      });
    }
  }, [triggerVictory]);

  const celebrateUrgeOvercome = useCallback((habitName: string) => {
    triggerVictory({
      tier: 2,
      message: 'התגברת על הדחף!',
      subMessage: `${habitName} - גיבור אמיתי`,
      emoji: '🦁',
    });
  }, [triggerVictory]);

  const celebrateChallenge = useCallback((isAllDone: boolean) => {
    if (isAllDone) {
      triggerVictory({
        tier: 3,
        message: 'כל האתגרים הושלמו!',
        subMessage: 'יום מושלם 🏆',
        emoji: '🏆',
      });
    } else {
      triggerVictory({
        tier: 1,
        message: 'אתגר הושלם!',
        subMessage: '+10 XP',
        emoji: '🎯',
      });
    }
  }, [triggerVictory]);

  const celebrateStreak = useCallback((habitName: string, days: number) => {
    const tier = getStreakTier(days);
    const emoji = getStreakEmoji(days);

    triggerVictory({
      tier,
      message: tier === 3 ? `${days} ימים! אגדה!` : `${days} ימים רצופים!`,
      subMessage: `${habitName} - הישג מטורף`,
      emoji,
    });
  }, [triggerVictory]);

  return {
    currentVictory,
    triggerVictory,
    dismissVictory,
    celebrateCheckIn,
    celebrateUrgeOvercome,
    celebrateChallenge,
    celebrateStreak,
    todayCount,
    victoryLogs,
  };
}
