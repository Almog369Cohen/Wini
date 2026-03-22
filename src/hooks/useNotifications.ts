import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export type NotificationPermission = 'default' | 'granted' | 'denied';

interface ScheduledReminder {
  id: string;
  title: string;
  body: string;
  time: string; // HH:MM
  enabled: boolean;
  days: number[]; // 0-6 (Sun-Sat), empty = every day
  category: 'meal' | 'water' | 'habit' | 'custom';
}

interface NotificationState {
  reminders: ScheduledReminder[];
  enabled: boolean;
}

const DEFAULT_REMINDERS: ScheduledReminder[] = [
  { id: 'meal-breakfast', title: '🌅 ארוחת בוקר', body: 'הגיע הזמן לאכול ארוחת בוקר!', time: '08:00', enabled: true, days: [], category: 'meal' },
  { id: 'meal-snack1', title: '🍎 חטיף בוקר', body: 'זמן לחטיף קטן - תפוח, אגוזים, יוגורט?', time: '10:30', enabled: true, days: [], category: 'meal' },
  { id: 'meal-lunch', title: '☀️ ארוחת צהריים', body: 'הגיע הזמן לארוחת צהריים!', time: '13:00', enabled: true, days: [], category: 'meal' },
  { id: 'meal-snack2', title: '🥜 חטיף אחה"צ', body: 'זמן לחטיף אחר הצהריים', time: '16:00', enabled: true, days: [], category: 'meal' },
  { id: 'meal-dinner', title: '🌙 ארוחת ערב', body: 'הגיע הזמן לארוחת ערב!', time: '19:00', enabled: true, days: [], category: 'meal' },
  { id: 'water-morning', title: '💧 שתייה', body: 'שתית מספיק מים? תשתה כוס!', time: '09:00', enabled: true, days: [], category: 'water' },
  { id: 'water-afternoon', title: '💧 שתייה', body: 'תזכורת לשתות מים!', time: '14:00', enabled: true, days: [], category: 'water' },
  { id: 'water-evening', title: '💧 שתייה', body: 'עוד כוס מים לפני הערב', time: '17:00', enabled: true, days: [], category: 'water' },
];

const DEFAULT_STATE: NotificationState = {
  reminders: DEFAULT_REMINDERS,
  enabled: false,
};

// Track last notified minute to avoid double-firing
let lastNotifiedKey = '';

function shouldNotifyNow(reminder: ScheduledReminder): boolean {
  if (!reminder.enabled) return false;

  const now = new Date();
  const [hours, minutes] = reminder.time.split(':').map(Number);
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();

  // Check if it's the right day
  if (reminder.days.length > 0 && !reminder.days.includes(now.getDay())) {
    return false;
  }

  // Check if time matches (within 1-minute window)
  return currentHours === hours && currentMinutes === minutes;
}

function sendNotification(title: string, body: string) {
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/Wini/icons/icon-192x192.png',
        badge: '/Wini/icons/icon-72x72.png',
        tag: `wini-${Date.now()}`,
        requireInteraction: false,
        silent: false,
      });
    } catch {
      // Fallback for mobile - use service worker
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_NOTIFICATION',
          title,
          body,
        });
      }
    }
  }
}

export function useNotifications() {
  const [state, setState] = useLocalStorage<NotificationState>('wini-notifications', DEFAULT_STATE);
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') return false;

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === 'granted') {
      setState(prev => ({ ...prev, enabled: true }));
      // Register service worker for background notifications
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register(
            import.meta.env.BASE_URL + 'sw.js'
          );
        } catch {
          // Service worker registration failed, notifications still work in foreground
        }
      }
      return true;
    }
    return false;
  }, [setState]);

  const toggleEnabled = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, enabled }));
  }, [setState]);

  const toggleReminder = useCallback((id: string, enabled: boolean) => {
    setState(prev => ({
      ...prev,
      reminders: prev.reminders.map(r =>
        r.id === id ? { ...r, enabled } : r
      ),
    }));
  }, [setState]);

  const updateReminderTime = useCallback((id: string, time: string) => {
    setState(prev => ({
      ...prev,
      reminders: prev.reminders.map(r =>
        r.id === id ? { ...r, time } : r
      ),
    }));
  }, [setState]);

  const addCustomReminder = useCallback((title: string, body: string, time: string) => {
    const newReminder: ScheduledReminder = {
      id: `custom-${crypto.randomUUID()}`,
      title,
      body,
      time,
      enabled: true,
      days: [],
      category: 'custom',
    };
    setState(prev => ({
      ...prev,
      reminders: [...prev.reminders, newReminder],
    }));
  }, [setState]);

  const removeReminder = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      reminders: prev.reminders.filter(r => r.id !== id),
    }));
  }, [setState]);

  // Check for notifications every minute
  useEffect(() => {
    if (!state.enabled || permission !== 'granted') return;

    const check = () => {
      const now = new Date();
      const nowKey = `${now.getHours()}:${now.getMinutes()}`;

      // Avoid double-firing in the same minute
      if (nowKey === lastNotifiedKey) return;

      for (const reminder of state.reminders) {
        if (shouldNotifyNow(reminder)) {
          sendNotification(reminder.title, reminder.body);
          lastNotifiedKey = nowKey;
        }
      }
    };

    check(); // Check immediately
    const intervalId = setInterval(check, 30000); // Check every 30s

    return () => {
      clearInterval(intervalId);
    };
  }, [state.enabled, state.reminders, permission]);

  return {
    permission,
    enabled: state.enabled,
    reminders: state.reminders,
    isSupported: typeof Notification !== 'undefined',
    requestPermission,
    toggleEnabled,
    toggleReminder,
    updateReminderTime,
    addCustomReminder,
    removeReminder,
  };
}
