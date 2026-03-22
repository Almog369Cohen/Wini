import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  X,
  Wind,
  Heart,
  Flame,
  Shield,
  Phone,
  TreePine,
  Image,
  Sparkles,
  Trophy,
  ArrowLeft,
} from 'lucide-react';
import type { Habit } from '../../types';
import { HABIT_TEMPLATES } from '../../data/habitTemplates';
import Confetti from '../ui/Confetti';

// ─── Types ───────────────────────────────────────────────────

interface UrgeInterventionProps {
  habits: Habit[];
  onComplete: (result: {
    habitId?: string;
    overcame: boolean;
    urgeIntensity: number;
    trigger: string;
    whatItGives: string[];
    whatItCosts: string[];
    realNeed: string[];
  }) => void;
  onClose: () => void;
  onNavigate: (page: 'sos') => void;
}

type BreathPhase = 'inhale' | 'hold' | 'exhale';

// ─── Data ────────────────────────────────────────────────────

const TRIGGERS = [
  { id: 'loneliness', label: 'בדידות', emoji: '🫂' },
  { id: 'boredom', label: 'שעמום', emoji: '😐' },
  { id: 'stress', label: 'לחץ', emoji: '😰' },
  { id: 'fatigue', label: 'עייפות', emoji: '😴' },
  { id: 'anger', label: 'כעס', emoji: '😤' },
  { id: 'social', label: 'חברתי', emoji: '👥' },
  { id: 'habit', label: 'הרגל', emoji: '🔄' },
  { id: 'other', label: 'אחר', emoji: '❓' },
];

const WHAT_IT_GIVES = [
  { id: 'stress-relief', label: 'הקלה רגעית מלחץ', emoji: '😌' },
  { id: 'fake-connection', label: 'תחושת חיבור (מדומה)', emoji: '🫂' },
  { id: 'escape', label: 'בריחה מהמציאות', emoji: '🎭' },
  { id: 'dopamine', label: 'גירוי ודופמין מהיר', emoji: '⚡' },
  { id: 'routine', label: 'שגרה מוכרת ונוחה', emoji: '🔄' },
  { id: 'numb', label: 'השתקת רגשות', emoji: '😶' },
];

const WHAT_IT_COSTS = [
  { id: 'guilt', label: 'תחושת אשמה אחרי', emoji: '😔' },
  { id: 'resources', label: 'כסף / זמן / בריאות', emoji: '💸' },
  { id: 'shame', label: 'בושה מעצמי', emoji: '🫣' },
  { id: 'confidence', label: 'ירידה בביטחון עצמי', emoji: '📉' },
  { id: 'failure', label: 'תחושת כישלון חוזר', emoji: '🔁' },
  { id: 'relationships', label: 'פגיעה במערכות יחסים', emoji: '💔' },
];

const REAL_NEEDS = [
  { id: 'true-connection', label: 'חיבור אמיתי עם אנשים', emoji: '🤗' },
  { id: 'control', label: 'להרגיש שאני שולט בחיים', emoji: '💪' },
  { id: 'inner-peace', label: 'שקט פנימי אמיתי', emoji: '🧘' },
  { id: 'pride', label: 'גאווה בעצמי', emoji: '⭐' },
  { id: 'self-love', label: 'לאהוב את עצמי', emoji: '❤️' },
  { id: 'freedom', label: 'חופש מהתלות', emoji: '🌅' },
  { id: 'potential', label: 'להגשים את הפוטנציאל שלי', emoji: '🎯' },
];

const ALTERNATIVE_ACTIVITIES = [
  { id: 'breathe', label: 'תרגיל נשימה', emoji: '🌬️', icon: Wind },
  { id: 'call', label: 'להתקשר לחבר', emoji: '📞', icon: Phone },
  { id: 'walk', label: 'לצאת להליכה קצרה', emoji: '🚶', icon: TreePine },
  { id: 'gallery', label: 'גלריית חיזוקים', emoji: '🖼️', icon: Image },
];

const MOTIVATIONAL_QUOTES = [
  'כל פעם שאתה מתגבר, אתה בונה גרסה חזקה יותר של עצמך.',
  'הדחף הוא גל - הוא תמיד עובר. פשוט תחזיק מעמד.',
  'אתה לא נלחם בהרגל. אתה בונה חיים חדשים.',
  'הכוח שלך לא נמדד ברגעים הקלים, אלא בדיוק ברגעים כאלה.',
  'כל "לא" שאתה אומר להרגל הישן הוא "כן" לעצמך.',
];

const STEP_BACKGROUNDS: Record<number, string> = {
  0: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)',
  1: 'linear-gradient(135deg, #1a1a2e 0%, #1e3a3a 50%, #1a2e1a 100%)',
  2: 'linear-gradient(135deg, #1e2a3a 0%, #2a2a3e 50%, #1e3a3a 100%)',
  3: 'linear-gradient(135deg, #1e3a3a 0%, #2a3e2a 50%, #2e3a1e 100%)',
  4: 'linear-gradient(135deg, #2a2a1e 0%, #2e3a2a 50%, #1e3a2e 100%)',
  5: 'linear-gradient(135deg, #1e3a2e 0%, #2a4a2a 50%, #3a4a2a 100%)',
  6: 'linear-gradient(135deg, #2a4a2a 0%, #3a5a3a 50%, #2a5a3a 100%)',
};

const TOTAL_STEPS = 7;

// ─── Component ───────────────────────────────────────────────

export default function UrgeIntervention({
  habits,
  onComplete,
  onClose,
  onNavigate,
}: UrgeInterventionProps) {
  const [step, setStep] = useState(0);

  // Step 0 - breathing
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('inhale');
  const [breathCycle, setBreathCycle] = useState(0);
  const [breathStarted, setBreathStarted] = useState(false);

  // Step 1 - habit / intensity / trigger
  const [selectedHabitId, setSelectedHabitId] = useState<string | undefined>(
    habits.length === 1 ? habits[0].id : undefined
  );
  const [urgeIntensity, setUrgeIntensity] = useState(5);
  const [selectedTrigger, setSelectedTrigger] = useState('');

  // Step 2 - what it gives / costs
  const [whatItGives, setWhatItGives] = useState<string[]>([]);
  const [whatItCosts, setWhatItCosts] = useState<string[]>([]);
  const [showCosts, setShowCosts] = useState(false);

  // Step 3 - real needs
  const [realNeed, setRealNeed] = useState<string[]>([]);

  // Step 5 - decision
  const [showCelebration, setShowCelebration] = useState(false);
  const [decided, setDecided] = useState<'strong' | 'help' | null>(null);

  // ─── Breathing logic ───────────────────────────────────────
  useEffect(() => {
    if (!breathStarted || step !== 0) return;

    const durations: Record<BreathPhase, number> = {
      inhale: 4000,
      hold: 4000,
      exhale: 4000,
    };

    const timer = setTimeout(() => {
      if (breathPhase === 'inhale') setBreathPhase('hold');
      else if (breathPhase === 'hold') setBreathPhase('exhale');
      else {
        const nextCycle = breathCycle + 1;
        setBreathCycle(nextCycle);
        if (nextCycle >= 3) {
          // Auto-advance after 3 cycles
          setStep(1);
        } else {
          setBreathPhase('inhale');
        }
      }
    }, durations[breathPhase]);

    return () => clearTimeout(timer);
  }, [breathPhase, breathCycle, breathStarted, step]);

  const startBreathing = useCallback(() => {
    setBreathStarted(true);
    setBreathPhase('inhale');
    setBreathCycle(0);
  }, []);

  // ─── Helpers ───────────────────────────────────────────────

  const toggleInArray = (arr: string[], id: string): string[] =>
    arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];

  const selectedGiveLabel = whatItGives
    .map((id) => WHAT_IT_GIVES.find((g) => g.id === id)?.label)
    .filter(Boolean)
    .join(', ');

  const handleDecisionStrong = () => {
    setDecided('strong');
    setShowCelebration(true);
    onComplete({
      habitId: selectedHabitId,
      overcame: true,
      urgeIntensity,
      trigger: selectedTrigger,
      whatItGives,
      whatItCosts,
      realNeed,
    });
  };

  const handleDecisionHelp = () => {
    setDecided('help');
    onComplete({
      habitId: selectedHabitId,
      overcame: false,
      urgeIntensity,
      trigger: selectedTrigger,
      whatItGives,
      whatItCosts,
      realNeed,
    });
    onNavigate('sos');
  };

  const breathLabel: Record<BreathPhase, string> = {
    inhale: 'שאף פנימה...',
    hold: 'החזק...',
    exhale: 'נשוף החוצה...',
  };

  const breathScale = breathPhase === 'exhale' ? 0.7 : 1.3;

  const randomQuote =
    MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];

  // ─── Render ────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col overflow-y-auto"
      dir="rtl"
      style={{ background: STEP_BACKGROUNDS[step] || STEP_BACKGROUNDS[0] }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 relative z-10">
        {step > 0 && step < 6 ? (
          <button
            onClick={() => {
              if (step === 2 && showCosts) {
                setShowCosts(false);
              } else {
                setStep(step - 1);
              }
            }}
            className="p-2 rounded-full bg-white/10 text-white/80"
          >
            <ChevronRight size={20} />
          </button>
        ) : (
          <div className="w-9" />
        )}
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 text-white/80"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-5 pb-4">
        <AnimatePresence mode="wait">
          {/* ═══ Step 0: Breathing ═══ */}
          {step === 0 && (
            <motion.div
              key="breathing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-white mb-2"
              >
                עצור רגע
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/70 mb-10 text-center"
              >
                קח 3 נשימות עמוקות איתי
              </motion.p>

              {/* Breathing circle */}
              <button
                onClick={!breathStarted ? startBreathing : undefined}
                className="relative flex items-center justify-center w-52 h-52 mb-8"
              >
                {/* Outer glow */}
                <motion.div
                  className="absolute rounded-full"
                  style={{ width: 200, height: 200, backgroundColor: 'rgba(3,178,140,0.25)' }}
                  animate={{
                    scale: breathStarted ? breathScale * 1.15 : 1,
                    opacity: breathStarted ? 0.4 : 0.2,
                  }}
                  transition={{ duration: 4, ease: 'easeInOut' }}
                />
                {/* Main circle */}
                <motion.div
                  className="absolute rounded-full flex items-center justify-center"
                  style={{
                    width: 160,
                    height: 160,
                    backgroundColor: 'rgba(3,178,140,0.25)',
                    border: '2px solid rgba(3,178,140,0.5)',
                  }}
                  animate={{
                    scale: breathStarted ? breathScale : 1,
                  }}
                  transition={{ duration: 4, ease: 'easeInOut' }}
                >
                  <span className="text-white/90 text-sm font-medium">
                    {breathStarted ? breathLabel[breathPhase] : 'לחץ להתחלה'}
                  </span>
                </motion.div>
              </button>

              {breathStarted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="flex gap-1.5">
                    {(['inhale', 'hold', 'exhale'] as BreathPhase[]).map(
                      (p) => (
                        <div
                          key={p}
                          className="w-2.5 h-2.5 rounded-full transition-colors duration-300"
                          style={{
                            backgroundColor:
                              breathPhase === p
                                ? 'rgba(3,178,140,1)'
                                : 'rgba(255,255,255,0.2)',
                          }}
                        />
                      )
                    )}
                  </div>
                  <span className="text-sm text-white/60">
                    נשימה {breathCycle + 1} מתוך 3
                  </span>
                </motion.div>
              )}

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={() => setStep(1)}
                className="text-white/40 text-sm underline mt-4"
              >
                דלג
              </motion.button>
            </motion.div>
          )}

          {/* ═══ Step 1: What's happening ═══ */}
          {step === 1 && (
            <motion.div
              key="whats-happening"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              <h1 className="text-2xl font-bold text-white mb-1 text-center">
                מה קורה עכשיו?
              </h1>
              <p className="text-white/60 text-sm mb-6 text-center">
                בוא נבין יחד מה מתרחש
              </p>

              {/* Habit selector */}
              {habits.length > 1 && (
                <div className="mb-5">
                  <p className="text-white/80 text-sm font-medium mb-2">
                    באיזה הרגל מדובר?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {habits
                      .filter((h) => h.type === 'quit' && h.isActive)
                      .map((h) => (
                        <button
                          key={h.id}
                          onClick={() => setSelectedHabitId(h.id)}
                          className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                          style={{
                            backgroundColor:
                              selectedHabitId === h.id
                                ? 'rgba(3,178,140,0.8)'
                                : 'rgba(255,255,255,0.1)',
                            color:
                              selectedHabitId === h.id
                                ? 'white'
                                : 'rgba(255,255,255,0.7)',
                            border:
                              selectedHabitId === h.id
                                ? '2px solid rgba(3,178,140,1)'
                                : '2px solid rgba(255,255,255,0.15)',
                          }}
                        >
                          {h.name}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Urge intensity */}
              <div className="mb-5">
                <p className="text-white/80 text-sm font-medium mb-3">
                  עוצמת הדחף:{' '}
                  <span
                    className="font-bold text-lg"
                    style={{
                      color:
                        urgeIntensity <= 3
                          ? '#86efac'
                          : urgeIntensity <= 6
                          ? '#fde047'
                          : urgeIntensity <= 8
                          ? '#fdba74'
                          : '#fca5a5',
                    }}
                  >
                    {urgeIntensity}/10
                  </span>
                </p>
                <div className="relative">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={urgeIntensity}
                    onChange={(e) =>
                      setUrgeIntensity(parseInt(e.target.value))
                    }
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to left, #86efac, #fde047, #fca5a5)`,
                    }}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-white/40">10</span>
                    <span className="text-[10px] text-white/40">1</span>
                  </div>
                </div>
              </div>

              {/* Trigger */}
              <div className="mb-5">
                <p className="text-white/80 text-sm font-medium mb-2">
                  מה הטריגר?
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {TRIGGERS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTrigger(t.id)}
                      className="flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-medium transition-all"
                      style={{
                        backgroundColor:
                          selectedTrigger === t.id
                            ? 'rgba(3,178,140,0.7)'
                            : 'rgba(255,255,255,0.08)',
                        border:
                          selectedTrigger === t.id
                            ? '2px solid rgba(3,178,140,1)'
                            : '2px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.9)',
                      }}
                    >
                      <span className="text-lg">{t.emoji}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Continue */}
              <motion.button
                animate={{
                  opacity: selectedTrigger ? 1 : 0.3,
                }}
                whileTap={selectedTrigger ? { scale: 0.95 } : undefined}
                onClick={() => selectedTrigger && setStep(2)}
                disabled={!selectedTrigger}
                className="mt-auto mb-2 w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: selectedTrigger
                    ? 'rgba(3,178,140,0.9)'
                    : 'rgba(255,255,255,0.1)',
                }}
              >
                <span>המשך</span>
                <ArrowLeft size={18} />
              </motion.button>
            </motion.div>
          )}

          {/* ═══ Step 2: Be honest ═══ */}
          {step === 2 && (
            <motion.div
              key="be-honest"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              <h1 className="text-2xl font-bold text-white mb-1 text-center">
                בוא נהיה כנים
              </h1>

              <AnimatePresence mode="wait">
                {!showCosts ? (
                  <motion.div
                    key="gives"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col"
                  >
                    <p className="text-white/60 text-sm mb-5 text-center">
                      מה ההרגל הזה באמת נותן לך?
                    </p>

                    <div className="grid grid-cols-2 gap-2.5">
                      {WHAT_IT_GIVES.map((item, i) => {
                        const isSelected = whatItGives.includes(item.id);
                        return (
                          <motion.button
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() =>
                              setWhatItGives(
                                toggleInArray(whatItGives, item.id)
                              )
                            }
                            className="flex items-center gap-2 p-3 rounded-xl text-sm text-right transition-all"
                            style={{
                              backgroundColor: isSelected
                                ? 'rgba(3,178,140,0.6)'
                                : 'rgba(255,255,255,0.08)',
                              border: isSelected
                                ? '2px solid rgba(3,178,140,1)'
                                : '2px solid rgba(255,255,255,0.1)',
                              color: 'rgba(255,255,255,0.9)',
                            }}
                          >
                            <span className="text-lg shrink-0">
                              {item.emoji}
                            </span>
                            <span className="leading-tight">{item.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>

                    <motion.button
                      animate={{ opacity: whatItGives.length > 0 ? 1 : 0.3 }}
                      whileTap={
                        whatItGives.length > 0 ? { scale: 0.95 } : undefined
                      }
                      onClick={() =>
                        whatItGives.length > 0 && setShowCosts(true)
                      }
                      disabled={whatItGives.length === 0}
                      className="mt-auto mb-2 w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor:
                          whatItGives.length > 0
                            ? 'rgba(3,178,140,0.9)'
                            : 'rgba(255,255,255,0.1)',
                      }}
                    >
                      <span>ומה זה עולה לך?</span>
                      <ArrowLeft size={18} />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="costs"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col"
                  >
                    <p className="text-white/60 text-sm mb-5 text-center">
                      ומה זה עולה לך?
                    </p>

                    <div className="grid grid-cols-2 gap-2.5">
                      {WHAT_IT_COSTS.map((item, i) => {
                        const isSelected = whatItCosts.includes(item.id);
                        return (
                          <motion.button
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() =>
                              setWhatItCosts(
                                toggleInArray(whatItCosts, item.id)
                              )
                            }
                            className="flex items-center gap-2 p-3 rounded-xl text-sm text-right transition-all"
                            style={{
                              backgroundColor: isSelected
                                ? 'rgba(180,80,80,0.5)'
                                : 'rgba(255,255,255,0.08)',
                              border: isSelected
                                ? '2px solid rgba(220,100,100,0.8)'
                                : '2px solid rgba(255,255,255,0.1)',
                              color: 'rgba(255,255,255,0.9)',
                            }}
                          >
                            <span className="text-lg shrink-0">
                              {item.emoji}
                            </span>
                            <span className="leading-tight">{item.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>

                    <motion.button
                      animate={{ opacity: whatItCosts.length > 0 ? 1 : 0.3 }}
                      whileTap={
                        whatItCosts.length > 0 ? { scale: 0.95 } : undefined
                      }
                      onClick={() =>
                        whatItCosts.length > 0 && setStep(3)
                      }
                      disabled={whatItCosts.length === 0}
                      className="mt-auto mb-2 w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor:
                          whatItCosts.length > 0
                            ? 'rgba(3,178,140,0.9)'
                            : 'rgba(255,255,255,0.1)',
                      }}
                    >
                      <span>המשך</span>
                      <ArrowLeft size={18} />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ═══ Step 3: What you really want ═══ */}
          {step === 3 && (
            <motion.div
              key="real-want"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              <h1 className="text-2xl font-bold text-white mb-1 text-center">
                מה אתה באמת רוצה?
              </h1>
              <p className="text-white/50 text-sm mb-2 text-center leading-relaxed">
                ההרגל נותן לך{' '}
                <span className="text-white/70">{selectedGiveLabel || '...'}</span>
              </p>
              <p className="text-white/60 text-sm mb-5 text-center">
                אבל מה אתה <span className="font-bold text-white/90">באמת</span>{' '}
                רוצה?
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                {REAL_NEEDS.map((item, i) => {
                  const isSelected = realNeed.includes(item.id);
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() =>
                        setRealNeed(toggleInArray(realNeed, item.id))
                      }
                      className="flex items-center gap-2 p-3 rounded-xl text-sm text-right transition-all"
                      style={{
                        backgroundColor: isSelected
                          ? 'rgba(3,178,140,0.6)'
                          : 'rgba(255,255,255,0.08)',
                        border: isSelected
                          ? '2px solid rgba(139,195,155,0.8)'
                          : '2px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.9)',
                        boxShadow: isSelected
                          ? '0 0 15px rgba(3,178,140,0.3)'
                          : 'none',
                      }}
                    >
                      <span className="text-lg shrink-0">{item.emoji}</span>
                      <span className="leading-tight">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                animate={{ opacity: realNeed.length > 0 ? 1 : 0.3 }}
                whileTap={realNeed.length > 0 ? { scale: 0.95 } : undefined}
                onClick={() => realNeed.length > 0 && setStep(4)}
                disabled={realNeed.length === 0}
                className="mt-auto mb-2 w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                style={{
                  backgroundColor:
                    realNeed.length > 0
                      ? 'rgba(3,178,140,0.9)'
                      : 'rgba(255,255,255,0.1)',
                }}
              >
                <span>המשך</span>
                <ArrowLeft size={18} />
              </motion.button>
            </motion.div>
          )}

          {/* ═══ Step 4: Two Futures ═══ */}
          {step === 4 && (
            <motion.div
              key="two-futures"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              <h1 className="text-2xl font-bold text-white mb-1 text-center">
                שני עתידות
              </h1>
              <p className="text-white/60 text-sm mb-5 text-center">
                איזה עתיד אתה בוחר?
              </p>

              <div className="flex gap-3 flex-1">
                {/* Give in - red */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex-1 rounded-2xl p-4 flex flex-col gap-3"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(180,60,60,0.25) 0%, rgba(120,40,40,0.15) 100%)',
                    border: '1px solid rgba(220,100,100,0.3)',
                  }}
                >
                  <p className="text-sm font-bold text-center" style={{ color: '#fca5a5' }}>
                    אם תיכנע עכשיו...
                  </p>

                  <div className="flex flex-col gap-2.5">
                    {[
                      { time: 'בעוד 5 דקות', text: 'תחושת אשמה' },
                      { time: 'בעוד שעה', text: 'כלום לא השתנה' },
                      { time: 'בעוד חודש', text: 'אותו מעגל בדיוק' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.15 }}
                        className="rounded-lg p-2.5"
                        style={{
                          backgroundColor: 'rgba(180,60,60,0.2)',
                        }}
                      >
                        <p className="text-[10px] font-medium" style={{ color: '#fca5a5' }}>
                          {item.time}:
                        </p>
                        <p className="text-xs text-white/80">{item.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Choose different - green */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex-1 rounded-2xl p-4 flex flex-col gap-3"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(2,154,121,0.25) 0%, rgba(40,100,60,0.15) 100%)',
                    border: '1px solid rgba(100,200,120,0.3)',
                  }}
                >
                  <p className="text-sm font-bold text-center" style={{ color: '#86efac' }}>
                    אם תבחר אחרת...
                  </p>

                  <div className="flex flex-col gap-2.5">
                    {[
                      { time: 'בעוד 5 דקות', text: 'גאווה שהתגברת' },
                      { time: 'בעוד שעה', text: 'הדחף נעלם' },
                      { time: 'בעוד חודש', text: 'אדם חזק יותר' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.15 }}
                        className="rounded-lg p-2.5"
                        style={{
                          backgroundColor: 'rgba(2,154,121,0.2)',
                        }}
                      >
                        <p className="text-[10px] font-medium" style={{ color: '#86efac' }}>
                          {item.time}:
                        </p>
                        <p className="text-xs text-white/80">{item.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(5)}
                className="mt-4 mb-2 w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: 'rgba(3,178,140,0.9)' }}
              >
                <span>אני מוכן לבחור</span>
                <ArrowLeft size={18} />
              </motion.button>
            </motion.div>
          )}

          {/* ═══ Step 5: Your Decision ═══ */}
          {step === 5 && (
            <motion.div
              key="decision"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              {!decided && (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                    style={{ backgroundColor: 'rgba(3,178,140,0.2)' }}
                  >
                    <Shield size={36} className="text-white/80" />
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-white mb-2 text-center"
                  >
                    ההחלטה שלך
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-white/60 text-center mb-10 leading-relaxed max-w-xs"
                  >
                    אתה לא צריך להיכנע.
                    <br />
                    <span className="text-white/90 font-semibold">
                      אתה בוחר.
                    </span>
                  </motion.p>

                  <div className="flex flex-col gap-3 w-full max-w-sm">
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDecisionStrong}
                      className="w-full py-4 rounded-2xl font-bold text-lg text-white flex items-center justify-center gap-3"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(2,154,121,0.8) 0%, rgba(3,178,140,0.9) 100%)',
                        border: '2px solid rgba(100,200,120,0.4)',
                        boxShadow: '0 4px 20px rgba(2,154,121,0.3)',
                      }}
                    >
                      <span>🦁</span>
                      <span>אני בוחר להיות חזק</span>
                    </motion.button>

                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDecisionHelp}
                      className="w-full py-3.5 rounded-2xl font-semibold text-white/90 flex items-center justify-center gap-3"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: '2px solid rgba(255,200,50,0.3)',
                      }}
                    >
                      <span>💛</span>
                      <span>אני צריך עזרה נוספת</span>
                    </motion.button>
                  </div>
                </>
              )}

              {/* Celebration */}
              {decided === 'strong' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-24 h-24 rounded-full flex items-center justify-center mb-5"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(2,154,121,0.6), rgba(3,178,140,0.7))',
                      boxShadow: '0 0 40px rgba(2,154,121,0.4)',
                    }}
                  >
                    <Trophy size={44} className="text-white" />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-white mb-2"
                  >
                    גיבור אמיתי! 🎉
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/70 text-center mb-8 leading-relaxed"
                  >
                    בחרת בעצמך. זה הרגע שמשנה הכל.
                    <br />
                    הניצחון הזה נשמר ביומן שלך.
                  </motion.p>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(6)}
                    className="px-8 py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                    style={{ backgroundColor: 'rgba(3,178,140,0.9)' }}
                  >
                    <Sparkles size={18} />
                    <span>מה עכשיו?</span>
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ═══ Step 6: What now ═══ */}
          {step === 6 && (
            <motion.div
              key="what-now"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                style={{ backgroundColor: 'rgba(3,178,140,0.2)' }}
              >
                <Heart size={28} className="text-white/80" />
              </motion.div>

              <h1 className="text-2xl font-bold text-white mb-1 text-center">
                מה עכשיו?
              </h1>
              <p className="text-white/60 text-sm mb-4 text-center">
                תעשה משהו טוב לעצמך במקום
              </p>

              {/* Habit-specific replacements */}
              {(() => {
                const selectedHabit = habits.find(h => h.id === selectedHabitId);
                const template = selectedHabit && HABIT_TEMPLATES.find(t =>
                  t.name === selectedHabit.name || (t.category === selectedHabit.category && t.type === selectedHabit.type)
                );
                if (!template?.replacementBehavior) return null;
                const replacements = template.replacementBehavior.split(',').map(s => s.trim());
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-sm mb-5 rounded-2xl p-4"
                    style={{
                      backgroundColor: 'rgba(5,156,192,0.25)',
                      border: '1px solid rgba(5,156,192,0.4)',
                    }}
                  >
                    <p className="text-sm font-semibold text-white/90 mb-2 text-center">
                      🔄 תחליפים ל{selectedHabit?.name}
                    </p>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {replacements.map((r, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1.5 rounded-full font-medium"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.12)',
                            color: 'rgba(255,255,255,0.85)',
                          }}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                    {template.tinyVersion && (
                      <p className="text-[11px] text-white/50 text-center mt-2 italic">
                        💡 {template.tinyVersion}
                      </p>
                    )}
                  </motion.div>
                );
              })()}

              {/* Alternative activities */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-6">
                {ALTERNATIVE_ACTIVITIES.map((act, i) => {
                  const Icon = act.icon;
                  return (
                    <motion.button
                      key={act.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (act.id === 'gallery') {
                          onClose();
                        }
                      }}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                      }}
                    >
                      <Icon size={24} className="text-white/70" />
                      <span className="text-sm text-white/80 font-medium">
                        {act.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Motivational quote */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="rounded-2xl p-4 mb-6 w-full max-w-sm text-center"
                style={{
                  backgroundColor: 'rgba(3,178,140,0.25)',
                  border: '1px solid rgba(3,178,140,0.4)',
                }}
              >
                <Flame size={18} className="text-white/50 mx-auto mb-2" />
                <p className="text-sm text-white/80 leading-relaxed italic">
                  &ldquo;{randomQuote}&rdquo;
                </p>
              </motion.div>

              {/* Back to app */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-full max-w-sm py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: 'rgba(3,178,140,0.9)' }}
              >
                <span>חזור לאפליקציה</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 pb-6">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === step ? 24 : 6,
              backgroundColor:
                i === step
                  ? 'rgba(3,178,140,1)'
                  : i < step
                  ? 'rgba(3,178,140,0.5)'
                  : 'rgba(255,255,255,0.25)',
            }}
          />
        ))}
      </div>

      {/* Confetti overlay */}
      <Confetti active={showCelebration} onComplete={() => setShowCelebration(false)} />
    </div>
  );
}
