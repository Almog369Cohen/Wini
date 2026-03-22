import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ArrowRight, ArrowLeft, X, Plus, Check,
  Feather, Eye, HandHeart, Scale, PenTool, Wind,
  Sparkles, Shield, Lightbulb, Zap, ChevronDown,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { Habit, FarewellLetter, FarewellMoment } from '../../types';
import type { useFarewellLetters } from '../../hooks/useFarewellLetters';

// ─── Phase Config ─────────────────────────────────────────────────

const PHASES = [
  { id: 'recognition', title: 'הכרה', emoji: '👁️', subtitle: 'מודים שהוא הגיע כדי להגן', icon: Eye, gradient: 'from-[#059669] to-[#10b981]' },
  { id: 'needs', title: 'הצורך האמיתי', emoji: '💡', subtitle: 'חושפים את מה שבאמת חיפשת', icon: Lightbulb, gradient: 'from-[#059cc0] to-[#06b6d4]' },
  { id: 'thanks', title: 'תודה', emoji: '🤲', subtitle: 'מודים למגן לפני שנפרדים', icon: HandHeart, gradient: 'from-[#059669] to-[#34d399]' },
  { id: 'truth', title: 'האמת', emoji: '⚖️', subtitle: 'מה ההרגל באמת עלה לך', icon: Scale, gradient: 'from-[#ef4444] to-[#f87171]' },
  { id: 'letter', title: 'מכתב הפרידה', emoji: '✍️', subtitle: 'כותבים ישירות אל ההרגל', icon: PenTool, gradient: 'from-[#059669] to-[#10b981]' },
  { id: 'release', title: 'טקס שחרור', emoji: '🌬️', subtitle: 'משחררים ומתחייבים מחדש', icon: Wind, gradient: 'from-[#059cc0] to-[#06b6d4]' },
];

// ─── Data ─────────────────────────────────────────────────────────

const MOMENT_SUGGESTIONS = [
  { emoji: '😰', label: 'כשהיה לי לחץ', description: 'הוא היה שם כשהעולם היה מכביד עלי' },
  { emoji: '😞', label: 'כשהרגשתי בודד', description: 'הוא מילא את החלל כשאף אחד לא היה שם' },
  { emoji: '😴', label: 'כשהייתי עייף', description: 'הוא נתן לי בריחה כשלא הייתה לי אנרגיה' },
  { emoji: '🎉', label: 'בחגיגות ואירועים', description: 'הוא היה חלק מהרגעים הטובים' },
  { emoji: '😤', label: 'כשכעסתי או התבאסתי', description: 'הוא עזר לי לשחרר מתח' },
  { emoji: '😶', label: 'כשהיה לי שעמום', description: 'הוא מילא את הזמן הריק' },
  { emoji: '💔', label: 'אחרי אכזבה או פגיעה', description: 'הוא נתן נחמה כשכאב' },
  { emoji: '🤝', label: 'ברגעים חברתיים', description: 'הוא עזר לי להרגיש שייך לקבוצה' },
];

const CORE_NEEDS = [
  { id: 'safety', emoji: '🛡️', label: 'בטחון', description: 'הרגשה שהכל בסדר, שליטה במצב' },
  { id: 'connection', emoji: '🤝', label: 'חיבור', description: 'להרגיש שייך, לא לבד בעולם' },
  { id: 'comfort', emoji: '🫂', label: 'נחמה', description: 'הקלה מכאב, שקט פנימי' },
  { id: 'stimulation', emoji: '⚡', label: 'גירוי', description: 'ריגוש, הנאה, חיוניות' },
  { id: 'escape', emoji: '🌊', label: 'בריחה', description: 'לשכוח, להתנתק מהכל רגע' },
  { id: 'control', emoji: '🎯', label: 'שליטה', description: 'להרגיש שאני מחליט, לא חסר אונים' },
  { id: 'reward', emoji: '🏆', label: 'תגמול', description: 'מגיע לי, עבדתי קשה' },
  { id: 'identity', emoji: '🪞', label: 'זהות', description: 'ככה אני, זה חלק ממי שאני' },
];

const COST_CATEGORIES = [
  { emoji: '💊', label: 'בריאות', detail: 'בריאות פיזית או נפשית' },
  { emoji: '💰', label: 'כסף', detail: 'הוצאות ישירות או עקיפות' },
  { emoji: '⏰', label: 'זמן', detail: 'שעות שנבלעו לשום מקום' },
  { emoji: '💑', label: 'מערכות יחסים', detail: 'פגיעה בקשרים חשובים' },
  { emoji: '🪞', label: 'דימוי עצמי', detail: 'איך אתה מרגיש כלפי עצמך' },
  { emoji: '😴', label: 'שינה ומנוחה', detail: 'איכות שינה או התאוששות' },
  { emoji: '🧠', label: 'ריכוז וזיכרון', detail: 'יכולת לתפקד ולחשוב' },
  { emoji: '🔋', label: 'אנרגיה', detail: 'עייפות כרונית, חוסר מוטיבציה' },
  { emoji: '🎯', label: 'מטרות ויעדים', detail: 'דברים שרצית להשיג ולא הצלחת' },
  { emoji: '😊', label: 'שמחה אמיתית', detail: 'הנאה אמתית ומתמשכת' },
];

const LETTER_STARTERS = [
  { starter: 'אני זוכר/ת כשנפגשנו בפעם הראשונה...', hint: 'מתי ההרגל נכנס לחייך?' },
  { starter: 'הגעת לחיי כי...', hint: 'מה גרם לך להתחיל?' },
  { starter: 'מה שבאמת הייתי צריך/ה זה...', hint: 'הצורך האמיתי מאחורי ההרגל' },
  { starter: 'מה שלא אמרתי לך עד עכשיו זה...', hint: 'האמת שקשה להודות בה' },
  { starter: 'מעכשיו, כשאני ארגיש _____, אני אבחר ב...', hint: 'התגובה החדשה שלך' },
  { starter: 'אני נפרד/ת ממך כי...', hint: 'למה עכשיו?' },
];

const NEW_RESPONSE_SUGGESTIONS: Record<string, string[]> = {
  'לחץ': ['נשימה עמוקה 3 דקות', 'הליכה קצרה בחוץ', 'שיחה עם חבר', 'כתיבה ביומן'],
  'בדידות': ['להתקשר למישהו', 'לכתוב ביומן', 'לצאת להליכה', 'להקשיב למוזיקה'],
  'שעמום': ['קריאה', 'תחביב חדש', 'אימון קצר', 'ציור או יצירה'],
  'עייפות': ['תנומה קצרה', 'מתיחות', 'הליכה באוויר', 'שתייה חמה'],
  'כעס': ['לרשום את הרגשות', 'פעילות גופנית', 'נשימות עמוקות', 'להקשיב למוזיקה'],
  'אכזבה': ['לדבר עם מישהו', 'לכתוב מה מרגיש', 'הליכה בטבע', 'מדיטציה'],
};

const MANTRA_SUGGESTIONS = [
  'אני חזק/ה יותר מהדחף',
  'אני בוחר/ת את עצמי',
  'אני ראוי/ה לשינוי',
  'אני בונה חיים חדשים',
  'כל רגע הוא הזדמנות',
  'אני חופשי/ה',
];

// ─── Props ────────────────────────────────────────────────────────

interface FarewellLetterPageProps {
  habits: Habit[];
  farewellLetters: ReturnType<typeof useFarewellLetters>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  onBack: () => void;
}

// ─── Main Component ───────────────────────────────────────────────

export default function FarewellLetterPage({
  habits,
  farewellLetters,
  showToast,
  onBack,
}: FarewellLetterPageProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const quitHabits = habits.filter(h => h.type === 'quit' && h.isActive);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [currentLetterId, setCurrentLetterId] = useState<string | null>(null);
  const [phase, setPhase] = useState(0);

  const currentLetter = currentLetterId
    ? farewellLetters.letters.find(l => l.id === currentLetterId)
    : null;

  const handleSelectHabit = useCallback((habitId: string) => {
    setSelectedHabitId(habitId);
    const existing = farewellLetters.getLetterForHabit(habitId);
    if (existing) {
      setCurrentLetterId(existing.id);
      if (existing.isComplete) {
        setPhase(5);
      } else if (existing.letterText) {
        setPhase(4);
      } else if (existing.costs.length > 0) {
        setPhase(3);
      } else if (existing.thankYou) {
        setPhase(2);
      } else if (existing.needs.length > 0) {
        setPhase(1);
      } else {
        setPhase(0);
      }
    } else {
      const habit = quitHabits.find(h => h.id === habitId);
      if (habit) {
        const letter = farewellLetters.startLetter(habitId, habit.name);
        setCurrentLetterId(letter.id);
        setPhase(0);
      }
    }
  }, [farewellLetters, quitHabits]);

  // No quit habits
  if (quitHabits.length === 0) {
    return (
      <div className="min-h-dvh bg-cream flex items-center justify-center px-6" dir="rtl">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="text-6xl mb-4"
          >
            ✉️
          </motion.div>
          <h2 className="text-xl font-bold text-text mb-2">אין הרגלים לפרידה</h2>
          <p className="text-sm text-text-light mb-6 leading-relaxed">
            קודם הוסף הרגל מסוג &quot;הפסקה&quot;
            <br />
            ואז תוכל לכתוב לו מכתב פרידה
          </p>
          <button onClick={onBack} className="bg-sage text-white px-6 py-3 rounded-xl font-semibold">
            חזרה
          </button>
        </div>
      </div>
    );
  }

  // Habit picker
  if (!selectedHabitId || !currentLetter) {
    return (
      <HabitPicker
        habits={quitHabits}
        existingLetters={farewellLetters.letters}
        onSelect={handleSelectHabit}
        onBack={onBack}
        isDark={isDark}
      />
    );
  }

  const update = (updates: Partial<FarewellLetter>) =>
    farewellLetters.updateLetter(currentLetter.id, updates);

  return (
    <div className="min-h-dvh bg-cream" dir="rtl">
      {/* Sticky header with phase progress */}
      <div className="sticky top-0 z-10 bg-cream/90 backdrop-blur-lg border-b border-cream-dark/50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button onClick={onBack} className="p-2 -mr-2 text-text-light min-h-[44px] min-w-[44px] flex items-center justify-center">
              <X size={20} />
            </button>
            <div className="text-center">
              <p className="text-xs font-bold text-text">פרידה מ{currentLetter.habitName}</p>
              <p className="text-[10px] text-text-light">
                שלב {phase + 1} מתוך 6 - {PHASES[phase]?.title}
              </p>
            </div>
            <div className="w-[44px]" />
          </div>

          {/* Phase progress bar */}
          <div className="flex gap-1">
            {PHASES.map((p, i) => (
              <motion.div
                key={i}
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{
                  backgroundColor: isDark ? '#333335' : '#e5e7eb',
                }}
              >
                <motion.div
                  className="h-full rounded-full"
                  initial={false}
                  animate={{
                    width: i < phase ? '100%' : i === phase ? '50%' : '0%',
                  }}
                  style={{
                    background: i <= phase
                      ? 'linear-gradient(90deg, #03b28c, #059cc0)'
                      : 'transparent',
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </motion.div>
            ))}
          </div>

          {/* Phase labels row */}
          <div className="flex justify-between mt-1.5 px-0.5">
            {PHASES.map((p, i) => (
              <span
                key={i}
                className="text-[8px] font-medium"
                style={{
                  color: i <= phase
                    ? (isDark ? '#6ee7b7' : '#059669')
                    : (isDark ? '#666' : '#9ca3af'),
                }}
              >
                {p.emoji}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Phase content */}
      <div className="px-4 pb-32">
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <PhaseRecognition
              key="p0"
              letter={currentLetter}
              isDark={isDark}
              onUpdate={update}
              onNext={() => setPhase(1)}
            />
          )}
          {phase === 1 && (
            <PhaseNeeds
              key="p1"
              letter={currentLetter}
              isDark={isDark}
              onUpdate={update}
              onNext={() => setPhase(2)}
              onBack={() => setPhase(0)}
            />
          )}
          {phase === 2 && (
            <PhaseThanks
              key="p2"
              letter={currentLetter}
              isDark={isDark}
              onUpdate={update}
              onNext={() => setPhase(3)}
              onBack={() => setPhase(1)}
            />
          )}
          {phase === 3 && (
            <PhaseTruth
              key="p3"
              letter={currentLetter}
              isDark={isDark}
              onUpdate={update}
              onNext={() => setPhase(4)}
              onBack={() => setPhase(2)}
            />
          )}
          {phase === 4 && (
            <PhaseLetterWriting
              key="p4"
              letter={currentLetter}
              isDark={isDark}
              onUpdate={update}
              onNext={() => {
                farewellLetters.completeLetter(currentLetter.id);
                setPhase(5);
              }}
              onBack={() => setPhase(3)}
            />
          )}
          {phase === 5 && (
            <PhaseRelease
              key="p5"
              letter={currentLetter}
              isDark={isDark}
              onUpdate={update}
              onDone={() => {
                showToast('המכתב נשמר. אתה חופשי. 🕊️');
                onBack();
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Habit Picker ─────────────────────────────────────────────────

function HabitPicker({
  habits,
  existingLetters,
  onSelect,
  onBack,
  isDark,
}: {
  habits: Habit[];
  existingLetters: FarewellLetter[];
  onSelect: (id: string) => void;
  onBack: () => void;
  isDark: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-dvh bg-cream px-4 pt-6 pb-24"
      dir="rtl"
    >
      <button onClick={onBack} className="flex items-center gap-1 text-sage text-sm mb-6 min-h-[44px]">
        <ArrowRight size={16} />
        חזרה
      </button>

      {/* Hero */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.1 }}
          className="text-6xl mb-4"
        >
          ✉️
        </motion.div>
        <h1 className="text-2xl font-bold text-text mb-2">מכתב פרידה להרגל</h1>
        <p className="text-sm text-text-light leading-relaxed max-w-xs mx-auto">
          תהליך מודרך שיעזור לך לשחרר את ההרגל בשלום,
          עם הבנה עמוקה של מה שבאמת קורה מתחת לפני השטח.
        </p>
      </div>

      {/* Science card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl p-4 mb-6"
        style={{
          backgroundColor: isDark ? '#1e2d3d' : '#e0f2fe',
          border: `1px solid ${isDark ? '#7dd3fc40' : '#7dd3fc'}`,
        }}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: isDark ? '#1e3535' : '#cffafe' }}>
            <Feather size={20} style={{ color: isDark ? '#67e8f9' : '#0891b2' }} />
          </div>
          <div>
            <p className="text-xs font-bold mb-1" style={{ color: isDark ? '#67e8f9' : '#0891b2' }}>
              למה מכתב פרידה עובד?
            </p>
            <p className="text-[11px] leading-relaxed" style={{ color: isDark ? '#d1d5db' : '#4b5563' }}>
              מחקרים מראים שכתיבה אקספרסיבית מפעילה את הקורטקס הפרה-פרונטלי
              ומפחיתה את הפעילות באמיגדלה. כשאתה כותב את הרגשות, המוח מעבד
              אותם במקום לברוח מהם.
            </p>
          </div>
        </div>
      </motion.div>

      {/* 6 phases preview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-2xl shadow-sm p-4 mb-6"
      >
        <p className="text-xs font-bold text-text mb-3">6 שלבים מובנים מבוססי פסיכולוגיה:</p>
        <div className="space-y-2">
          {PHASES.map((p, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="text-base w-6 text-center">{p.emoji}</span>
              <div className="flex-1">
                <p className="text-[11px] font-semibold text-text">{p.title}</p>
                <p className="text-[9px] text-text-light">{p.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Habit list */}
      <p className="text-sm font-bold text-text mb-3">בחר הרגל לפרידה:</p>
      <div className="space-y-3">
        {habits.map((habit, i) => {
          const existing = existingLetters.find(l => l.habitId === habit.id);
          return (
            <motion.button
              key={habit.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              onClick={() => onSelect(habit.id)}
              className="w-full bg-card rounded-2xl shadow-sm p-4 flex items-center gap-4 text-right min-h-[68px] active:scale-[0.98] transition-transform"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: isDark ? '#3d2528' : '#fee2e2',
                  border: `2px solid ${isDark ? '#fca5a560' : '#fca5a5'}`,
                }}
              >
                <span className="text-xl">🚫</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text">{habit.name}</p>
                <p className="text-[11px] text-text-light">
                  {existing?.isComplete
                    ? '✅ מכתב הושלם - לחץ לקרוא שוב'
                    : existing
                      ? `📝 טיוטה - שלב ${getLetterPhase(existing)} מתוך 6`
                      : '✉️ לחץ לכתוב מכתב פרידה'}
                </p>
              </div>
              <ArrowLeft size={16} className="text-text-light flex-shrink-0" />
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

function getLetterPhase(letter: FarewellLetter): number {
  if (letter.letterText) return 5;
  if (letter.costs.length > 0) return 4;
  if (letter.thankYou) return 3;
  if (letter.needs.length > 0) return 2;
  if (letter.moments.length > 0) return 1;
  return 1;
}

// ─── Phase Intro Card ─────────────────────────────────────────────

function PhaseIntro({
  emoji,
  title,
  description,
  techniqueLabel,
  techniqueExplanation,
  techniqueColor,
  isDark,
}: {
  emoji: string;
  title: string;
  description: string;
  techniqueLabel: string;
  techniqueExplanation: string;
  techniqueColor: 'sage' | 'sea' | 'coral';
  isDark: boolean;
}) {
  const colors = {
    sage: { bg: isDark ? '#1e3530' : '#d1fae5', border: isDark ? '#6ee7b740' : '#6ee7b7', text: isDark ? '#6ee7b7' : '#059669', icon: Shield },
    sea: { bg: isDark ? '#1e2d3d' : '#e0f2fe', border: isDark ? '#7dd3fc40' : '#7dd3fc', text: isDark ? '#67e8f9' : '#0891b2', icon: Heart },
    coral: { bg: isDark ? '#3d2525' : '#fee2e2', border: isDark ? '#fca5a540' : '#fca5a5', text: isDark ? '#fca5a5' : '#dc2626', icon: Scale },
  };
  const c = colors[techniqueColor];
  const Icon = c.icon;

  return (
    <>
      <div className="text-center mb-5">
        <motion.div
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', delay: 0.15 }}
          className="text-4xl mb-2"
        >
          {emoji}
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-xl font-bold text-text mb-1.5"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-sm text-text-light leading-relaxed max-w-xs mx-auto"
        >
          {description}
        </motion.p>
      </div>

      {/* Technique insight card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="rounded-xl p-3.5 mb-5 flex items-start gap-2.5"
        style={{ backgroundColor: c.bg, border: `1px solid ${c.border}` }}
      >
        <Icon size={16} style={{ color: c.text }} className="flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-bold mb-0.5" style={{ color: c.text }}>
            {techniqueLabel}
          </p>
          <p className="text-[11px] leading-relaxed" style={{ color: isDark ? '#d1d5db' : '#4b5563' }}>
            {techniqueExplanation}
          </p>
        </div>
      </motion.div>
    </>
  );
}

// ─── Phase 0: Recognition (IFS + Motivational Interviewing) ──────

function PhaseRecognition({
  letter,
  isDark,
  onUpdate,
  onNext,
}: {
  letter: FarewellLetter;
  isDark: boolean;
  onUpdate: (u: Partial<FarewellLetter>) => void;
  onNext: () => void;
}) {
  const [selectedMoments, setSelectedMoments] = useState<Set<string>>(
    new Set(letter.moments.map(m => m.description))
  );
  const [customMoment, setCustomMoment] = useState('');
  const [personalMemory, setPersonalMemory] = useState(letter.moments[0]?.feeling || '');

  const toggleMoment = (label: string) => {
    setSelectedMoments(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const addCustom = () => {
    if (customMoment.trim()) {
      setSelectedMoments(prev => new Set(prev).add(customMoment.trim()));
      setCustomMoment('');
    }
  };

  const handleNext = () => {
    const moments: FarewellMoment[] = Array.from(selectedMoments).map((desc, i) => ({
      id: `moment-${i}`,
      description: desc,
      feeling: personalMemory,
      realNeed: '',
    }));
    onUpdate({ moments });
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-6"
    >
      <PhaseIntro
        emoji="👁️"
        title="בוא נהיה כנים"
        description={`ההרגל הזה לא הגיע מאין. ${letter.habitName} הגיע כי הייתה סיבה. בוא נכיר בזה לפני שנפרד.`}
        techniqueLabel="תובנה מ-IFS (מערכות משפחתיות פנימיות)"
        techniqueExplanation={`ההרגל היה "חלק מגן" - הוא ניסה להגן עליך בדרך הכי טובה שהוא ידע. הכרה בזה היא לא הצדקה, אלא צעד ראשון לריפוי אמיתי.`}
        techniqueColor="sage"
        isDark={isDark}
      />

      <p className="text-sm font-bold text-text mb-1">
        מתי {letter.habitName} &quot;היה שם בשבילך&quot;?
      </p>
      <p className="text-[11px] text-text-light mb-3">בחר כמה שמתאים</p>

      <div className="space-y-2 mb-5">
        {MOMENT_SUGGESTIONS.map((suggestion, i) => {
          const isSelected = selectedMoments.has(suggestion.label);
          return (
            <motion.button
              key={suggestion.label}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.04 }}
              onClick={() => toggleMoment(suggestion.label)}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl text-right transition-all active:scale-[0.98]"
              style={{
                backgroundColor: isSelected
                  ? (isDark ? '#1e3530' : '#d1fae5')
                  : (isDark ? '#2a2a2c' : '#fff'),
                boxShadow: isSelected
                  ? `0 0 0 2px ${isDark ? '#6ee7b780' : '#059669'}`
                  : '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <span className="text-2xl flex-shrink-0">{suggestion.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: isSelected ? (isDark ? '#6ee7b7' : '#059669') : (isDark ? '#f0f0f0' : '#1f1f21') }}>
                  {suggestion.label}
                </p>
                <p className="text-[10px]" style={{ color: isDark ? '#9a9aa0' : '#6b7280' }}>
                  {suggestion.description}
                </p>
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: isDark ? '#059669' : '#059669' }}
                >
                  <Check size={14} className="text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Custom moment */}
      <div className="mb-5">
        <p className="text-xs font-medium text-text-light mb-2">רגע אישי שלך (אופציונלי):</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={customMoment}
            onChange={(e) => setCustomMoment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustom()}
            placeholder="כתוב רגע ספציפי שאתה זוכר..."
            className="flex-1 bg-card rounded-xl p-3 text-sm text-text border border-cream-dark focus:border-sage focus:outline-none"
          />
          {customMoment.trim() && (
            <button
              onClick={addCustom}
              className="w-11 h-11 rounded-xl bg-sage flex items-center justify-center text-white flex-shrink-0"
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Personal memory */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedMoments.size > 0 ? 1 : 0.4 }}
        className="mb-6"
      >
        <p className="text-sm font-bold text-text mb-1">
          ספר על רגע אחד שאתה זוכר
        </p>
        <p className="text-[11px] text-text-light mb-2">מה הרגשת אז? מה עבר לך בראש?</p>
        <textarea
          value={personalMemory}
          onChange={(e) => setPersonalMemory(e.target.value)}
          placeholder="אני זוכר/ת שפעם..."
          className="w-full bg-card rounded-xl p-4 text-sm text-text border border-cream-dark focus:border-sage focus:outline-none resize-none h-24 leading-relaxed"
        />
      </motion.div>

      <PhaseNav canContinue={selectedMoments.size > 0} onNext={handleNext} isDark={isDark} />
    </motion.div>
  );
}

// ─── Phase 1: Real Needs (NVC) ───────────────────────────────────

function PhaseNeeds({
  letter,
  isDark,
  onUpdate,
  onNext,
  onBack,
}: {
  letter: FarewellLetter;
  isDark: boolean;
  onUpdate: (u: Partial<FarewellLetter>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [selectedNeeds, setSelectedNeeds] = useState<Set<string>>(new Set(letter.needs));

  const toggleNeed = (id: string) => {
    setSelectedNeeds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleNext = () => {
    const needs = Array.from(selectedNeeds);
    const updatedMoments = letter.moments.map((m, i) => ({
      ...m,
      realNeed: needs[i % needs.length] || needs[0] || '',
    }));
    onUpdate({ needs, moments: updatedMoments });
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-6"
    >
      <PhaseIntro
        emoji="💡"
        title="הצורך האמיתי"
        description="מאחורי כל הרגל מסתתר צורך אנושי אמיתי ולגיטימי. הצורך תקין - הדרך למלא אותו, זה מה שאנחנו משנים."
        techniqueLabel="תובנה מ-NVC (תקשורת מקרבת)"
        techniqueExplanation="מרשל רוזנברג לימד שכל התנהגות היא ניסיון למלא צורך. כשמזהים את הצורך האמיתי, אפשר למצוא דרכים בריאות יותר למלא אותו."
        techniqueColor="sea"
        isDark={isDark}
      />

      {/* What they identified in phase 1 */}
      {letter.moments.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl p-3 mb-4 shadow-sm"
        >
          <p className="text-[10px] font-medium text-text-light mb-2">הרגעים שזיהית:</p>
          <div className="flex flex-wrap gap-1.5">
            {letter.moments.map((m, i) => (
              <span
                key={i}
                className="text-[11px] px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: isDark ? '#1e3530' : '#d1fae5',
                  color: isDark ? '#6ee7b7' : '#059669',
                }}
              >
                {m.description}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      <p className="text-sm font-bold text-text mb-1">
        מה באמת חיפשת באותם רגעים?
      </p>
      <p className="text-[11px] text-text-light mb-3">
        חבר/י בין הרגעים לצרכים האמיתיים שמאחוריהם
      </p>

      <div className="grid grid-cols-2 gap-2.5 mb-6">
        {CORE_NEEDS.map((need, i) => {
          const isSelected = selectedNeeds.has(need.id);
          return (
            <motion.button
              key={need.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.04 }}
              onClick={() => toggleNeed(need.id)}
              className="p-3 rounded-xl text-right transition-all relative active:scale-[0.97]"
              style={{
                backgroundColor: isSelected
                  ? (isDark ? '#1e2d3d' : '#e0f2fe')
                  : (isDark ? '#2a2a2c' : '#fff'),
                boxShadow: isSelected
                  ? `0 0 0 2px ${isDark ? '#7dd3fc80' : '#0891b2'}`
                  : '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: isDark ? '#0891b2' : '#0891b2' }}
                >
                  <Check size={12} className="text-white" />
                </motion.div>
              )}
              <span className="text-xl block mb-1">{need.emoji}</span>
              <p className="text-xs font-bold" style={{ color: isSelected ? (isDark ? '#67e8f9' : '#0891b2') : (isDark ? '#f0f0f0' : '#1f1f21') }}>
                {need.label}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: isDark ? '#9a9aa0' : '#6b7280' }}>
                {need.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      <PhaseNav canContinue={selectedNeeds.size > 0} onNext={handleNext} onBack={onBack} isDark={isDark} />
    </motion.div>
  );
}

// ─── Phase 2: Thank You (IFS - Thanking the Protector) ────────────

function PhaseThanks({
  letter,
  isDark,
  onUpdate,
  onNext,
  onBack,
}: {
  letter: FarewellLetter;
  isDark: boolean;
  onUpdate: (u: Partial<FarewellLetter>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [thankYou, setThankYou] = useState(letter.thankYou);

  // Generate suggestions based on selected needs
  const needLabels = letter.needs.map(n => CORE_NEEDS.find(cn => cn.id === n)?.label || n);
  const thankSuggestions = [
    `תודה שניסית לתת לי ${needLabels[0] || 'הקלה'} כשהיה לי קשה. אתה עשית את הכי טוב שידעת.`,
    `תודה שהיית שם בלילות הארוכים, כשלא היה לי אף אחד אחר.`,
    `תודה שעזרת לי לשרוד תקופות קשות. בלעדיך, אולי לא הייתי מחזיק מעמד.`,
    `תודה שלימדת אותי שאני צריך ${needLabels.join(' ו') || 'דברים אמיתיים'}. עכשיו אני יודע מה לחפש.`,
  ];

  const handleNext = () => {
    onUpdate({ thankYou });
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-6"
    >
      <PhaseIntro
        emoji="🤲"
        title="לפני שנפרד, נגיד תודה"
        description={`לא כי ${letter.habitName} היה טוב, אלא כי הוא ניסה. זה צעד שנראה מוזר, אבל הוא קריטי.`}
        techniqueLabel="למה להגיד תודה? (IFS)"
        techniqueExplanation="כשאנחנו נלחמים בהרגל, הוא נלחם חזרה. כשמודים לו ומשחררים בשלום, הוא מפסיק 'להגן' ונותן מקום לבחירה חדשה."
        techniqueColor="sage"
        isDark={isDark}
      />

      <p className="text-sm font-bold text-text mb-3">
        כתוב ל{letter.habitName} תודה:
      </p>

      <textarea
        value={thankYou}
        onChange={(e) => setThankYou(e.target.value)}
        placeholder={`${letter.habitName} יקר/ה,\nתודה ש...`}
        className="w-full bg-card rounded-2xl p-4 text-sm text-text border border-cream-dark focus:border-sage focus:outline-none resize-none h-36 leading-relaxed shadow-sm"
      />

      {/* Suggestions */}
      <p className="text-[11px] text-text-light mt-4 mb-2 font-medium">
        צריך השראה? בחר אחת:
      </p>
      <div className="space-y-2 mb-6">
        {thankSuggestions.map((suggestion, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.05 }}
            onClick={() => setThankYou(suggestion)}
            className="w-full text-right p-3 rounded-xl text-[11px] leading-relaxed transition-all active:scale-[0.98]"
            style={{
              backgroundColor: thankYou === suggestion
                ? (isDark ? '#1e3530' : '#d1fae5')
                : (isDark ? '#2a2a2c' : '#fff'),
              boxShadow: thankYou === suggestion
                ? `0 0 0 2px ${isDark ? '#6ee7b780' : '#059669'}`
                : '0 1px 3px rgba(0,0,0,0.08)',
              color: thankYou === suggestion
                ? (isDark ? '#6ee7b7' : '#059669')
                : (isDark ? '#d1d5db' : '#4b5563'),
            }}
          >
            &ldquo;{suggestion}&rdquo;
          </motion.button>
        ))}
      </div>

      <PhaseNav canContinue={thankYou.trim().length > 0} onNext={handleNext} onBack={onBack} isDark={isDark} />
    </motion.div>
  );
}

// ─── Phase 3: The Truth (MI Decisional Balance) ──────────────────

function PhaseTruth({
  letter,
  isDark,
  onUpdate,
  onNext,
  onBack,
}: {
  letter: FarewellLetter;
  isDark: boolean;
  onUpdate: (u: Partial<FarewellLetter>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [selectedCosts, setSelectedCosts] = useState<Set<string>>(new Set(letter.costs));
  const [missedMoments, setMissedMoments] = useState(letter.missedMoments);

  const toggleCost = (label: string) => {
    setSelectedCosts(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const handleNext = () => {
    onUpdate({ costs: Array.from(selectedCosts), missedMoments });
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-6"
    >
      <PhaseIntro
        emoji="⚖️"
        title="עכשיו האמת"
        description={`אמרנו תודה. עכשיו בוא נהיה כנים לגמרי - מה ${letter.habitName} באמת עלה לך?`}
        techniqueLabel="מאזן החלטות (Motivational Interviewing)"
        techniqueExplanation="כשרואים בבירור מה ההרגל נתן ומה הוא לקח, ההחלטה לשחרר הופכת מ'ויתור' ל'בחירה מודעת'. זה ההבדל בין רצון לשינוי."
        techniqueColor="coral"
        isDark={isDark}
      />

      <p className="text-sm font-bold text-text mb-1">מה ההרגל לקח ממך?</p>
      <p className="text-[11px] text-text-light mb-3">סמן את כל מה שרלוונטי</p>

      <div className="grid grid-cols-2 gap-2 mb-5">
        {COST_CATEGORIES.map((cost, i) => {
          const isSelected = selectedCosts.has(cost.label);
          return (
            <motion.button
              key={cost.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.03 }}
              onClick={() => toggleCost(cost.label)}
              className="p-2.5 rounded-xl text-right transition-all relative active:scale-[0.97] flex items-center gap-2.5"
              style={{
                backgroundColor: isSelected
                  ? (isDark ? '#3d2525' : '#fee2e2')
                  : (isDark ? '#2a2a2c' : '#fff'),
                boxShadow: isSelected
                  ? `0 0 0 2px ${isDark ? '#fca5a580' : '#dc2626'}`
                  : '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <span className="text-lg flex-shrink-0">{cost.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold" style={{ color: isSelected ? (isDark ? '#fca5a5' : '#dc2626') : (isDark ? '#f0f0f0' : '#1f1f21') }}>
                  {cost.label}
                </p>
                <p className="text-[9px]" style={{ color: isDark ? '#9a9aa0' : '#6b7280' }}>
                  {cost.detail}
                </p>
              </div>
              {isSelected && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Check size={14} style={{ color: isDark ? '#fca5a5' : '#dc2626' }} />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedCosts.size > 0 ? 1 : 0.4 }}
        className="mb-6"
      >
        <p className="text-sm font-bold text-text mb-1">
          איזה רגע חשוב פספסת בגלל ההרגל?
        </p>
        <p className="text-[11px] text-text-light mb-2">
          רגע ספציפי - אירוע, הזדמנות, או זמן עם אנשים שאהבת
        </p>
        <textarea
          value={missedMoments}
          onChange={(e) => setMissedMoments(e.target.value)}
          placeholder="אני זוכר/ת שפעם בגלל ההרגל הזה..."
          className="w-full bg-card rounded-xl p-4 text-sm text-text border border-cream-dark focus:border-sage focus:outline-none resize-none h-24 leading-relaxed"
        />
      </motion.div>

      <PhaseNav canContinue={selectedCosts.size > 0} onNext={handleNext} onBack={onBack} isDark={isDark} />
    </motion.div>
  );
}

// ─── Phase 4: The Farewell Letter (Gestalt Empty Chair) ──────────

function PhaseLetterWriting({
  letter,
  isDark,
  onUpdate,
  onNext,
  onBack,
}: {
  letter: FarewellLetter;
  isDark: boolean;
  onUpdate: (u: Partial<FarewellLetter>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const needLabels = letter.needs.map(n => CORE_NEEDS.find(cn => cn.id === n)?.label || n);

  const buildDefaultLetter = () => {
    const parts: string[] = [];
    parts.push(`${letter.habitName} יקר/ה,\n`);
    parts.push(`אני כותב/ת לך את המכתב הזה כי הגיע הזמן שנפרד.\n`);

    if (letter.moments.length > 0) {
      const momentList = letter.moments.map(m => m.description).join(', ');
      parts.push(`אני זוכר/ת שהיית שם ${momentList}. ואני מכיר/ה בזה.\n`);
    }

    if (letter.needs.length > 0) {
      parts.push(`מה שבאמת חיפשתי היה ${needLabels.join(' ו')}. הצורך הזה הוא לגיטימי. הדרך שבה מילאת אותו - כבר לא.\n`);
    }

    if (letter.thankYou) {
      parts.push(`${letter.thankYou}\n`);
    }

    if (letter.costs.length > 0) {
      parts.push(`אבל האמת היא שלקחת ממני ${letter.costs.join(', ')}.`);
      if (letter.missedMoments) {
        parts.push(` ${letter.missedMoments}\n`);
      } else {
        parts.push('\n');
      }
    }

    parts.push(`\nאני בוחר/ת לשחרר אותך. לא מתוך כעס, אלא מתוך אהבה לעצמי.`);
    parts.push(`\n\nבברכה ובשלום,\nהאני החדש/ה`);

    return parts.join('');
  };

  const [letterText, setLetterText] = useState(letter.letterText || buildDefaultLetter());
  const [showStarters, setShowStarters] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertStarter = (text: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const pos = textarea.selectionStart || letterText.length;
      const before = letterText.slice(0, pos);
      const after = letterText.slice(pos);
      setLetterText(before + '\n' + text + after);
      setShowStarters(false);
    } else {
      setLetterText(prev => prev + '\n' + text);
      setShowStarters(false);
    }
  };

  const handleNext = () => {
    onUpdate({ letterText });
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-6"
    >
      <PhaseIntro
        emoji="✍️"
        title="מכתב הפרידה"
        description={`זה הרגע. דבר אל ${letter.habitName} ישירות, כאילו הוא יושב מולך. המכתב מוכן מכל מה שכתבת - ערוך אותו כרצונך.`}
        techniqueLabel='טכניקת "הכיסא הריק" (גשטלט + נרטיב)'
        techniqueExplanation="כשאתה מדבר ישירות אל ההרגל, אתה יוצר הפרדה בינך לבינו. אתה כבר לא ההרגל - אתה האדם שמחליט."
        techniqueColor="sage"
        isDark={isDark}
      />

      {/* Starter prompts */}
      <button
        onClick={() => setShowStarters(!showStarters)}
        className="flex items-center gap-1.5 text-xs font-medium mb-3 min-h-[36px]"
        style={{ color: isDark ? '#67e8f9' : '#0891b2' }}
      >
        <Sparkles size={14} />
        <span>צריך עזרה? הנה התחלות משפטים</span>
        <ChevronDown size={14} className={`transition-transform ${showStarters ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {showStarters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-3"
          >
            <div className="space-y-1.5">
              {LETTER_STARTERS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => insertStarter(prompt.starter)}
                  className="w-full text-right bg-card rounded-lg p-3 shadow-sm active:scale-[0.98] transition-transform"
                >
                  <p className="text-xs font-medium text-text">&ldquo;{prompt.starter}&rdquo;</p>
                  <p className="text-[10px] text-text-light mt-0.5">{prompt.hint}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letter editor */}
      <div className="relative mb-2">
        <div
          className="rounded-2xl shadow-md overflow-hidden"
          style={{
            backgroundColor: isDark ? '#2a2a2c' : '#fffbeb',
            border: `1px solid ${isDark ? '#44444680' : '#fde68a'}`,
          }}
        >
          {/* Letter "header" decoration */}
          <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #03b28c, #059cc0)' }} />
          <textarea
            ref={textareaRef}
            value={letterText}
            onChange={(e) => setLetterText(e.target.value)}
            className="w-full p-5 text-sm text-text focus:outline-none resize-none leading-relaxed"
            style={{
              minHeight: '320px',
              backgroundColor: 'transparent',
              fontFamily: 'inherit',
            }}
            placeholder="התחל/י לכתוב..."
          />
        </div>
        <div className="absolute bottom-3 left-4 text-[10px] text-text-light/50">
          {letterText.length} תווים
        </div>
      </div>

      <PhaseNav
        canContinue={letterText.trim().length > 30}
        onNext={handleNext}
        onBack={onBack}
        nextLabel="סיים מכתב ← טקס שחרור"
        isDark={isDark}
      />
    </motion.div>
  );
}

// ─── Phase 5: Release Ceremony (ACT + Ritual + Somatic) ──────────

function PhaseRelease({
  letter,
  isDark,
  onUpdate,
  onDone,
}: {
  letter: FarewellLetter;
  isDark: boolean;
  onUpdate: (u: Partial<FarewellLetter>) => void;
  onDone: () => void;
}) {
  const [released, setReleased] = useState(false);
  const [releasePhase, setReleasePhase] = useState<'setup' | 'countdown' | 'released'>('setup');
  const [newResponses, setNewResponses] = useState<{ trigger: string; response: string }[]>(
    letter.newResponses.length > 0 ? letter.newResponses : [{ trigger: '', response: '' }]
  );
  const [mantra, setMantra] = useState(letter.mantra);
  const [showFullLetter, setShowFullLetter] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const addResponse = () => {
    setNewResponses(prev => [...prev, { trigger: '', response: '' }]);
  };

  const updateResponse = (index: number, field: 'trigger' | 'response', value: string) => {
    setNewResponses(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
  };

  const removeResponse = (index: number) => {
    if (newResponses.length > 1) {
      setNewResponses(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Get matching suggestions for a trigger
  const getSuggestions = (trigger: string): string[] => {
    if (!trigger) return [];
    for (const [key, responses] of Object.entries(NEW_RESPONSE_SUGGESTIONS)) {
      if (trigger.includes(key)) return responses;
    }
    return [];
  };

  const startRelease = () => {
    onUpdate({ newResponses: newResponses.filter(r => r.trigger && r.response), mantra });
    setReleasePhase('countdown');
  };

  useEffect(() => {
    if (releasePhase !== 'countdown') return;
    if (countdown <= 0) {
      if (navigator.vibrate) navigator.vibrate([50, 100, 50, 100, 200]);
      setReleasePhase('released');
      setReleased(true);
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [releasePhase, countdown]);

  // ── Countdown view ──
  if (releasePhase === 'countdown') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-20 flex flex-col items-center justify-center text-center min-h-[60vh]"
      >
        <motion.p
          className="text-text-light text-sm mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          קח נשימה עמוקה ושחרר...
        </motion.p>
        <AnimatePresence mode="wait">
          <motion.div
            key={countdown}
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-7xl font-black text-sage"
          >
            {countdown > 0 ? countdown : '🕊️'}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  }

  // ── Released view ──
  if (released) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-8 text-center"
      >
        {/* Letter flying away */}
        <motion.div
          initial={{ scale: 1, y: 0, opacity: 1 }}
          animate={{ scale: 0.2, y: -300, opacity: 0, rotate: -15 }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="text-6xl mb-4 inline-block"
        >
          ✉️
        </motion.div>

        {/* Dove appears */}
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', delay: 1.8 }}
          className="text-7xl mb-6"
        >
          🕊️
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2 }}
          className="text-2xl font-bold text-text mb-2"
        >
          שחררת
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="text-sm text-text-light leading-relaxed mb-6 max-w-xs mx-auto"
        >
          המכתב שלך נשמר. אתה יכול לחזור אליו בכל רגע שתצטרך
          תזכורת למה בחרת להשתחרר.
        </motion.p>

        {/* Mantra display */}
        {mantra && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8 }}
            className="rounded-2xl p-5 mb-6 mx-4"
            style={{
              backgroundColor: isDark ? '#1e3530' : '#d1fae5',
              border: `1px solid ${isDark ? '#6ee7b740' : '#6ee7b7'}`,
            }}
          >
            <p className="text-[10px] mb-1" style={{ color: isDark ? '#9a9aa0' : '#6b7280' }}>
              המנטרה החדשה שלך:
            </p>
            <p className="text-lg font-bold" style={{ color: isDark ? '#6ee7b7' : '#059669' }}>
              &ldquo;{mantra}&rdquo;
            </p>
          </motion.div>
        )}

        {/* New responses summary */}
        {newResponses.filter(r => r.trigger && r.response).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3 }}
            className="bg-card rounded-2xl p-4 shadow-sm mb-6 mx-4 text-right"
          >
            <p className="text-xs font-bold text-text mb-3">ההתחייבויות החדשות שלך:</p>
            {newResponses.filter(r => r.trigger && r.response).map((r, i) => (
              <div key={i} className="flex items-center gap-2 mb-2 text-[11px]">
                <span style={{ color: isDark ? '#fca5a5' : '#dc2626' }}>כש{r.trigger}</span>
                <span className="text-text-light">→</span>
                <span style={{ color: isDark ? '#6ee7b7' : '#059669' }} className="font-medium">{r.response}</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Read letter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2 }}
        >
          <button
            onClick={() => setShowFullLetter(!showFullLetter)}
            className="text-xs font-medium underline mb-4 min-h-[44px] inline-flex items-center"
            style={{ color: isDark ? '#67e8f9' : '#0891b2' }}
          >
            {showFullLetter ? 'הסתר מכתב' : 'קרא את המכתב שלך'}
          </button>
        </motion.div>

        <AnimatePresence>
          {showFullLetter && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mx-4 mb-6"
            >
              <div
                className="rounded-2xl p-5 shadow-sm text-right"
                style={{
                  backgroundColor: isDark ? '#2a2a2c' : '#fffbeb',
                  border: `1px solid ${isDark ? '#44444680' : '#fde68a'}`,
                }}
              >
                <p className="text-sm text-text whitespace-pre-wrap leading-relaxed">
                  {letter.letterText}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5 }}
          whileTap={{ scale: 0.97 }}
          onClick={onDone}
          className="bg-sage text-white px-8 py-3.5 rounded-full font-bold shadow-lg mx-auto block text-base"
        >
          סיום 🌱
        </motion.button>
      </motion.div>
    );
  }

  // ── Setup view (new responses + mantra) ──
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-6"
    >
      <PhaseIntro
        emoji="🌬️"
        title="לפני שנשחרר"
        description={`בוא נבנה את התגובות החדשות שלך - מה תעשה במקום ${letter.habitName} כשהטריגר מגיע?`}
        techniqueLabel="התחייבות ערכית (ACT + טקס שחרור)"
        techniqueExplanation="השינוי לא מגיע מלהילחם בהרגל, אלא מלבחור פעולה שמתאימה למי שאתה רוצה להיות. כל טריגר הוא הזדמנות לבחירה חדשה."
        techniqueColor="sea"
        isDark={isDark}
      />

      {/* New responses */}
      <p className="text-sm font-bold text-text mb-1">
        כשהטריגר מגיע, מה תעשה במקום?
      </p>
      <p className="text-[11px] text-text-light mb-3">
        הגדר תגובות חדשות: &quot;כש___ אני אבחר ב___&quot;
      </p>

      <div className="space-y-3 mb-5">
        {newResponses.map((resp, i) => {
          const suggestions = getSuggestions(resp.trigger);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl p-3.5 shadow-sm"
            >
              <div className="flex gap-2 mb-2">
                <div className="flex-1">
                  <label className="text-[10px] font-medium block mb-1" style={{ color: isDark ? '#fca5a5' : '#dc2626' }}>
                    כש...
                  </label>
                  <input
                    type="text"
                    value={resp.trigger}
                    onChange={(e) => updateResponse(i, 'trigger', e.target.value)}
                    placeholder="אני מרגיש/ה לחץ"
                    className="w-full bg-cream rounded-lg p-2.5 text-xs text-text border border-cream-dark focus:border-sage focus:outline-none"
                  />
                </div>
                <div className="flex items-center pt-4 text-text-light">→</div>
                <div className="flex-1">
                  <label className="text-[10px] font-medium block mb-1" style={{ color: isDark ? '#6ee7b7' : '#059669' }}>
                    אני אבחר ב...
                  </label>
                  <input
                    type="text"
                    value={resp.response}
                    onChange={(e) => updateResponse(i, 'response', e.target.value)}
                    placeholder="הליכה קצרה"
                    className="w-full bg-cream rounded-lg p-2.5 text-xs text-text border border-cream-dark focus:border-sage focus:outline-none"
                  />
                </div>
                {newResponses.length > 1 && (
                  <button
                    onClick={() => removeResponse(i)}
                    className="pt-4 text-text-light/50 flex-shrink-0"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Auto suggestions */}
              {suggestions.length > 0 && !resp.response && (
                <div className="flex gap-1.5 flex-wrap mt-1">
                  {suggestions.map((s, j) => (
                    <button
                      key={j}
                      onClick={() => updateResponse(i, 'response', s)}
                      className="text-[10px] px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: isDark ? '#1e3530' : '#d1fae5',
                        color: isDark ? '#6ee7b7' : '#059669',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}

        <button
          onClick={addResponse}
          className="flex items-center gap-1.5 text-xs font-medium min-h-[36px]"
          style={{ color: isDark ? '#67e8f9' : '#0891b2' }}
        >
          <Plus size={14} />
          הוסף עוד תגובה
        </button>
      </div>

      {/* Personal mantra */}
      <div className="mb-8">
        <p className="text-sm font-bold text-text mb-1">המנטרה החדשה שלך</p>
        <p className="text-[11px] text-text-light mb-2">
          משפט אחד שתגיד לעצמך ברגעי מבחן
        </p>
        <input
          type="text"
          value={mantra}
          onChange={(e) => setMantra(e.target.value)}
          placeholder="אני בוחר/ת את עצמי"
          className="w-full bg-card rounded-xl p-3.5 text-sm text-text text-center font-bold border border-cream-dark focus:border-sage focus:outline-none shadow-sm"
          maxLength={60}
        />
        <div className="flex gap-2 flex-wrap mt-3 justify-center">
          {MANTRA_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setMantra(s)}
              className="text-[10px] px-3 py-1.5 rounded-full font-medium transition-all"
              style={{
                backgroundColor: mantra === s
                  ? (isDark ? '#059669' : '#059669')
                  : (isDark ? '#333335' : '#e5e7eb'),
                color: mantra === s
                  ? '#fff'
                  : (isDark ? '#9a9aa0' : '#6b7280'),
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Release button */}
      <div className="fixed bottom-0 inset-x-0 bg-cream/90 backdrop-blur-lg border-t border-cream-dark/50 p-4 z-10">
        <div className="max-w-lg mx-auto">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={startRelease}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl flex items-center justify-center gap-3"
            style={{
              background: 'linear-gradient(135deg, #03b28c 0%, #059cc0 100%)',
            }}
          >
            <Wind size={22} />
            <span>שחרר את המכתב</span>
            <span className="text-xl">🕊️</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Shared Phase Navigation ──────────────────────────────────────

function PhaseNav({
  canContinue,
  onNext,
  onBack,
  nextLabel = 'המשך',
  isDark,
}: {
  canContinue: boolean;
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  isDark: boolean;
}) {
  return (
    <div className="fixed bottom-0 inset-x-0 bg-cream/90 backdrop-blur-lg border-t border-cream-dark/50 p-4 z-10">
      <div className="flex gap-3 max-w-lg mx-auto">
        {onBack && (
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-full flex items-center justify-center text-text-light flex-shrink-0"
            style={{
              backgroundColor: isDark ? '#333335' : '#e5e7eb',
            }}
          >
            <ArrowRight size={20} />
          </button>
        )}
        <motion.button
          whileTap={canContinue ? { scale: 0.97 } : undefined}
          onClick={canContinue ? onNext : undefined}
          className="flex-1 h-12 rounded-full text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-opacity"
          style={{
            background: canContinue
              ? 'linear-gradient(135deg, #03b28c 0%, #059cc0 100%)'
              : (isDark ? '#333335' : '#d1d5db'),
            opacity: canContinue ? 1 : 0.5,
            color: canContinue ? '#fff' : (isDark ? '#666' : '#9ca3af'),
          }}
        >
          <span>{nextLabel}</span>
          <ArrowLeft size={18} />
        </motion.button>
      </div>
    </div>
  );
}
