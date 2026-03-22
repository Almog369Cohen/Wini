import { useState, useCallback, lazy, Suspense } from 'react';
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
import { useVictoryRewards } from './hooks/useVictoryRewards';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import HabitList from './components/Habits/HabitList';
import { useMealTracker } from './hooks/useMealTracker';
import { useNotifications } from './hooks/useNotifications';
import { useTasks } from './hooks/useTasks';
import Toast from './components/ui/Toast';
import Confetti from './components/ui/Confetti';
import VictoryBurst from './components/ui/VictoryBurst';
import ErrorBoundary from './components/ui/ErrorBoundary';
import PageTransition from './components/ui/PageTransition';
import PWAInstallPrompt from './components/ui/PWAInstallPrompt';
import BottomSheet from './components/ui/BottomSheet';
import { DashboardSkeleton } from './components/ui/Skeleton';
import { useVictoryPreferences } from './hooks/useVictoryPreferences';
import { haptic } from './lib/haptics';
import { useAuth } from './contexts/AuthContext';
import LoginScreen from './components/Auth/LoginScreen';
import SplashScreen from './components/SplashScreen';

// ─── Lazy-loaded pages (code splitting) ───────────────────────────
const SOSPage = lazy(() => import('./components/SOS/SOSPage'));
const JournalPage = lazy(() => import('./components/Journal/JournalPage'));
const MilestonesPage = lazy(() => import('./components/Milestones/MilestonesPage'));
const SettingsPage = lazy(() => import('./components/Settings/SettingsPage'));
const InnerSpacePage = lazy(() => import('./components/InnerSpace/InnerSpacePage'));
const MoodCheckIn = lazy(() => import('./components/MoodCheckIn/MoodCheckIn'));
const DailyPlan = lazy(() => import('./components/MoodCheckIn/DailyPlan'));
const RoutinesPage = lazy(() => import('./components/Routines/RoutinesPage'));
const OnboardingQuestionnaire = lazy(() => import('./components/Onboarding/OnboardingQuestionnaire'));
const AppTour = lazy(() => import('./components/Onboarding/AppTour'));
const NutritionPage = lazy(() => import('./components/Nutrition/NutritionPage'));
const RemindersPage = lazy(() => import('./components/Reminders/RemindersPage'));
const TasksPage = lazy(() => import('./components/Tasks/TasksPage'));
const CalendarPage = lazy(() => import('./components/Calendar/CalendarPage'));
const PartnerPage = lazy(() => import('./components/Partner/PartnerPage'));
const DailyChallengesPage = lazy(() => import('./components/Challenges/DailyChallengesPage'));
const VictorySetupPage = lazy(() => import('./components/Victory/VictorySetupPage'));
const FarewellLetterPage = lazy(() => import('./components/Farewell/FarewellLetterPage'));
const FeedbackButton = lazy(() => import('./components/Feedback/FeedbackButton'));
const UrgeIntervention = lazy(() => import('./components/UrgeIntervention/UrgeIntervention'));
const BarrierIntervention = lazy(() => import('./components/UrgeIntervention/BarrierIntervention'));

import type { OnboardingResult } from './components/Onboarding/OnboardingQuestionnaire';
import { useFarewellLetters } from './hooks/useFarewellLetters';
import { HABIT_TEMPLATES } from './data/habitTemplates';

export default function App() {
  const { user, loading, signOut } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-cream overflow-hidden">
        <DashboardSkeleton />
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
  const [showTour, setShowTour] = useState(false);
  const habitState = useHabits();
  const journalState = useJournal();
  const innerSpaceState = useInnerSpace();
  const dopamineState = useDopamine();
  const moodState = useMood();
  const routinesState = useRoutines();
  const { profile, hasProfile, createProfile } = useUserProfile();
  const feedbackState = useFeedback();
  const urgeLogState = useUrgeLog();
  const mealTracker = useMealTracker();
  const notifications = useNotifications();
  const tasksState = useTasks();
  const { toasts, show: showToast, dismiss: dismissToast } = useToast();
  const victoryRewards = useVictoryRewards();
  const victoryPreferences = useVictoryPreferences();
  const farewellLetters = useFarewellLetters();

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
        victoryRewards.celebrateCheckIn(habit.name, habit.currentStreak);
        const newStreak = habit.currentStreak + 1;
        if ([7, 14, 30, 60, 90, 180, 365].includes(newStreak)) {
          showToast(`streak של ${newStreak} ימים! מדהים!`);
        } else {
          showToast('צ\'ק-אין נשמר');
        }
      }
    },
    [habitState, showToast, victoryRewards]
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
      const habit = result.habitId ? habitState.habits.find(h => h.id === result.habitId) : null;
      victoryRewards.celebrateUrgeOvercome(habit?.name || 'דחף');
      showToast('גיבור! התגברת על הדחף 🦁');
    }
  }, [urgeLogState, showToast, habitState.habits, victoryRewards]);

  const handleBarrierComplete = useCallback((result: { habitId: string; didIt: boolean }) => {
    setShowBarrierIntervention(false);
    if (result.didIt) {
      showToast('גיבור! בחרת לעשות למרות הקושי 💪');
      // Auto check-in the habit (this will trigger its own victory)
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

    // Show app tour after questionnaire
    setShowTour(true);
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
            mealData={{
              todayCompletedCount: mealTracker.todayCompletedCount,
              todayWater: mealTracker.todayWater,
              waterGoal: mealTracker.waterGoal,
            }}
            victoryCount={victoryRewards.todayCount}
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
        return <InnerSpacePage {...innerSpaceState} onNavigate={setCurrentPage} />;
      case 'nutrition':
        return (
          <NutritionPage
            todayMeals={mealTracker.todayMeals}
            todayCompletedCount={mealTracker.todayCompletedCount}
            todayWater={mealTracker.todayWater}
            waterGoal={mealTracker.waterGoal}
            streak={mealTracker.streak}
            weekSummary={mealTracker.weekSummary}
            toggleMeal={mealTracker.toggleMeal}
            addWater={mealTracker.addWater}
            removeWater={mealTracker.removeWater}
            showToast={showToast}
          />
        );
      case 'reminders':
        return (
          <RemindersPage
            {...notifications}
            showToast={showToast}
          />
        );
      case 'tasks':
        return (
          <TasksPage
            {...tasksState}
            showToast={showToast}
          />
        );
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
      case 'calendar':
        return (
          <CalendarPage
            habits={habitState.habits}
            journalEntries={journalState.entries}
            moodHistory={moodState.history}
          />
        );
      case 'partner':
        return (
          <PartnerPage
            habits={habitState.habits}
            userName={profile?.name}
            todayVictories={journalState.todaySummary.victories}
            showToast={showToast}
          />
        );
      case 'challenges':
        return (
          <DailyChallengesPage
            showToast={showToast}
          />
        );
      case 'victory-setup':
        return (
          <VictorySetupPage
            {...victoryPreferences}
            showToast={showToast}
            onComplete={() => setCurrentPage('dashboard')}
            todayCount={victoryRewards.todayCount}
          />
        );
      case 'farewell':
        return (
          <FarewellLetterPage
            habits={habitState.habits}
            farewellLetters={farewellLetters}
            showToast={showToast}
            onBack={() => setCurrentPage('innerspace')}
          />
        );
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={(page) => { haptic('select'); setCurrentPage(page); }}>
      <ErrorBoundary onReset={() => setCurrentPage('dashboard')}>
        <Suspense fallback={<DashboardSkeleton />}>
          <AnimatePresence mode="wait">
            <PageTransition pageKey={currentPage}>
              {renderPage()}
            </PageTransition>
          </AnimatePresence>
        </Suspense>
      </ErrorBoundary>
      <Toast toasts={toasts} onDismiss={dismissToast} />
      <PWAInstallPrompt />
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Victory Burst overlay */}
      <AnimatePresence>
        {victoryRewards.currentVictory && (
          <VictoryBurst
            tier={victoryRewards.currentVictory.tier}
            message={victoryRewards.currentVictory.message}
            subMessage={victoryRewards.currentVictory.subMessage}
            emoji={victoryRewards.currentVictory.emoji}
            mantra={victoryPreferences.preferences.mantra}
            onComplete={victoryRewards.dismissVictory}
          />
        )}
      </AnimatePresence>

      {/* Onboarding Questionnaire */}
      <AnimatePresence>
        {!hasProfile && (
          <Suspense fallback={null}>
            <OnboardingQuestionnaire onComplete={handleOnboardingComplete} />
          </Suspense>
        )}
      </AnimatePresence>

      {/* App Tour */}
      <AnimatePresence>
        {showTour && (
          <Suspense fallback={null}>
            <AppTour
              userName={profile?.name || ''}
              onComplete={() => setShowTour(false)}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Mood check-in overlay */}
      <AnimatePresence>
        {(shouldShowMoodCheckIn || showMoodCheckIn) && (
          <Suspense fallback={null}>
            <MoodCheckIn
              onComplete={handleMoodComplete}
              isUpdate={showMoodCheckIn && moodState.hasCheckedInToday}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Urge intervention overlay */}
      <AnimatePresence>
        {showUrgeIntervention && (
          <Suspense fallback={null}>
            <UrgeIntervention
              habits={habitState.habits}
              onComplete={handleUrgeComplete}
              onClose={() => setShowUrgeIntervention(false)}
              onNavigate={setCurrentPage}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Barrier intervention overlay */}
      <AnimatePresence>
        {showBarrierIntervention && (
          <Suspense fallback={null}>
            <BarrierIntervention
              habits={habitState.habits}
              onComplete={handleBarrierComplete}
              onClose={() => setShowBarrierIntervention(false)}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* SOS choice bottom sheet */}
      <BottomSheet
        isOpen={showSOSChoice}
        onClose={() => setShowSOSChoice(false)}
        title="מה קורה עכשיו?"
      >
        <div className="p-5 space-y-3">
          <p className="text-xs text-text-light text-center mb-2">בחר את המצב שמתאר אותך</p>
          <button
            onClick={() => {
              haptic('medium');
              setShowSOSChoice(false);
              setShowUrgeIntervention(true);
            }}
            className="w-full flex items-center gap-3 bg-coral/10 active:bg-coral/20 text-right rounded-xl p-4 transition-colors"
          >
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-sm font-semibold text-coral">דחף להרגל רע</p>
              <p className="text-[11px] text-text-light">אני מרגיש דחף ורוצה עזרה להתגבר</p>
            </div>
          </button>
          <button
            onClick={() => {
              haptic('medium');
              setShowSOSChoice(false);
              setShowBarrierIntervention(true);
            }}
            className="w-full flex items-center gap-3 bg-sage/10 active:bg-sage/20 text-right rounded-xl p-4 transition-colors"
          >
            <span className="text-2xl">🧱</span>
            <div>
              <p className="text-sm font-semibold text-sage">קושי בהרגל חיובי</p>
              <p className="text-[11px] text-text-light">אני עומד לוותר ורוצה כוח להמשיך</p>
            </div>
          </button>
        </div>
      </BottomSheet>

      {/* Feedback floating button */}
      {hasProfile && profile && (
        <Suspense fallback={null}>
          <FeedbackButton
            userName={profile.name}
            userId={profile.id}
            onSubmit={feedbackState.submitFeedback}
            showToast={showToast}
          />
        </Suspense>
      )}
    </Layout>
  );
}
