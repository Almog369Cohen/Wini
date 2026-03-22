import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, Shield, Flame, Trophy, Zap } from 'lucide-react';
import type { Habit } from '../../types';
import { HABIT_TEMPLATES, HABIT_BARRIERS } from '../../data/habitTemplates';

interface BarrierInterventionProps {
  habits: Habit[];
  onComplete: (result: { habitId: string; didIt: boolean }) => void;
  onClose: () => void;
}

const COMMON_EXCUSES = [
  { id: 'tired', emoji: '😴', label: 'עייף מדי' },
  { id: 'no-time', emoji: '⏰', label: 'אין לי זמן' },
  { id: 'no-mood', emoji: '😔', label: 'לא בא לי' },
  { id: 'too-hard', emoji: '🏔️', label: 'זה קשה מדי' },
  { id: 'tomorrow', emoji: '📅', label: 'אעשה מחר' },
  { id: 'no-point', emoji: '🤷', label: 'מה זה כבר ישנה' },
  { id: 'perfectionism', emoji: '✋', label: 'אם לא מושלם אז לא' },
  { id: 'overwhelm', emoji: '🌊', label: 'הכל מרגיש overwhelming' },
];

// Map excuses to barrier solutions
const EXCUSE_TO_BARRIER: Record<string, string> = {
  'tired': 'barrier-willpower',
  'no-time': 'barrier-too-big',
  'no-mood': 'barrier-motivation-wave',
  'too-hard': 'barrier-too-big',
  'tomorrow': 'barrier-rationalization',
  'no-point': 'barrier-valley',
  'perfectionism': 'barrier-perfectionism',
  'overwhelm': 'barrier-decision-fatigue',
};

export default function BarrierIntervention({
  habits,
  onComplete,
  onClose,
}: BarrierInterventionProps) {
  const [step, setStep] = useState(0);
  const [selectedHabitId, setSelectedHabitId] = useState('');
  const [selectedExcuse, setSelectedExcuse] = useState('');

  const buildHabits = useMemo(
    () => habits.filter(h => h.type === 'build' && h.isActive),
    [habits]
  );

  const selectedHabit = useMemo(
    () => buildHabits.find(h => h.id === selectedHabitId),
    [buildHabits, selectedHabitId]
  );

  const template = useMemo(() => {
    if (!selectedHabit) return null;
    return HABIT_TEMPLATES.find(t =>
      t.name === selectedHabit.name || (t.category === selectedHabit.category && t.type === selectedHabit.type)
    );
  }, [selectedHabit]);

  const barrier = useMemo(() => {
    if (!selectedExcuse) return null;
    const barrierId = EXCUSE_TO_BARRIER[selectedExcuse];
    return HABIT_BARRIERS.find(b => b.id === barrierId);
  }, [selectedExcuse]);

  const tinyVersion = template?.tinyVersion;

  // Auto-select if only one build habit
  if (buildHabits.length === 1 && !selectedHabitId && step === 0) {
    setSelectedHabitId(buildHabits[0].id);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ backgroundColor: '#0a3d30' }}
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 safe-area-top">
        <button onClick={onClose} className="p-2 text-white/50 hover:text-white">
          <X size={20} />
        </button>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className="w-8 h-1 rounded-full transition-all"
              style={{ backgroundColor: i <= step ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.25)' }}
            />
          ))}
        </div>
        <div className="w-9" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <AnimatePresence mode="wait">
          {/* ═══ Step 0: Which habit ═══ */}
          {step === 0 && (
            <motion.div
              key="which-habit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center pt-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                style={{ backgroundColor: 'rgba(3,178,140,0.3)' }}
              >
                <Shield size={28} className="text-white/80" />
              </motion.div>

              <h1 className="text-2xl font-bold text-white mb-1 text-center">
                רגע, אל תוותר!
              </h1>
              <p className="text-white/60 text-sm mb-6 text-center">
                זה שקשה לך - זה בדיוק הרגע שבו אתה מתחזק
              </p>

              {buildHabits.length > 1 ? (
                <>
                  <p className="text-white/80 text-sm font-medium mb-3 self-start">
                    איזה הרגל קשה לך עכשיו?
                  </p>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {buildHabits.map(h => (
                      <button
                        key={h.id}
                        onClick={() => setSelectedHabitId(h.id)}
                        className="p-3 rounded-xl text-sm font-medium transition-all text-right"
                        style={{
                          backgroundColor: selectedHabitId === h.id ? 'rgba(3,178,140,0.5)' : 'rgba(255,255,255,0.08)',
                          color: selectedHabitId === h.id ? 'white' : 'rgba(255,255,255,0.7)',
                          border: selectedHabitId === h.id ? '1px solid rgba(3,178,140,0.8)' : '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        {h.name}
                      </button>
                    ))}
                  </div>
                </>
              ) : buildHabits.length === 0 ? (
                <p className="text-white/60 text-sm text-center">
                  אין הרגלים חיוביים פעילים. הוסף הרגל חיובי בדף ההרגלים.
                </p>
              ) : (
                <div className="text-center">
                  <p className="text-white/70 text-lg font-medium mb-1">
                    {buildHabits[0].name}
                  </p>
                  <p className="text-white/40 text-xs">
                    streak נוכחי: {buildHabits[0].currentStreak} ימים
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* ═══ Step 1: What's stopping you ═══ */}
          {step === 1 && (
            <motion.div
              key="whats-stopping"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center pt-8"
            >
              <h1 className="text-2xl font-bold text-white mb-1 text-center">
                מה עוצר אותך?
              </h1>
              <p className="text-white/60 text-sm mb-6 text-center">
                בחר את מה שהכי מרגיש נכון עכשיו
              </p>

              <div className="grid grid-cols-2 gap-2 w-full">
                {COMMON_EXCUSES.map((excuse, i) => (
                  <motion.button
                    key={excuse.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedExcuse(excuse.id)}
                    className="p-3 rounded-xl text-right transition-all"
                    style={{
                      backgroundColor: selectedExcuse === excuse.id ? 'rgba(5,156,192,0.3)' : 'rgba(255,255,255,0.08)',
                      border: selectedExcuse === excuse.id ? '1px solid rgba(5,156,192,0.6)' : '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <span className="text-lg">{excuse.emoji}</span>
                    <p className="text-sm text-white/80 mt-1">{excuse.label}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══ Step 2: Reframe + tiny version ═══ */}
          {step === 2 && (
            <motion.div
              key="reframe"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center pt-6"
            >
              {/* Empathy */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full rounded-2xl p-4 mb-4 text-center"
                style={{
                  backgroundColor: 'rgba(5,156,192,0.25)',
                  border: '1px solid rgba(5,156,192,0.4)',
                }}
              >
                <p className="text-white/90 text-sm font-medium mb-1">
                  💛 זה נורמלי לגמרי.
                </p>
                <p className="text-white/60 text-xs leading-relaxed">
                  {selectedExcuse === 'tired' && 'גם כשעייפים - הגוף שלך רוצה לזוז. אתה לא צריך לעשות הכל, רק להתחיל.'}
                  {selectedExcuse === 'no-time' && 'אפילו 2 דקות שווים יותר מאפס. ההרגל הוא בלהופיע, לא בלסיים.'}
                  {selectedExcuse === 'no-mood' && 'מוטיבציה באה אחרי הפעולה, לא לפניה. התחל ותפתיע את עצמך.'}
                  {selectedExcuse === 'too-hard' && 'אתה לא צריך לעשות את הגרסה המלאה. גרסה קטנטנה עדיין נחשבת.'}
                  {selectedExcuse === 'tomorrow' && '"מחר" זה סיפור שאנחנו מספרים לעצמנו. היום זה כל מה שיש.'}
                  {selectedExcuse === 'no-point' && 'כל פעם שאתה מופיע - אתה בונה את הזהות שלך. גם אם לא רואים את זה.'}
                  {selectedExcuse === 'perfectionism' && 'גרסה גרועה של ההרגל שווה יותר מגרסה מושלמת שלא קורית.'}
                  {selectedExcuse === 'overwhelm' && 'לא צריך לחשוב על הכל. רק דבר אחד קטן. עכשיו.'}
                </p>
              </motion.div>

              {/* Barrier solution */}
              {barrier && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="w-full rounded-2xl p-4 mb-4"
                  style={{
                    backgroundColor: 'rgba(3,178,140,0.25)',
                    border: '1px solid rgba(3,178,140,0.4)',
                  }}
                >
                  <p className="text-sm font-semibold text-white/90 mb-2 flex items-center gap-1.5">
                    <Zap size={14} />
                    {barrier.emoji} הפתרון: {barrier.name}
                  </p>
                  <div className="space-y-1.5">
                    {barrier.solutions.slice(0, 2).map((sol, i) => (
                      <p key={i} className="text-xs text-white/70 flex items-start gap-1.5">
                        <span className="text-sage mt-0.5">•</span>
                        <span>{sol}</span>
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tiny version - the key */}
              {tinyVersion && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-full rounded-2xl p-5 mb-4 text-center"
                  style={{
                    backgroundColor: 'rgba(3,178,140,0.25)',
                    border: '2px solid rgba(3,178,140,0.5)',
                  }}
                >
                  <p className="text-xs text-white/50 mb-1">🎯 הגרסה הקטנה שלך:</p>
                  <p className="text-lg font-bold text-white leading-snug">
                    {tinyVersion}
                  </p>
                  <p className="text-[11px] text-white/40 mt-2">
                    רק זה. אם אחרי זה בא לך עוד - מעולה. אם לא - עשית מספיק.
                  </p>
                </motion.div>
              )}

              {/* Streak reminder */}
              {selectedHabit && selectedHabit.currentStreak > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-2 mb-3"
                >
                  <Flame size={16} className="text-sand" />
                  <p className="text-sm text-white/70">
                    יש לך streak של <span className="font-bold text-sand">{selectedHabit.currentStreak}</span> ימים. אל תשבור אותו.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ═══ Step 3: Decision ═══ */}
          {step === 3 && (
            <motion.div
              key="decision"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center pt-8"
            >
              <h1 className="text-2xl font-bold text-white mb-2 text-center">
                אז מה אתה בוחר?
              </h1>
              <p className="text-white/50 text-sm mb-8 text-center">
                שתי האפשרויות בסדר. העיקר שהחלטת מתוך מודעות.
              </p>

              {/* Do it */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onComplete({ habitId: selectedHabitId, didIt: true })}
                className="w-full rounded-2xl p-5 mb-3 text-center"
                style={{
                  backgroundColor: 'rgba(3,178,140,0.3)',
                  border: '2px solid rgba(3,178,140,0.6)',
                }}
              >
                <Trophy size={28} className="text-white mx-auto mb-2" />
                <p className="text-lg font-bold text-white mb-1">
                  {tinyVersion ? 'אני עושה את הגרסה הקטנה!' : 'אני עושה את זה!'}
                </p>
                <p className="text-xs text-white/50">
                  {tinyVersion || 'בוא נצא מאזור הנוחות'}
                </p>
              </motion.button>

              {/* Skip consciously */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onComplete({ habitId: selectedHabitId, didIt: false })}
                className="w-full rounded-2xl p-4 mb-4 text-center"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <p className="text-sm font-medium text-white/70 mb-0.5">
                  לא היום, אבל אני לא מוותר
                </p>
                <p className="text-[11px] text-white/40">
                  דילוג מודע ≠ כישלון. מחר תנסה שוב.
                </p>
              </motion.button>

              {/* Motivational footer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs text-white/30 text-center italic mt-2"
              >
                "לא צריך להיות מושלם. צריך רק להמשיך."
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      {step < 3 && (
        <div className="px-5 pb-5 safe-area-bottom">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setStep(s => s + 1)}
            disabled={
              (step === 0 && !selectedHabitId) ||
              (step === 1 && !selectedExcuse)
            }
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold transition-all"
            style={{
              backgroundColor:
                (step === 0 && !selectedHabitId) || (step === 1 && !selectedExcuse)
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(3,178,140,0.6)',
              cursor:
                (step === 0 && !selectedHabitId) || (step === 1 && !selectedExcuse)
                  ? 'not-allowed'
                  : 'pointer',
            }}
          >
            <span>המשך</span>
            <ChevronLeft size={18} />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
