import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { HABIT_TEMPLATES, GOAL_TEMPLATES, HABIT_BARRIERS } from '../../data/habitTemplates';

// ===== STEP DATA =====

const PAIN_POINTS = [
  { id: 'addiction', emoji: '🔗', label: 'התמכרות שקשה לי לעצור' },
  { id: 'anxiety', emoji: '😰', label: 'חרדה או לחץ יומיומי' },
  { id: 'no-discipline', emoji: '😩', label: 'חוסר משמעת עצמית' },
  { id: 'screens', emoji: '📱', label: 'תלות במסכים ורשתות' },
  { id: 'health', emoji: '🏥', label: 'בריאות גופנית ירודה' },
  { id: 'sleep', emoji: '😴', label: 'שינה לא טובה' },
  { id: 'loneliness', emoji: '🫥', label: 'בדידות או ניתוק' },
  { id: 'money', emoji: '💸', label: 'בזבוז כסף על הרגלים רעים' },
  { id: 'low-energy', emoji: '🔋', label: 'עייפות וחוסר אנרגיה' },
  { id: 'self-esteem', emoji: '🪞', label: 'ביטחון עצמי נמוך' },
];

const QUIT_HABITS_OPTIONS = HABIT_TEMPLATES.filter(t => t.type === 'quit').map(t => ({
  id: t.id,
  emoji: t.emoji,
  label: t.name,
  category: t.category,
}));

const BUILD_HABITS_OPTIONS = HABIT_TEMPLATES.filter(t => t.type === 'build').map(t => ({
  id: t.id,
  emoji: t.emoji,
  label: t.name,
  category: t.category,
}));

const GOALS_OPTIONS = GOAL_TEMPLATES.map(g => ({
  id: g.id,
  emoji: g.emoji,
  label: g.name,
  description: g.description,
}));

const BARRIER_OPTIONS = HABIT_BARRIERS.map(b => ({
  id: b.id,
  emoji: b.emoji,
  label: b.name,
  description: b.description,
}));

const MOTIVATION_LEVELS = [
  { id: 'very-high', emoji: '🔥', label: 'מלא מוטיבציה!', sub: 'מוכן לשנות הכל' },
  { id: 'high', emoji: '💪', label: 'רוצה מאוד', sub: 'בא לי להתחיל' },
  { id: 'medium', emoji: '🤔', label: 'רוצה לנסות', sub: 'לא בטוח שאצליח' },
  { id: 'low', emoji: '😔', label: 'עייף מלהיכשל', sub: 'אבל עדיין כאן' },
];

const TOTAL_STEPS = 7;

export interface OnboardingResult {
  name: string;
  painPoints: string[];
  quitHabits: string[];
  buildHabits: string[];
  goals: string[];
  barriers: string[];
  motivationLevel: string;
}

interface Props {
  onComplete: (result: OnboardingResult) => void;
}

export default function OnboardingQuestionnaire({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [painPoints, setPainPoints] = useState<string[]>([]);
  const [quitHabits, setQuitHabits] = useState<string[]>([]);
  const [buildHabits, setBuildHabits] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [barriers, setBarriers] = useState<string[]>([]);
  const [motivationLevel, setMotivationLevel] = useState('');
  const [direction, setDirection] = useState(1);

  const toggleSelection = useCallback((_list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, id: string) => {
    setList(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const canProceed = () => {
    switch (step) {
      case 0: return name.trim().length > 0;
      case 1: return painPoints.length > 0;
      case 2: return quitHabits.length > 0;
      case 3: return true; // build habits are optional
      case 4: return goals.length > 0;
      case 5: return true; // barriers optional
      case 6: return motivationLevel !== '';
      default: return false;
    }
  };

  const goNext = () => {
    if (step === TOTAL_STEPS - 1) {
      onComplete({ name: name.trim(), painPoints, quitHabits, buildHabits, goals, barriers, motivationLevel });
      return;
    }
    // Skip quit habits if no addiction/screens/money pain points
    if (step === 1) {
      const hasQuitRelevance = painPoints.some(p => ['addiction', 'screens', 'money', 'sleep', 'health'].includes(p));
      if (!hasQuitRelevance) {
        setDirection(1);
        setStep(3); // skip to build habits
        return;
      }
    }
    setDirection(1);
    setStep(s => s + 1);
  };

  const goBack = () => {
    if (step === 0) return;
    // Handle skip-back for quit habits
    if (step === 3 && quitHabits.length === 0) {
      const hasQuitRelevance = painPoints.some(p => ['addiction', 'screens', 'money', 'sleep', 'health'].includes(p));
      if (!hasQuitRelevance) {
        setDirection(-1);
        setStep(1);
        return;
      }
    }
    setDirection(-1);
    setStep(s => s - 1);
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  const renderMultiSelect = (
    options: { id: string; emoji: string; label: string; description?: string; sub?: string }[],
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>,
    columns: 1 | 2 = 2,
  ) => (
    <div className={`grid gap-2 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {options.map(opt => {
        const isSelected = selected.includes(opt.id);
        return (
          <motion.button
            key={opt.id}
            whileTap={{ scale: 0.96 }}
            onClick={() => toggleSelection(selected, setSelected, opt.id)}
            className={`relative text-right px-3 py-2.5 rounded-xl border-2 transition-all ${
              isSelected ? 'border-sage bg-sage/8' : 'border-cream-dark bg-card'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl flex-shrink-0">{opt.emoji}</span>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium text-text block">{opt.label}</span>
                {opt.description && <span className="text-[11px] text-text-light block mt-0.5 leading-tight">{opt.description}</span>}
                {opt.sub && <span className="text-[11px] text-text-light block mt-0.5">{opt.sub}</span>}
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 bg-sage"
                >
                  ✓
                </motion.div>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );

  const renderSingleSelect = (
    options: { id: string; emoji: string; label: string; sub?: string }[],
    selected: string,
    setSelected: (v: string) => void,
  ) => (
    <div className="grid grid-cols-1 gap-2">
      {options.map(opt => {
        const isSelected = selected === opt.id;
        return (
          <motion.button
            key={opt.id}
            whileTap={{ scale: 0.96 }}
            onClick={() => setSelected(opt.id)}
            className={`text-right p-4 rounded-xl border-2 transition-all ${
              isSelected ? 'border-sage bg-sage/8' : 'border-cream-dark bg-card'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{opt.emoji}</span>
              <div>
                <span className="text-sm font-semibold text-text block">{opt.label}</span>
                {opt.sub && <span className="text-xs text-text-light block mt-0.5">{opt.sub}</span>}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 0: // Name
        return (
          <div className="space-y-6">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="text-6xl mb-4"
              >
                🌱
              </motion.div>
              <h1 className="text-2xl font-bold text-text mb-2">ברוכים הבאים ל-Wini</h1>
              <p className="text-text-light text-sm">בוא נכיר קצת, כדי שנוכל לעזור לך בדיוק במה שצריך</p>
            </div>
            <div>
              <label className="text-sm font-medium text-text mb-2 block">איך קוראים לך?</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="השם או הכינוי שלך..."
                className="w-full bg-card rounded-xl p-4 text-text text-center text-lg border border-cream-dark focus:border-sage focus:outline-none"
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter' && name.trim()) goNext(); }}
              />
            </div>
          </div>
        );

      case 1: // Pain points
        return (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold text-text">מה הכי מפריע לך היום?</h2>
              <p className="text-text-light text-sm mt-1">בחר את מה שהכי מדבר אליך (אפשר כמה)</p>
            </div>
            {renderMultiSelect(PAIN_POINTS, painPoints, setPainPoints, 1)}
          </div>
        );

      case 2: // Quit habits
        return (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold text-text">ממה אתה רוצה להיגמל?</h2>
              <p className="text-text-light text-sm mt-1">בחר את ההרגלים שאתה רוצה לעזוב</p>
            </div>
            {renderMultiSelect(QUIT_HABITS_OPTIONS, quitHabits, setQuitHabits)}
          </div>
        );

      case 3: // Build habits
        return (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold text-text">מה אתה רוצה לבנות?</h2>
              <p className="text-text-light text-sm mt-1">הרגלים חיוביים שתרצה לפתח (אופציונלי)</p>
            </div>
            {renderMultiSelect(BUILD_HABITS_OPTIONS, buildHabits, setBuildHabits)}
          </div>
        );

      case 4: // Goals
        return (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold text-text">מה המטרה הגדולה?</h2>
              <p className="text-text-light text-sm mt-1">לאן אתה רוצה להגיע?</p>
            </div>
            {renderMultiSelect(GOALS_OPTIONS, goals, setGoals, 1)}
          </div>
        );

      case 5: // Barriers
        return (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold text-text">מה בדרך כלל עוצר אותך?</h2>
              <p className="text-text-light text-sm mt-1">חסמים שאתה מזהה (אופציונלי)</p>
            </div>
            {renderMultiSelect(BARRIER_OPTIONS, barriers, setBarriers, 1)}
          </div>
        );

      case 6: // Motivation + summary
        return (
          <div className="space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold text-text">איפה אתה עכשיו?</h2>
              <p className="text-text-light text-sm mt-1">רמת המוטיבציה שלך היום</p>
            </div>
            {renderSingleSelect(MOTIVATION_LEVELS, motivationLevel, setMotivationLevel)}

            {/* Mini summary */}
            {motivationLevel && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-sage/5 rounded-xl p-4 border border-sage/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-sage" />
                  <span className="text-sm font-semibold text-sage">הפרופיל שלך מוכן!</span>
                </div>
                <div className="text-xs text-text-light space-y-1">
                  {quitHabits.length > 0 && <p>🚫 {quitHabits.length} הרגלים לגמילה</p>}
                  {buildHabits.length > 0 && <p>🌱 {buildHabits.length} הרגלים לבנייה</p>}
                  {goals.length > 0 && <p>🎯 {goals.length} מטרות</p>}
                  {barriers.length > 0 && <p>🛡️ {barriers.length} חסמים זוהו</p>}
                </div>
              </motion.div>
            )}
          </div>
        );
    }
  };

  // Step labels for progress
  const stepLabels = ['שם', 'כאבים', 'גמילה', 'בנייה', 'מטרות', 'חסמים', 'סיכום'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-cream z-[110] flex flex-col"
      dir="rtl"
    >
      {/* Progress bar */}
      <div className="px-4 pt-4 pb-2 safe-area-top max-w-md mx-auto w-full">
        <div className="flex items-center gap-1 mb-2">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                  i <= step ? 'bg-sage' : 'bg-cream-dark'
                }`}
              />
              <span
                className={`text-[9px] transition-colors ${
                  i <= step ? 'text-sage' : 'text-text-light'
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto px-5 pb-28 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="py-4"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation - fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-[115] px-5 pb-6 pt-3 bg-gradient-to-t from-cream via-cream to-cream/0">
        <div className="max-w-md mx-auto w-full">
        <div className="flex gap-3">
          {step > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={goBack}
              className="flex items-center justify-center gap-1 px-5 py-3.5 rounded-xl border-2 border-cream-dark text-text-light font-medium"
            >
              <ChevronRight size={18} />
              <span>חזרה</span>
            </motion.button>
          )}

          <motion.button
            whileTap={canProceed() ? { scale: 0.95 } : undefined}
            onClick={goNext}
            disabled={!canProceed()}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-base transition-all ${
              canProceed() ? 'bg-sage cursor-pointer' : 'bg-sage/30 cursor-not-allowed'
            }`}
          >
            {step === TOTAL_STEPS - 1 ? (
              <>
                <Sparkles size={18} />
                <span>בוא נתחיל!</span>
              </>
            ) : (
              <>
                <span>המשך</span>
                <ChevronLeft size={18} />
              </>
            )}
          </motion.button>
        </div>

        {step === 0 && (
          <p className="text-[11px] text-text-light/50 mt-3 text-center">
            כל הנתונים שלך נשמרים על המכשיר שלך בלבד
          </p>
        )}
        </div>
      </div>
    </motion.div>
  );
}
