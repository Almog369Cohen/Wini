import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Page } from './types';
import { useHabits } from './hooks/useHabits';
import { useJournal } from './hooks/useJournal';
import { useInnerSpace } from './hooks/useInnerSpace';
import { useToast } from './hooks/useToast';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import HabitList from './components/Habits/HabitList';
import SOSPage from './components/SOS/SOSPage';
import JournalPage from './components/Journal/JournalPage';
import MilestonesPage from './components/Milestones/MilestonesPage';
import SettingsPage from './components/Settings/SettingsPage';
import InnerSpacePage from './components/InnerSpace/InnerSpacePage';
import Toast from './components/ui/Toast';
import Confetti from './components/ui/Confetti';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [showConfetti, setShowConfetti] = useState(false);
  const habitState = useHabits();
  const journalState = useJournal();
  const innerSpaceState = useInnerSpace();
  const { toasts, show: showToast, dismiss: dismissToast } = useToast();

  const handleExport = useCallback(() => {
    const data = {
      habits: habitState.habits,
      journal: journalState.entries,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wini-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('הנתונים יוצאו בהצלחה');
  }, [habitState.habits, journalState.entries, showToast]);

  const handleImport = useCallback(
    (jsonString: string) => {
      try {
        const data = JSON.parse(jsonString);
        if (data.habits) {
          localStorage.setItem('wini-habits', JSON.stringify(data.habits));
        }
        if (data.journal) {
          localStorage.setItem('wini-journal', JSON.stringify(data.journal));
        }
        window.location.reload();
      } catch {
        showToast('שגיאה בייבוא הנתונים', 'error');
      }
    },
    [showToast]
  );

  const handleReset = useCallback(() => {
    localStorage.removeItem('wini-habits');
    localStorage.removeItem('wini-journal');
    window.location.reload();
  }, []);

  const handleCheckIn = useCallback(
    (habitId: string) => {
      habitState.checkIn(habitId);
      const habit = habitState.habits.find((h) => h.id === habitId);
      if (habit) {
        const newStreak = habit.currentStreak + 1;
        if ([7, 14, 30, 60, 90, 180, 365].includes(newStreak)) {
          setShowConfetti(true);
          showToast(`streak של ${newStreak} ימים! מדהים!`);
        } else {
          showToast('צ\'ק-אין נשמר');
        }
      }
    },
    [habitState, showToast]
  );

  const handleAddHabit = useCallback(
    (...args: Parameters<typeof habitState.addHabit>) => {
      const habit = habitState.addHabit(...args);
      showToast(`"${habit.name}" נוסף בהצלחה`);
      return habit;
    },
    [habitState, showToast]
  );

  const handleJournalSubmit = useCallback(
    (...args: Parameters<typeof journalState.addEntry>) => {
      const entry = journalState.addEntry(...args);
      showToast(entry.type === 'victory' ? 'ניצחון נרשם! 💪' : 'הרגע תועד');
      if (entry.type === 'victory') {
        const todayVictories = journalState.getTodayEntries().filter(e => e.type === 'victory').length;
        if ([3, 5, 10].includes(todayVictories + 1)) {
          setShowConfetti(true);
        }
      }
      return entry;
    },
    [journalState, showToast]
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            habits={habitState.habits}
            onNavigate={setCurrentPage}
            todaySummary={journalState.todaySummary}
            hardHours={journalState.hardHours}
          />
        );
      case 'habits':
        return (
          <HabitList
            {...habitState}
            addHabit={handleAddHabit}
            checkIn={handleCheckIn}
            showToast={showToast}
          />
        );
      case 'sos':
        return <SOSPage habits={habitState.habits} />;
      case 'journal':
        return (
          <JournalPage
            entries={journalState.entries}
            addEntry={handleJournalSubmit}
            hourlyStats={journalState.hourlyStats}
            hardHours={journalState.hardHours}
            strongHours={journalState.strongHours}
            insights={journalState.insights}
            todaySummary={journalState.todaySummary}
          />
        );
      case 'milestones':
        return <MilestonesPage habits={habitState.habits} />;
      case 'settings':
        return (
          <SettingsPage
            onExport={handleExport}
            onImport={handleImport}
            onReset={handleReset}
            showToast={showToast}
          />
        );
      case 'innerspace':
        return <InnerSpacePage {...innerSpaceState} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
      <Toast toasts={toasts} onDismiss={dismissToast} />
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
    </Layout>
  );
}
