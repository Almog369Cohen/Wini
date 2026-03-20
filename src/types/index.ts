export type HabitType = 'quit' | 'build';

export type HabitCategory =
  | 'smoking'
  | 'alcohol'
  | 'sugar'
  | 'caffeine'
  | 'screens'
  | 'junkfood'
  | 'exercise'
  | 'meditation'
  | 'reading'
  | 'water'
  | 'sleep'
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

export type Page = 'dashboard' | 'habits' | 'sos' | 'journal' | 'milestones' | 'settings' | 'innerspace' | 'mood' | 'dailyplan';
