import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplets,
  Plus,
  Minus,
  Flame,
  TrendingUp,
  Check,
  UtensilsCrossed,
} from 'lucide-react';
import type { MealType } from '../../hooks/useMealTracker';
import { MEAL_CONFIG } from '../../hooks/useMealTracker';

interface NutritionPageProps {
  todayMeals: { id: string; date: string; meal: MealType; completed: boolean; time?: string; rating?: 1 | 2 | 3 }[];
  todayCompletedCount: number;
  todayWater: number;
  waterGoal: number;
  streak: number;
  weekSummary: { date: string; count: number }[];
  toggleMeal: (meal: MealType, rating?: 1 | 2 | 3) => void;
  addWater: () => void;
  removeWater: () => void;
  showToast: (text: string) => void;
}

const RATING_LABELS = [
  { value: 1 as const, label: 'קצת', emoji: '🤏' },
  { value: 2 as const, label: 'סבבה', emoji: '👌' },
  { value: 3 as const, label: 'טוב!', emoji: '💪' },
];

const DAY_LABELS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];

export default function NutritionPage({
  todayMeals,
  todayCompletedCount,
  todayWater,
  waterGoal,
  streak,
  weekSummary,
  toggleMeal,
  addWater,
  removeWater,
  showToast,
}: NutritionPageProps) {
  const [ratingMeal, setRatingMeal] = useState<MealType | null>(null);

  const handleMealClick = (meal: MealType, isCompleted: boolean) => {
    if (isCompleted) {
      toggleMeal(meal);
    } else {
      setRatingMeal(meal);
    }
  };

  const handleRatingSelect = (rating: 1 | 2 | 3) => {
    if (ratingMeal) {
      toggleMeal(ratingMeal, rating);
      setRatingMeal(null);
      const config = MEAL_CONFIG[ratingMeal];
      showToast(`${config.emoji} ${config.label} סומנה!`);
    }
  };

  const waterPercent = Math.min(100, (todayWater / waterGoal) * 100);
  const mealsPercent = (todayCompletedCount / 5) * 100;

  return (
    <motion.div
      key="nutrition"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 pt-4 pb-24 max-w-lg mx-auto"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-text">תזונה</h1>
        {streak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5 bg-coral/10 border border-coral/30 px-3 py-1.5 rounded-full"
          >
            <Flame size={14} className="text-coral" />
            <span className="text-xs font-bold text-coral">{streak} ימים רצופים</span>
          </motion.div>
        )}
      </div>

      {/* Progress Summary */}
      <div className="bg-card rounded-2xl shadow-sm p-4 mb-4">
        <div className="flex gap-4">
          {/* Meals progress */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <UtensilsCrossed size={14} className="text-sage" />
              <span className="text-xs font-medium text-text-light">ארוחות</span>
              <span className="text-xs font-bold text-sage mr-auto">{todayCompletedCount}/5</span>
            </div>
            <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${mealsPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-sage rounded-full"
              />
            </div>
          </div>

          {/* Water progress */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Droplets size={14} className="text-sea" />
              <span className="text-xs font-medium text-text-light">מים</span>
              <span className="text-xs font-bold text-sea mr-auto">{todayWater}/{waterGoal}</span>
            </div>
            <div className="h-2 bg-sea/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${waterPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-sea rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Meals List */}
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden mb-4">
        <h2 className="text-xs font-semibold text-text-light px-4 pt-4 pb-2">
          הארוחות של היום
        </h2>

        <div className="divide-y divide-cream-dark/50">
          {todayMeals.map((entry) => {
            const config = MEAL_CONFIG[entry.meal];
            return (
              <motion.button
                key={entry.meal}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMealClick(entry.meal, entry.completed)}
                className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-cream/30"
              >
                {/* Emoji */}
                <span className="text-xl w-8 text-center">{config.emoji}</span>

                {/* Name & time */}
                <div className="flex-1 text-right">
                  <p className={`text-sm font-medium ${entry.completed ? 'text-sage' : 'text-text'}`}>
                    {config.label}
                  </p>
                  <p className="text-[10px] text-text-light">
                    {entry.completed && entry.time
                      ? `סומנה ב-${entry.time}`
                      : config.defaultTime}
                  </p>
                </div>

                {/* Rating badge */}
                {entry.completed && entry.rating && (
                  <span className="text-xs bg-sage/10 text-sage px-2 py-0.5 rounded-full">
                    {RATING_LABELS.find(r => r.value === entry.rating)?.emoji}
                  </span>
                )}

                {/* Check indicator */}
                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                    entry.completed
                      ? 'bg-sage border-sage'
                      : 'border-cream-dark'
                  }`}
                >
                  {entry.completed && <Check size={14} className="text-white" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Water Tracker */}
      <div className="bg-card rounded-2xl shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplets size={16} className="text-sea" />
            <h2 className="text-sm font-semibold text-text">מעקב מים</h2>
          </div>
          <span className="text-xs text-text-light">
            {todayWater >= waterGoal ? '🎉 עמדת ביעד!' : `עוד ${waterGoal - todayWater} כוסות`}
          </span>
        </div>

        {/* Water glasses visual */}
        <div className="flex items-center justify-center gap-1.5 mb-3 flex-wrap">
          {[...Array(waterGoal)].map((_, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                scale: i < todayWater ? 1 : 0.85,
                opacity: i < todayWater ? 1 : 0.3,
              }}
              className={`w-7 h-9 rounded-b-lg rounded-t-sm border-2 flex items-center justify-end flex-col overflow-hidden ${
                i < todayWater
                  ? 'border-sea'
                  : 'border-sea/30'
              }`}
            >
              <motion.div
                initial={false}
                animate={{ height: i < todayWater ? '100%' : '0%' }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="w-full bg-sea/30"
              />
            </motion.div>
          ))}
        </div>

        {/* + / - buttons */}
        <div className="flex items-center justify-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={removeWater}
            disabled={todayWater === 0}
            className="w-10 h-10 rounded-full bg-sea/10 border border-sea/30 flex items-center justify-center text-sea disabled:opacity-30"
          >
            <Minus size={18} />
          </motion.button>
          <span className="text-2xl font-bold text-sea w-12 text-center">{todayWater}</span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              addWater();
              if (todayWater + 1 === waterGoal) {
                showToast('🎉 עמדת ביעד המים להיום!');
              }
            }}
            className="w-10 h-10 rounded-full bg-sea flex items-center justify-center text-white shadow-sm"
          >
            <Plus size={18} />
          </motion.button>
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="bg-card rounded-2xl shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-sage" />
          <h2 className="text-sm font-semibold text-text">סיכום שבועי</h2>
        </div>

        <div className="flex items-end justify-between gap-1">
          {weekSummary.map((day, i) => {
            const dayDate = new Date(day.date);
            const dayOfWeek = dayDate.getDay();
            const isToday = day.date === new Date().toISOString().split('T')[0];
            const barHeight = Math.max(4, (day.count / 5) * 48);

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-medium text-text-light">
                  {day.count > 0 ? day.count : ''}
                </span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: barHeight }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className={`w-full rounded-t-md ${
                    isToday
                      ? 'bg-sage'
                      : day.count >= 3
                        ? 'bg-sage/40'
                        : day.count > 0
                          ? 'bg-cream-dark'
                          : 'bg-cream'
                  }`}
                  style={{ minHeight: 4 }}
                />
                <span className={`text-[10px] ${isToday ? 'font-bold text-sage' : 'text-text-light'}`}>
                  {DAY_LABELS[dayOfWeek]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meal Rating Modal */}
      <AnimatePresence>
        {ratingMeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/30"
            onClick={() => setRatingMeal(null)}
          >
            <motion.div
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-card rounded-t-3xl p-6 pb-10 safe-area-bottom"
            >
              <div className="w-10 h-1 bg-cream-dark rounded-full mx-auto mb-4" />
              <h3 className="text-lg font-bold text-text text-center mb-1">
                {MEAL_CONFIG[ratingMeal].emoji} {MEAL_CONFIG[ratingMeal].label}
              </h3>
              <p className="text-sm text-text-light text-center mb-5">כמה אכלת?</p>

              <div className="flex gap-3">
                {RATING_LABELS.map((r) => (
                  <motion.button
                    key={r.value}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRatingSelect(r.value)}
                    className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl bg-cream hover:bg-sage/10 transition-colors border border-cream-dark"
                  >
                    <span className="text-2xl">{r.emoji}</span>
                    <span className="text-sm font-medium text-text">{r.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
