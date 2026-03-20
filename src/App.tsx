import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Page, MoodType } from './types';
import { useHabits } from './hooks/useHabits';
import { useJournal } from './hooks/useJournal';
import { useInnerSpace } from './hooks/useInnerSpace';
import { useDopamine } from './hooks/useDopamine';
import { useMood } from './hooks/useMood';
import { useRoutines } from './hooks/useRoutines';
import { useUserProfile } from './hooks/useUserProfile';
import { useFeedback } from './hooks/useFeedback';
import { useUrgeLog } from './hooks/useUrgeLog';
import { useToast } from './hooks/useToast';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import HabitList from './components/Habits/HabitList';
import SOSPage from './components/SOS/SOSPage';
import JournalPage from './components/Journal/JournalPage';
import MilestonesPage from './components/Milestones/MilestonesPage';
import SettingsPage from './components/Settings/SettingsPage';
import InnerSpacePage from './components/InnerSpace/InnerSpacePage';
import MoodCheckIn from './components/MoodCheckIn/MoodCheckIn';
import DailyPlan from './components/MoodCheckIn/DailyPlan';
import RoutinesPage from './components/Routines/RoutinesPage';
import OnboardingQuestionnaire from './components/Onboarding/OnboardingQuestionnaire';
import type { OnboardingResult } from './components/Onboarding/OnboardingQuestionnaire';
import { HABIT_TEMPLATES } from './data/habitTemplates';
import FeedbackButton from './components/Feedback/FeedbackButton';
import UrgeIntervention from './components/UrgeIntervention/UrgeIntervention';
import BarrierIntervention from './components/UrgeIntervention/BarrierIntervention';
import Toast from './components/ui/Toast';
import Confetti from './components/ui/Confetti';
import { useAuth } from './contexts/AuthContext';
import LoginScreen from './components/Auth/LoginScreen';

export default function App() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="text-4xl mb-3">🌱</div>
          <div className="w-6 h-6 border-2 border-sage border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <AuthenticatedApp user={user} signOut={signOut} />;
}

function AuthenticatedApp({ user, signOut }: { user: import('firebase/auth').User; signOut: () => Promise<void> }) {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);
  const [showUrgeIntervention, setShowUrgeIntervention] = useState(false);
  const [showBarrierIntervention, setShowBarrierIntervention] = useState(false);
  const [showSOSChoice, setShowSOSChoice] = useState(false);
  const habitState = useHabits();
  const journalState = useJournal();
  const innerSpaceState = useInnerSpace();
  const dopamineState = useDopamine();
  const moodState = useMood();
  const routinesState = useRoutines();
  const { profile, hasProfile, createProfile } = useUserProfile();
  const feedbackState = useFeedback();
  const urgeLogState = useUrgeLog();
  const { toasts, show: showToast, dismiss: dismissToast } = useToast();

  // Show mood check-in on first open if not checked in today
  const shouldShowMoodCheckIn = !moodState.hasCheckedInToday && habitState.habits.length > 0 && hasProfile;

  const handleMoodComplete = useCallback((mood: MoodType, energy: number, note?: string, secondaryMoods?: MoodType[]) => {
    moodState.setMood(mood, energy, note, secondaryMoods);
    setShowMoodCheckIn(false);
    showToast('מצב הרוח נשמר! הנה התוכנית שלך 💪');
  }, [moodState, showToast]);

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
    localStorage.removeItem('wini-mood');
    localStorage.removeItem('wini-reinforcement');
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

  const handleUrgeComplete = useCallback((result: {
    habitId?: string;
    overcame: boolean;
    urgeIntensity: number;
    trigger: string;
    whatItGives: string[];
    whatItCosts: string[];
    realNeed: string[];
  }) => {
    urgeLogState.logUrge(result);
    setShowUrgeIntervention(false);
    if (result.overcame) {
      setShowConfetti(true);
      showToast('גיבור! התגברת על הדחף 🦁');
    }
  }, [urgeLogState, showToast]);

  const handleBarrierComplete = useCallback((result: { habitId: string; didIt: boolean }) => {
    setShowBarrierIntervention(false);
    if (result.didIt) {
      setShowConfetti(true);
      showToast('גיבור! בחרת לעשות למרות הקושי 💪');
      // Auto check-in the habit
      handleCheckIn(result.habitId);
    } else {
      showToast('דילוג מודע. מחר תנסה שוב 🌱');
    }
  }, [showToast, handleCheckIn]);

  const handleSOSClick = useCallback(() => {
    const hasQuitHabits = habitState.habits.some(h => h.type === 'quit' && h.isActive);
    const hasBuildHabits = habitState.habits.some(h => h.type === 'build' && h.isActive);

    if (hasQuitHabits && hasBuildHabits) {
      setShowSOSChoice(true);
    } else if (hasQuitHabits) {
      setShowUrgeIntervention(true);
    } else if (hasBuildHabits) {
      setShowBarrierIntervention(true);
    } else {
      setShowUrgeIntervention(true);
    }
  }, [habitState.habits]);

  const handleOnboardingComplete = useCallback((result: OnboardingResult) => {
    // Create user profile with all onboarding data
    createProfile({
      name: result.name,
      painPoints: result.painPoints,
      quitHabits: result.quitHabits,
      buildHabits: result.buildHabits,
      goals: result.goals,
      barriers: result.barriers,
      motivationLevel: result.motivationLevel,
    });

    // Auto-create habits from selected templates
    const allSelectedIds = [...result.quitHabits, ...result.buildHabits];
    for (const templateId of allSelectedIds) {
      const template = HABIT_TEMPLATES.find(t => t.id === templateId);
      if (template) {
        habitState.addHabit({
          name: template.name,
          type: template.type,
          category: template.category,
          dailyCost: template.dailyCost,
          triggers: template.commonTriggers.slice(0, 3),
          reasons: template.suggestedReasons.slice(0, 3),
        });
      }
    }

    const habitCount = allSelectedIds.length;
    showToast(`שלום ${result.name}! ${habitCount > 0 ? `${habitCount} הרגלים נוצרו` : 'בוא נתחיל'} 🌱`);
  }, [createProfile, habitState, showToast]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            habits={habitState.habits}
            onNavigate={setCurrentPage}
            todaySummary={journalState.todaySummary}
            hardHours={journalState.hardHours}
            dopamineCount={dopamineState.todayCount}
            dopamineGoal={dopamineState.dailyGoal}
            dopamineGoalProgress={dopamineState.goalProgress}
            moodState={moodState}
            onChangeMood={() => setShowMoodCheckIn(true)}
            onUrgeHelp={handleSOSClick}
            userName={profile?.name}
            userPhotoURL={user.photoURL}
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
        return (
          <SOSPage
            habits={habitState.habits}
            todayDopamineLogs={dopamineState.todayLogs}
            todayDopamineCount={dopamineState.todayCount}
            dopamineGoalProgress={dopamineState.goalProgress}
            dopamineStreak={dopamineState.streak}
            dailyGoal={dopamineState.dailyGoal}
            onLogDopamine={dopamineState.logActivity}
            showToast={showToast}
          />
        );
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
            onSignOut={signOut}
            userPhotoURL={user.photoURL}
            userDisplayName={user.displayName}
            userEmail={user.email}
            showToast={showToast}
          />
        );
      case 'routines':
        return (
          <RoutinesPage
            {...routinesState}
            showToast={showToast}
            onNavigate={setCurrentPage}
          />
        );
      case 'innerspace':
        return <InnerSpacePage {...innerSpaceState} />;
      case 'dailyplan':
        return (
          <DailyPlan
            mood={moodState.currentMood}
            energy={moodState.currentEnergy}
            onBack={() => setCurrentPage('dashboard')}
            moodEmoji={moodState.moodEmojis[moodState.currentMood]}
            moodLabel={moodState.moodLabels[moodState.currentMood]}
          />
        );
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
      <Toast toasts={toasts} onDismiss={dismissToast} />
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Onboarding Questionnaire */}
      <AnimatePresence>
        {!hasProfile && <OnboardingQuestionnaire onComplete={handleOnboardingComplete} />}
      </AnimatePresence>

      {/* Mood check-in overlay */}
      <AnimatePresence>
        {(shouldShowMoodCheckIn || showMoodCheckIn) && (
          <MoodCheckIn
            onComplete={handleMoodComplete}
            isUpdate={showMoodCheckIn && moodState.hasCheckedInToday}
          />
        )}
      </AnimatePresence>

      {/* Urge intervention overlay */}
      <AnimatePresence>
        {showUrgeIntervention && (
          <UrgeIntervention
            habits={habitState.habits}
            onComplete={handleUrgeComplete}
            onClose={() => setShowUrgeIntervention(false)}
            onNavigate={setCurrentPage}
          />
        )}
      </AnimatePresence>

      {/* Barrier intervention overlay */}
      <AnimatePresence>
        {showBarrierIntervention && (
          <BarrierIntervention
            habits={habitState.habits}
            onComplete={handleBarrierComplete}
            onClose={() => setShowBarrierIntervention(false)}
          />
        )}
      </AnimatePresence>

      {/* SOS choice modal */}
      <AnimatePresence>
        {showSOSChoice && (
          <motion.div
            key="sos-choice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowSOSChoice(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-text text-center mb-2">מה קורה עכשיו?</h2>
              <p className="text-xs text-text-light text-center mb-5">בחר את המצב שמתאר אותך</p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowSOSChoice(false);
                    setShowUrgeIntervention(true);
                  }}
                  className="w-full flex items-center gap-3 bg-coral/10 hover:bg-coral/20 text-right rounded-xl p-4 transition-colors"
                >
                  <span className="text-2xl">🔥</span>
                  <div>
                    <p className="text-sm font-semibold text-coral">דחף להרגל רע</p>
                    <p className="text-[11px] text-text-light">אני מרגיש דחף ורוצה עזרה להתגבר</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setShowSOSChoice(false);
                    setShowBarrierIntervention(true);
                  }}
                  className="w-full flex items-center gap-3 bg-sage/10 hover:bg-sage/20 text-right rounded-xl p-4 transition-colors"
                >
                  <span className="text-2xl">🧱</span>
                  <div>
                    <p className="text-sm font-semibold text-sage">קושי בהרגל חיובי</p>
                    <p className="text-[11px] text-text-light">אני עומד לוותר ורוצה כוח להמשיך</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback floating button */}
      {hasProfile && profile && (
        <FeedbackButton
          userName={profile.name}
          userId={profile.id}
          onSubmit={feedbackState.submitFeedback}
          showToast={showToast}
        />
      )}
    </Layout>
  );
}
