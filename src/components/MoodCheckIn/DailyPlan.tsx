import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Clock,
  Flame,
  Trophy,
} from 'lucide-react';
import type { MoodType, DailyRoutineSuggestion } from '../../types';
import { getRoutineSuggestions } from '../../data/dailyRoutines';

interface DailyPlanProps {
  mood: MoodType;
  energy: number;
  onBack: () => void;
  moodEmoji: string;
  moodLabel: string;
}

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  body: { label: 'גוף', emoji: '💪' },
  mind: { label: 'מיינד', emoji: '🧠' },
  soul: { label: 'נשמה', emoji: '✨' },
  social: { label: 'חברתי', emoji: '👥' },
  creative: { label: 'יצירתי', emoji: '🎨' },
};

const DIFFICULTY_LABELS = {
  easy: { label: 'קל', color: 'bg-green-100 text-green-700' },
  medium: { label: 'בינוני', color: 'bg-yellow-100 text-yellow-700' },
  hard: { label: 'מאתגר', color: 'bg-orange-100 text-orange-700' },
};

export default function DailyPlan({ mood, energy, onBack, moodEmoji, moodLabel }: DailyPlanProps) {
  const suggestions = useMemo(() => getRoutineSuggestions(mood, energy), [mood, energy]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string | null>(null);

  const toggleComplete = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredSuggestions = filter
    ? suggestions.filter(s => s.category === filter)
    : suggestions;

  const completedCount = completed.size;
  const progress = completedCount / suggestions.length;

  const encouragement = useMemo(() => {
    if (completedCount === 0) return 'בוא נתחיל! בחר פעילות אחת קלה';
    if (completedCount <= 3) return 'יופי! כל צעד קטן נספר';
    if (completedCount <= 7) return 'אתה על גלגל! תמשיך ככה';
    if (completedCount <= 12) return 'וואו, איזה יום מדהים!';
    if (completedCount <= 17) return 'אלוף! אתה שובר שיאים';
    return 'השלמת כמעט הכל! גאווה אמיתית';
  }, [completedCount]);

  return (
    <div className="min-h-dvh bg-cream pb-24">
      {/* Header */}
      <div className="bg-sage/5 p-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="flex items-center gap-1 text-sage text-sm">
            <ArrowRight size={16} />
            חזרה
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-light">{moodLabel}</span>
            <span className="text-xl">{moodEmoji}</span>
          </div>
        </div>

        <h1 className="text-xl font-bold text-text mb-1">התוכנית שלך להיום</h1>
        <p className="text-text-light text-sm mb-4">{encouragement}</p>

        {/* Progress */}
        <div className="bg-card rounded-full h-3 overflow-hidden mb-2">
          <motion.div
            className="h-full bg-sage rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-xs text-text-light">
          <span>{completedCount} מתוך {suggestions.length}</span>
          <div className="flex items-center gap-1">
            <Flame size={12} className="text-coral" />
            <span>{Math.round(progress * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 p-4 overflow-x-auto">
        <button
          onClick={() => setFilter(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            !filter ? 'bg-sage text-white' : 'bg-card text-text-light border border-cream-dark'
          }`}
        >
          הכל
        </button>
        {Object.entries(CATEGORY_LABELS).map(([key, { label, emoji }]) => (
          <button
            key={key}
            onClick={() => setFilter(filter === key ? null : key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filter === key ? 'bg-sage text-white' : 'bg-card text-text-light border border-cream-dark'
            }`}
          >
            {emoji} {label}
          </button>
        ))}
      </div>

      {/* Suggestions list */}
      <div className="px-4 space-y-2">
        <AnimatePresence>
          {filteredSuggestions.map((suggestion, i) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              isCompleted={completed.has(suggestion.id)}
              onToggle={() => toggleComplete(suggestion.id)}
              index={i}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Completed celebration */}
      {completedCount >= 5 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-4 bg-sage/10 rounded-2xl p-4 flex items-center gap-3"
        >
          <Trophy size={24} className="text-sage" />
          <div>
            <p className="font-semibold text-text">כל הכבוד!</p>
            <p className="text-sm text-text-light">
              השלמת {completedCount} פעילויות היום. הגוף והנפש שלך מודים לך.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function SuggestionCard({
  suggestion,
  isCompleted,
  onToggle,
  index,
}: {
  suggestion: DailyRoutineSuggestion;
  isCompleted: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={onToggle}
      className={`bg-card rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all active:scale-[0.98] ${
        isCompleted ? 'opacity-60' : ''
      }`}
    >
      {/* Check */}
      <div className="flex-shrink-0">
        {isCompleted ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <CheckCircle2 size={24} className="text-sage" />
          </motion.div>
        ) : (
          <Circle size={24} className="text-cream-dark" />
        )}
      </div>

      {/* Icon */}
      <span className="text-xl flex-shrink-0">{suggestion.icon}</span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-sm ${isCompleted ? 'line-through text-text-light' : 'text-text'}`}>
          {suggestion.title}
        </p>
        <p className="text-xs text-text-light mt-0.5 line-clamp-1">{suggestion.description}</p>
      </div>

      {/* Meta */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="flex items-center gap-0.5 text-[10px] text-text-light">
          <Clock size={10} />
          {suggestion.duration}
        </span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${DIFFICULTY_LABELS[suggestion.difficulty].color}`}>
          {DIFFICULTY_LABELS[suggestion.difficulty].label}
        </span>
      </div>
    </motion.div>
  );
}
