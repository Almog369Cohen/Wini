export type HabitType = 'quit' | 'build';

export type HabitCategory =
  | 'smoking'
  | 'alcohol'
  | 'sugar'
  | 'caffeine'
  | 'screens'
  | 'junkfood'
  | 'social_media'
  | 'dating_apps'
  | 'porn'
  | 'gambling'
  | 'nail_biting'
  | 'procrastination'
  | 'shopping'
  | 'negativity'
  | 'exercise'
  | 'meditation'
  | 'reading'
  | 'water'
  | 'sleep'
  | 'gratitude'
  | 'journaling'
  | 'cooking'
  | 'socializing'
  | 'learning'
  | 'nature'
  | 'creativity'
  | 'hygiene'
  | 'finance'
  | 'volunteering'
  | 'other';

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
  category: HabitCategory;
  startDate: string; // ISO date - when quitting started or habit building began
  dailyCost?: number; // cost per day (for quit habits)
  triggers: string[];
  reasons: string[]; // why I'm doing this
  currentStreak: number;
  longestStreak: number;
  lastCheckIn?: string; // ISO date
  relapses: RelapsEvent[];
  isActive: boolean;
}

export interface RelapsEvent {
  date: string;
  note?: string;
  trigger?: string;
}

export type WithdrawalSymptom =
  | 'headache'
  | 'irritability'
  | 'insomnia'
  | 'anxiety'
  | 'fatigue'
  | 'appetite'
  | 'concentration'
  | 'restlessness';

export type MomentType = 'fall' | 'victory';

export interface JournalEntry {
  id: string;
  date: string; // ISO timestamp (includes time)
  type: MomentType;
  mood: number; // 1-5
  cravingIntensity: number; // 1-10
  note: string;
  triggers: string[];
  whatHelped: string;
  habitId?: string;
  symptoms?: WithdrawalSymptom[];
}

export interface HourlyStats {
  hour: number;
  falls: number;
  victories: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  timeRequired: number; // minutes from start
  category: HabitCategory;
  icon: string;
}

export interface Reflection {
  id: string;
  promptId: string;
  answer: string;
  date: string;
}

export interface EmotionalNeed {
  id: string;
  label: string;
  emoji: string;
  selected: boolean;
  note?: string;
}

export interface LetterToSelf {
  id: string;
  date: string;
  openDate?: string; // when to reveal
  content: string;
  type: 'past' | 'future';
}

export interface InnerSpaceData {
  reflections: Reflection[];
  emotionalNeeds: string[]; // selected need IDs
  needNotes: Record<string, string>; // needId -> personal note
  letters: LetterToSelf[];
  journeyStage: number; // 0-4
}

export interface DopamineLog {
  id: string;
  activityTitle: string;
  activityIcon: string;
  date: string; // ISO timestamp
  customActivity?: boolean;
}

export interface AppData {
  habits: Habit[];
  journal: JournalEntry[];
  innerSpace: InnerSpaceData;
  onboardingDone: boolean;
}

// Mood System
export type MoodType =
  | 'sad'
  | 'tired'
  | 'exhausted'
  | 'anxious'
  | 'irritable'
  | 'energetic'
  | 'happy'
  | 'calm'
  | 'frustrated'
  | 'lonely'
  | 'hopeful'
  | 'neutral';

export interface MoodEntry {
  id: string;
  mood: MoodType;
  secondaryMoods?: MoodType[];
  energy: number; // 1-5
  timestamp: string; // ISO
  note?: string;
}

export interface MoodState {
  currentMood: MoodType;
  currentMoods: MoodType[]; // all selected moods
  currentEnergy: number;
  todayEntries: MoodEntry[];
  history: MoodEntry[];
}

export interface DailyRoutineSuggestion {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g. "10 שניות", "5 דקות"
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
  category: 'body' | 'mind' | 'soul' | 'social' | 'creative';
  completed?: boolean;
}

export interface MotivationalQuote {
  id: number;
  text: string;
  category: QuoteCategory;
}

export type QuoteCategory =
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'breaking'
  | 'victory'
  | 'motivation'
  | 'self_compassion'
  | 'growth'
  | 'strength'
  | 'new_beginning';

export interface ReinforcementItem {
  id: string;
  type: 'quote' | 'image';
  content: string; // quote text or image data URL
  category: 'why' | 'strength' | 'future' | 'love';
  dateAdded: string;
}

// Routines System
export type RoutineType = 'morning' | 'night' | 'crisis' | 'motivation' | 'energy' | 'calm' | 'focus' | 'social' | 'growth' | 'body' | 'custom';

export interface RoutineStep {
  id: string;
  title: string;
  emoji: string;
  duration?: string; // e.g. "2 דקות"
  note?: string;
}

export interface Routine {
  id: string;
  name: string;
  type: RoutineType;
  emoji: string;
  steps: RoutineStep[];
  createdAt: string;
  isTemplate?: boolean;
}

export interface RoutineCompletion {
  routineId: string;
  date: string; // YYYY-MM-DD
  completedSteps: string[]; // step IDs
  completedAt?: string; // ISO timestamp
}

export interface RoutineReflection {
  id: string;
  date: string;
  whatWorks: string;
  whatToChange: string;
  newIdea?: string;
}

// Victory Preferences - Personal Celebration System
export type CelebrationVisual = 'confetti' | 'fireworks' | 'glow' | 'stars' | 'nature';
export type CelebrationSound = 'ding' | 'cheer' | 'nature' | 'gentle' | 'silent';
export type CelebrationIntensity = 'subtle' | 'medium' | 'epic';

export interface PersonalVictory {
  id: string;
  label: string;
  emoji: string;
  description: string;
  isCustom?: boolean;
}

export interface VictoryPreferences {
  personalVictories: PersonalVictory[];
  mantra: string; // personal victory phrase
  celebrationVisual: CelebrationVisual;
  celebrationSound: CelebrationSound;
  celebrationIntensity: CelebrationIntensity;
  dailyGoal: number; // how many victories per day
  setupDone: boolean;
}

// Farewell Letter - Guided goodbye to a habit
export interface FarewellMoment {
  id: string;
  description: string; // user's memory
  feeling: string;     // what they felt
  realNeed: string;    // the underlying need
}

export interface FarewellLetter {
  id: string;
  habitId: string;
  habitName: string;
  createdAt: string;
  completedAt?: string;
  // Phase 1: Recognition - moments the habit "helped"
  moments: FarewellMoment[];
  // Phase 2: Real needs identified
  needs: string[];
  // Phase 3: Thank you note
  thankYou: string;
  // Phase 4: The cost - what it really took
  costs: string[];
  missedMoments: string;
  // Phase 5: The farewell letter text
  letterText: string;
  // Phase 6: New commitment
  newResponses: { trigger: string; response: string }[];
  mantra: string;
  isComplete: boolean;
}

export type Page = 'dashboard' | 'habits' | 'sos' | 'journal' | 'milestones' | 'settings' | 'innerspace' | 'mood' | 'dailyplan' | 'routines' | 'nutrition' | 'reminders' | 'tasks' | 'calendar' | 'partner' | 'challenges' | 'victory-setup' | 'farewell';
