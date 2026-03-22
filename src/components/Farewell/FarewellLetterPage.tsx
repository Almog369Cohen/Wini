import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ArrowRight, ArrowLeft, X, Plus, Trash2,
  Feather, Eye, HandHeart, Scale, PenTool, Wind,
  Sparkles, Shield, Lightbulb, Coffee, Users, Zap,
  Moon, Flower2, ChevronDown,
} from 'lucide-react';
import type { Habit, FarewellLetter, FarewellMoment } from '../../types';
import type { useFarewellLetters } from '../../hooks/useFarewellLetters';

// ─── Constants ────────────────────────────────────────────────────

const PHASES = [
  { id: 'recognition', title: 'הכרה', subtitle: 'ההרגל לא היה רק רע', icon: Eye, color: 'sage' },
  { id: 'needs', title: 'הצורך האמיתי', subtitle: 'מה באמת חיפשת', icon: Lightbulb, color: 'sea' },
  { id: 'thanks', title: 'תודה', subtitle: 'לפני שנפרד, נגיד תודה', icon: HandHeart, color: 'sage' },
  { id: 'truth', title: 'האמת', subtitle: 'מה זה באמת עלה לך', icon: Scale, color: 'coral' },
  { id: 'letter', title: 'מכתב הפרידה', subtitle: 'דבר אליו ישירות', icon: PenTool, color: 'sage' },
  { id: 'release', title: 'טקס שחרור', subtitle: 'זמן לשחרר', icon: Wind, color: 'sea' },
];

const MOMENT_SUGGESTIONS = [
  { emoji: '😰', label: 'כשהיה לי לחץ', description: 'הוא היה שם כשהעולם היה מכביד' },
  { emoji: '😞', label: 'כשהרגשתי בודד', description: 'הוא מילא את החלל כשאף אחד לא היה שם' },
  { emoji: '😴', label: 'כשהייתי עייף', description: 'הוא נתן לי בריחה כשלא הייתה לי אנרגיה' },
  { emoji: '🎉', label: 'בחגיגות', description: 'הוא היה חלק מהרגעים הטובים' },
  { emoji: '😤', label: 'כשכעסתי', description: 'הוא עזר לי לשחרר מתח' },
  { emoji: '😶', label: 'כששעמתי', description: 'הוא מילא את הזמן הריק' },
  { emoji: '💔', label: 'אחרי אכזבה', description: 'הוא נתן נחמה כשכאב' },
  { emoji: '🤝', label: 'ברגעים חברתיים', description: 'הוא עזר לי להרגיש שייך' },
];

const CORE_NEEDS = [
  { id: 'safety', emoji: '🛡️', label: 'בטחון', description: 'הרגשה שהכל בסדר' },
  { id: 'connection', emoji: '🤝', label: 'חיבור', description: 'להרגיש שייך, לא לבד' },
  { id: 'comfort', emoji: '🫂', label: 'נחמה', description: 'הקלה מכאב, שקט פנימי' },
  { id: 'stimulation', emoji: '⚡', label: 'גירוי', description: 'ריגוש, הנאה, חיוניות' },
  { id: 'escape', emoji: '🌊', label: 'בריחה', description: 'לשכוח, להתנתק רגע' },
  { id: 'control', emoji: '🎯', label: 'שליטה', description: 'להרגיש שאני מחליט' },
  { id: 'reward', emoji: '🏆', label: 'תגמול', description: 'מגיע לי, עבדתי קשה' },
  { id: 'identity', emoji: '🪞', label: 'זהות', description: 'ככה אני, זה חלק ממי שאני' },
];

const COST_SUGGESTIONS = [
  { emoji: '💊', label: 'בריאות' },
  { emoji: '💰', label: 'כסף' },
  { emoji: '⏰', label: 'זמן' },
  { emoji: '💑', label: 'מערכות יחסים' },
  { emoji: '🪞', label: 'דימוי עצמי' },
  { emoji: '😴', label: 'שינה' },
  { emoji: '🧠', label: 'ריכוז וזיכרון' },
  { emoji: '🔋', label: 'אנרגיה' },
  { emoji: '🎯', label: 'מטרות ויעדים' },
  { emoji: '😊', label: 'שמחה אמיתית' },
];

const LETTER_PROMPTS = [
  { starter: 'אני זוכר כשנפגשנו בפעם הראשונה...', hint: 'מתי ההרגל נכנס לחייך?' },
  { starter: 'הגעת לחיי כי...', hint: 'מה גרם לך להתחיל?' },
  { starter: 'מה שבאמת הייתי צריך זה...', hint: 'הצורך האמיתי מאחורי ההרגל' },
  { starter: 'מה שלא אמרתי לך עד עכשיו זה...', hint: 'האמת שקשה להודות בה' },
  { starter: 'מעכשיו, כשאני ארגיש _____, אני אבחר ב...', hint: 'התגובה החדשה שלך' },
  { starter: 'אני נפרד ממך כי...', hint: 'למה עכשיו?' },
];

const NEW_RESPONSE_SUGGESTIONS = [
  { trigger: 'לחץ', responses: ['נשימה עמוקה 3 דקות', 'הליכה קצרה', 'שיחה עם חבר'] },
  { trigger: 'בדידות', responses: ['להתקשר למישהו', 'לכתוב ביומן', 'לצאת החוצה'] },
  { trigger: 'שעמום', responses: ['קריאה', 'תחביב חדש', 'אימון קצר'] },
  { trigger: 'עייפות', responses: ['תנומה קצרה', 'מתיחות', 'הליכה באוויר'] },
  { trigger: 'כעס', responses: ['לרשום את הרגשות', 'פעילות גופנית', 'נשימות'] },
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
  const quitHabits = habits.filter(h => h.type === 'quit' && h.isActive);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [currentLetterId, setCurrentLetterId] = useState<string | null>(null);
  const [phase, setPhase] = useState(0);

  // Check if there's an existing letter for the selected habit
  const existingLetter = selectedHabitId
    ? farewellLetters.getLetterForHabit(selectedHabitId)
    : null;

  const currentLetter = currentLetterId
    ? farewellLetters.letters.find(l => l.id === currentLetterId)
    : null;

  const handleSelectHabit = useCallback((habitId: string) => {
    setSelectedHabitId(habitId);
    const existing = farewellLetters.getLetterForHabit(habitId);
    if (existing) {
      setCurrentLetterId(existing.id);
      // Resume from where they left off
      if (existing.isComplete) {
        setPhase(5); // Show completed letter
      } else if (existing.letterText) {
        setPhase(4);
      } else if (existing.costs.length > 0) {
        setPhase(3);
      } else if (existing.thankYou) {
        setPhase(2);
      } else if (existing.needs.length > 0) {
        setPhase(1);
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

  // If no quit habits, show empty state
  if (quitHabits.length === 0) {
    return (
      <div className="min-h-dvh bg-cream flex items-center justify-center px-6" dir="rtl">
        <div className="text-center">
          <span className="text-5xl block mb-4">✉️</span>
          <h2 className="text-xl font-bold text-text mb-2">אין הרגלים לפרידה</h2>
          <p className="text-sm text-text-light mb-6">הוסף הרגל מסוג "הפסקה" כדי לכתוב לו מכתב פרידה</p>
          <button onClick={onBack} className="bg-sage text-white px-6 py-3 rounded-xl font-semibold">
            חזרה
          </button>
        </div>
      </div>
    );
  }

  // If no habit selected, show habit picker
  if (!selectedHabitId || !currentLetter) {
    return (
      <HabitPicker
        habits={quitHabits}
        existingLetters={farewellLetters.letters}
        onSelect={handleSelectHabit}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="min-h-dvh bg-cream" dir="rtl">
      {/* Phase indicator */}
      <div className="sticky top-0 z-10 bg-cream/80 backdrop-blur-lg border-b border-cream-dark px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onBack} className="p-2 text-text-light">
            <X size={20} />
          </button>
          <h1 className="text-sm font-bold text-text">מכתב פרידה ל{currentLetter.habitName}</h1>
          <div className="w-8" />
        </div>

        {/* Phase dots */}
        <div className="flex gap-1.5 justify-center">
          {PHASES.map((p, i) => (
            <motion.div
              key={i}
              className="h-1.5 rounded-full flex-1 max-w-8"
              animate={{
                backgroundColor: i <= phase ? 'var(--color-sage)' : 'var(--color-cream-dark)',
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
        <p className="text-[10px] text-text-light text-center mt-1">
          {PHASES[phase]?.subtitle}
        </p>
      </div>

      {/* Phase content */}
      <div className="px-4 pb-32">
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <PhaseRecognition
              key="recognition"
              letter={currentLetter}
              onUpdate={(updates) => farewellLetters.updateLetter(currentLetter.id, updates)}
              onNext={() => setPhase(1)}
            />
          )}
          {phase === 1 && (
            <PhaseNeeds
              key="needs"
              letter={currentLetter}
              onUpdate={(updates) => farewellLetters.updateLetter(currentLetter.id, updates)}
              onNext={() => setPhase(2)}
              onBack={() => setPhase(0)}
            />
          )}
          {phase === 2 && (
            <PhaseThanks
              key="thanks"
              letter={currentLetter}
              onUpdate={(updates) => farewellLetters.updateLetter(currentLetter.id, updates)}
              onNext={() => setPhase(3)}
              onBack={() => setPhase(1)}
            />
          )}
          {phase === 3 && (
            <PhaseTruth
              key="truth"
              letter={currentLetter}
              onUpdate={(updates) => farewellLetters.updateLetter(currentLetter.id, updates)}
              onNext={() => setPhase(4)}
              onBack={() => setPhase(2)}
            />
          )}
          {phase === 4 && (
            <PhaseLetterWriting
              key="letter"
              letter={currentLetter}
              onUpdate={(updates) => farewellLetters.updateLetter(currentLetter.id, updates)}
              onNext={() => { farewellLetters.completeLetter(currentLetter.id); setPhase(5); }}
              onBack={() => setPhase(3)}
            />
          )}
          {phase === 5 && (
            <PhaseRelease
              key="release"
              letter={currentLetter}
              onUpdate={(updates) => farewellLetters.updateLetter(currentLetter.id, updates)}
              onDone={() => { showToast('המכתב נשמר. אתה חופשי. 🕊️'); onBack(); }}
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
}: {
  habits: Habit[];
  existingLetters: FarewellLetter[];
  onSelect: (id: string) => void;
  onBack: () => void;
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

      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.1 }}
          className="text-5xl mb-3"
        >
          ✉️
        </motion.div>
        <h1 className="text-2xl font-bold text-text mb-2">מכתב פרידה</h1>
        <p className="text-sm text-text-light leading-relaxed max-w-xs mx-auto">
          לפעמים כדי לשחרר, צריך קודם להכיר. בחר הרגל שאתה רוצה לכתוב לו מכתב פרידה.
        </p>
      </div>

      {/* Brain science card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-sea/10 rounded-2xl p-4 mb-6 flex items-start gap-3"
      >
        <Feather size={20} className="text-sea flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-sea mb-1">למה מכתב פרידה עובד?</p>
          <p className="text-[11px] text-text-light leading-relaxed">
            מחקרים מראים שכתיבה אקספרסיבית מפעילה את הקורטקס הפרה-פרונטלי ומפחיתה
            את הפעילות באמיגדלה. במילים פשוטות: כשאתה כותב את הרגשות, המוח מעבד
            אותם במקום לברוח מהם.
          </p>
        </div>
      </motion.div>

      <div className="space-y-3">
        {habits.map((habit, i) => {
          const existing = existingLetters.find(l => l.habitId === habit.id);
          return (
            <motion.button
              key={habit.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              onClick={() => onSelect(habit.id)}
              className="w-full bg-card rounded-2xl shadow-sm p-4 flex items-center gap-4 text-right min-h-[64px]"
            >
              <div className="w-12 h-12 rounded-xl bg-coral/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🚫</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text">{habit.name}</p>
                <p className="text-[11px] text-text-light">
                  {existing?.isComplete
                    ? '✅ מכתב הושלם - לחץ לקרוא'
                    : existing
                      ? '📝 טיוטה - לחץ להמשיך'
                      : 'לחץ לכתוב מכתב פרידה'}
                </p>
              </div>
              {existing?.isComplete && (
                <span className="text-sage text-xs font-medium">קרא →</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Phase 0: Recognition ─────────────────────────────────────────

function PhaseRecognition({
  letter,
  onUpdate,
  onNext,
}: {
  letter: FarewellLetter;
  onUpdate: (u: Partial<FarewellLetter>) => void;
  onNext: () => void;
}) {
  const [selectedMoments, setSelectedMoments] = useState<string[]>(
    letter.moments.map(m => m.description)
  );
  const [customMoment, setCustomMoment] = useState('');
  const [personalMemory, setPersonalMemory] = useState(
    letter.moments[0]?.feeling || ''
  );

  const toggleMoment = (label: string) => {
    setSelectedMoments(prev =>
      prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label]
    );
  };

  const handleNext = () => {
    const moments: FarewellMoment[] = selectedMoments.map((desc, i) => ({
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
      {/* Intro */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="text-4xl mb-3"
        >
          <Eye size={40} className="text-sage mx-auto" />
        </motion.div>
        <h2 className="text-xl font-bold text-text mb-2">בוא נהיה כנים</h2>
        <p className="text-sm text-text-light leading-relaxed">
          ההרגל הזה לא הגיע מאין. הוא הגיע כי הייתה לך סיבה.
          <br />
          <span className="font-semibold text-sage">בוא נכיר בזה לפני שנפרד.</span>
        </p>
      </div>

      {/* IFS insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-sage/8 rounded-xl p-3 mb-5 flex items-start gap-2.5"
      >
        <Shield size={16} className="text-sage flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-text-light leading-relaxed">
          <span className="font-bold text-sage">תובנה (IFS):</span>{' '}
          ההרגל היה "חלק מגן" - הוא ניסה להגן עליך בדרך הכי טובה שהוא ידע.
          הכרה בזה היא לא הצדקה, אלא צעד ראשון לריפוי אמיתי.
        </p>
      </motion.div>

      {/* Question */}
      <p className="text-sm font-bold text-text mb-3">
        מתי {letter.habitName} "היה שם בשבילך"?
      </p>

      <div className="space-y-2 mb-5">
        {MOMENT_SUGGESTIONS.map((suggestion, i) => {
          const isSelected = selectedMoments.includes(suggestion.label);
          return (
            <motion.button
              key={suggestion.label}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.04 }}
              onClick={() => toggleMoment(suggestion.label)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-right transition-all ${
                isSelected ? 'bg-sage/12 ring-2 ring-sage/40' : 'bg-card shadow-sm'
              }`}
            >
              <span className="text-xl flex-shrink-0">{suggestion.emoji}</span>
              <div className="flex-1">
                <p className={`text-sm font-medium ${isSelected ? 'text-sage' : 'text-text'}`}>
                  {suggestion.label}
                </p>
                <p className="text-[10px] text-text-light">{suggestion.description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Custom moment */}
      <div className="mb-5">
        <label className="text-xs text-text-light mb-1.5 block">רגע אישי שלך:</label>
        <input
          type="text"
          value={customMoment}
          onChange={(e) => {
            setCustomMoment(e.target.value);
            if (e.target.value.trim() && !selectedMoments.includes(e.target.value.trim())) {
              setSelectedMoments(prev => [...prev, e.target.value.trim()]);
            }
          }}
          placeholder="כתוב רגע ספציפי שאתה זוכר..."
          className="w-full bg-card rounded-xl p-3 text-sm text-text border border-cream-dark focus:border-sage focus:outline-none"
        />
      </div>

      {/* Personal memory */}
      <div className="mb-6">
        <label className="text-xs text-text-light mb-1.5 block">
          ספר על רגע אחד שאתה זוכר - מה הרגשת אז?
        </label>
        <textarea
          value={personalMemory}
          onChange={(e) => setPersonalMemory(e.target.value)}
          placeholder="אני זוכר פעם ש..."
          className="w-full bg-card rounded-xl p-3 text-sm text-text border border-cream-dark focus:border-sage focus:outline-none resize-none h-20"
        />
      </div>

      {/* Navigation */}
      <PhaseNav
        canContinue={selectedMoments.length > 0}
        onNext={handleNext}
      />
    </motion.div>
  );
}

// ─── Phase 1: Real Needs ──────────────────────────────────────────

function PhaseNeeds({
  letter,
  onUpdate,
  onNext,
  onBack,
}: {
  letter: FarewellLetter;
  onUpdate: (u: Partial<FarewellLetter>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(letter.needs);

  const toggleNeed = (id: string) => {
    setSelectedNeeds(prev =>
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    // Also update the moments with the real needs
    const updatedMoments = letter.moments.map((m, i) => ({
      ...m,
      realNeed: selectedNeeds[i % selectedNeeds.length] || selectedNeeds[0] || '',
    }));
    onUpdate({ needs: selectedNeeds, moments: updatedMoments });
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-6"
    >
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <Lightbulb size={40} className="text-sea mx-auto mb-3" />
        </motion.div>
        <h2 className="text-xl font-bold text-text mb-2">הצורך האמיתי</h2>
        <p className="text-sm text-text-light leading-relaxed">
          מאחורי כל הרגל מסתתר צורך אנושי אמיתי ולגיטימי.
          <br />
          <span className="font-semibold text-sea">הצורך הוא תקין. הדרך למלא אותו - זה מה שאנחנו משנים.</span>
        </p>
      </div>

      {/* NVC insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-sea/10 rounded-xl p-3 mb-5 flex items-start gap-2.5"
      >
        <Heart size={16} className="text-sea flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-text-light leading-relaxed">
          <span className="font-bold text-sea">תובנה (NVC):</span>{' '}
          מרשל רוזנברג לימד שכל התנהגות היא ניסיון למלא צורך. כשמזהים את הצורך האמיתי,
          אפשר למצוא דרכים בריאות יותר למלא אותו.
        </p>
      </motion.div>

      {/* Show what they selected in phase 1 */}
      {letter.moments.length > 0 && (
        <div className="bg-card rounded-xl p-3 mb-4 shadow-sm">
          <p className="text-[10px] text-text-light mb-2">הרגעים שזיהית:</p>
          <div className="flex flex-wrap gap-1.5">
            {letter.moments.map((m, i) => (
              <span key={i} className="text-[11px] bg-sage/10 text-sage px-2 py-1 rounded-full">
                {m.description}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm font-bold text-text mb-3">
        מה באמת חיפשת באותם רגעים?
      </p>

      <div className="grid grid-cols-2 gap-2 mb-6">
        {CORE_NEEDS.map((need, i) => {
          const isSelected = selectedNeeds.includes(need.id);
          return (
            <motion.button
              key={need.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.04 }}
              onClick={() => toggleNeed(need.id)}
              className={`p-3 rounded-xl text-right transition-all ${
                isSelected ? 'bg-sea/12 ring-2 ring-sea/40' : 'bg-card shadow-sm'
              }`}
            >
              <span className="text-xl block mb-1">{need.emoji}</span>
              <p className={`text-xs font-semibold ${isSelected ? 'text-sea' : 'text-text'}`}>
                {need.label}
              </p>
              <p className="text-[10px] text-text-light">{need.description}</p>
            </motion.button>
          );
        })}
      </div>

      <PhaseNav canContinue={selectedNeeds.length > 0} onNext={handleNext} onBack={onBack} />
    </motion.div>
  );
}

// ─── Phase 2: Thank You ───────────────────────────────────────────

function PhaseThanks({
  letter,
  onUpdate,
  onNext,
  onBack,
}: {
  letter: FarewellLetter;
  onUpdate: (u: Partial<FarewellLetter>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [thankYou, setThankYou] = useState(letter.thankYou);

  const needLabels = letter.needs.map(n => CORE_NEEDS.find(cn => cn.id === n)?.label || n);

  const thankSuggestions = [
    `תודה שניסית לתת לי ${needLabels[0] || 'הקלה'} כשהיה לי קשה`,
    `תודה שהיית שם בלילות הארוכים`,
    `תודה שעזרת לי לשרוד תקופות קשות`,
    `תודה שלימדת אותי שאני צריך ${needLabels.join(' ו')}`,
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
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <HandHeart size={40} className="text-sage mx-auto mb-3" />
        </motion.div>
        <h2 className="text-xl font-bold text-text mb-2">תודה</h2>
        <p className="text-sm text-text-light leading-relaxed">
          לפני שנפרד, בוא נגיד תודה. לא כי ההרגל היה טוב,
          <br />
          אלא כי <span className="font-semibold text-sage">הוא ניסה</span>.
        </p>
      </div>

      {/* IFS insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-sage/8 rounded-xl p-3 mb-5 flex items-start gap-2.5"
      >
        <Shield size={16} className="text-sage flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-text-light leading-relaxed">
          <span className="font-bold text-sage">למה להגיד תודה?</span>{' '}
          כשאנחנו נלחמים בהרגל, הוא נלחם חזרה. כשאנחנו מודים לו ומשחררים בשלום,
          הוא מפסיק "להגן" ונותן מקום לבחירה חדשה.
        </p>
      </motion.div>

      <p className="text-sm font-bold text-text mb-3">
        כתוב ל{letter.habitName} תודה:
      </p>

      <textarea
        value={thankYou}
        onChange={(e) => setThankYou(e.target.value)}
        placeholder={`יקר/ה ${letter.habitName},\nתודה ש...`}
        className="w-full bg-card rounded-xl p-4 text-sm text-text border border-cream-dark focus:border-sage focus:outline-none resize-none h-32 leading-relaxed"
      />

      {/* Suggestions */}
      <p className="text-[10px] text-text-light mt-3 mb-2">או בחר השראה:</p>
      <div className="space-y-2 mb-6">
        {thankSuggestions.map((suggestion, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.05 }}
            onClick={() => setThankYou(suggestion)}
            className={`w-full text-right p-3 rounded-xl text-xs transition-all ${
              thankYou === suggestion
                ? 'bg-sage/12 ring-2 ring-sage/40 text-sage font-medium'
                : 'bg-card text-text-light shadow-sm'
            }`}
          >
            &ldquo;{suggestion}&rdquo;
          </motion.button>
        ))}
      </div>

      <PhaseNav canContinue={thankYou.trim().length > 0} onNext={handleNext} onBack={onBack} />
    </motion.div>
  );
}

// ─── Phase 3: The Truth (Cost) ────────────────────────────────────

function PhaseTruth({
  letter,
  onUpdate,
  onNext,
  onBack,
}: {
  letter: FarewellLetter;
  onUpdate: (u: Partial<FarewellLetter>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [selectedCosts, setSelectedCosts] = useState<string[]>(letter.costs);
  const [missedMoments, setMissedMoments] = useState(letter.missedMoments);

  const toggleCost = (label: string) => {
    setSelectedCosts(prev =>
      prev.includes(label) ? prev.filter(c => c !== label) : [...prev, label]
    );
  };

  const handleNext = () => {
    onUpdate({ costs: selectedCosts, missedMoments });
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-6"
    >
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <Scale size={40} className="text-coral mx-auto mb-3" />
        </motion.div>
        <h2 className="text-xl font-bold text-text mb-2">עכשיו האמת</h2>
        <p className="text-sm text-text-light leading-relaxed">
          אמרנו תודה. עכשיו בוא נהיה כנים לגמרי -
          <br />
          <span className="font-semibold text-coral">מה {letter.habitName} באמת עלה לך?</span>
        </p>
      </div>

      {/* MI insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-coral/8 rounded-xl p-3 mb-5 flex items-start gap-2.5"
      >
        <Scale size={16} className="text-coral flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-text-light leading-relaxed">
          <span className="font-bold text-coral">מאזן החלטות (MI):</span>{' '}
          כשאתה רואה בבירור מה ההרגל נתן ומה הוא לקח, ההחלטה לשחרר הופכת מ"ויתור"
          ל"בחירה מודעת". זה ההבדל בין רצון לשינוי.
        </p>
      </motion.div>

      <p className="text-sm font-bold text-text mb-3">מה ההרגל לקח ממך?</p>

      <div className="flex flex-wrap gap-2 mb-5">
        {COST_SUGGESTIONS.map((cost) => {
          const isSelected = selectedCosts.includes(cost.label);
          return (
            <button
              key={cost.label}
              onClick={() => toggleCost(cost.label)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all min-h-[36px] ${
                isSelected
                  ? 'bg-coral/15 text-coral ring-2 ring-coral/30'
                  : 'bg-card text-text shadow-sm'
              }`}
            >
              <span>{cost.emoji}</span>
              <span>{cost.label}</span>
            </button>
          );
        })}
      </div>

      <p className="text-sm font-bold text-text mb-2">
        איזה רגע חשוב פספסת בגלל ההרגל?
      </p>
      <textarea
        value={missedMoments}
        onChange={(e) => setMissedMoments(e.target.value)}
        placeholder="אני זוכר שפעם בגלל ההרגל הזה..."
        className="w-full bg-card rounded-xl p-3 text-sm text-text border border-cream-dark focus:border-sage focus:outline-none resize-none h-20 mb-6"
      />

      <PhaseNav canContinue={selectedCosts.length > 0} onNext={handleNext} onBack={onBack} />
    </motion.div>
  );
}

// ─── Phase 4: Letter Writing ──────────────────────────────────────

function PhaseLetterWriting({
  letter,
  onUpdate,
  onNext,
  onBack,
}: {
  letter: FarewellLetter;
  onUpdate: (u: Partial<FarewellLetter>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const needLabels = letter.needs.map(n => CORE_NEEDS.find(cn => cn.id === n)?.label || n).join(', ');

  // Build pre-filled letter from all phases
  const buildDefaultLetter = () => {
    const parts: string[] = [];
    parts.push(`${letter.habitName} יקר/ה,\n`);
    parts.push(`אני כותב/ת לך את המכתב הזה כי הגיע הזמן שנפרד.\n`);

    if (letter.moments.length > 0) {
      const momentList = letter.moments.map(m => m.description).join(', ');
      parts.push(`אני זוכר/ת שהיית שם ${momentList}. ואני מכיר/ה בזה.\n`);
    }

    if (letter.needs.length > 0) {
      parts.push(`מה שבאמת חיפשתי היה ${needLabels}. הצורך הזה הוא לגיטימי. הדרך שבה מילאת אותו - כבר לא.\n`);
    }

    if (letter.thankYou) {
      parts.push(`${letter.thankYou}\n`);
    }

    if (letter.costs.length > 0) {
      parts.push(`אבל האמת היא שלקחת ממני ${letter.costs.join(', ')}. )`);
      if (letter.missedMoments) {
        parts.push(`${letter.missedMoments}\n`);
      } else {
        parts.push('\n');
      }
    }

    parts.push(`אני בוחר/ת לשחרר אותך. לא מתוך כעס, אלא מתוך אהבה לעצמי.\n`);
    parts.push(`\nבברכה ובשלום,\nהאני החדש/ה`);

    return parts.join('');
  };

  const [letterText, setLetterText] = useState(
    letter.letterText || buildDefaultLetter()
  );
  const [showPrompts, setShowPrompts] = useState(false);

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
      <div className="text-center mb-5">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <PenTool size={36} className="text-sage mx-auto mb-3" />
        </motion.div>
        <h2 className="text-xl font-bold text-text mb-2">מכתב הפרידה</h2>
        <p className="text-sm text-text-light">
          זה הרגע. דבר אל ההרגל ישירות, כאילו הוא יושב מולך.
        </p>
      </div>

      {/* Gestalt insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-sage/8 rounded-xl p-3 mb-4 flex items-start gap-2.5"
      >
        <Feather size={16} className="text-sage flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-text-light leading-relaxed">
          <span className="font-bold text-sage">טכניקת "הכיסא הריק" (גשטלט):</span>{' '}
          כשאתה מדבר ישירות אל ההרגל, אתה יוצר הפרדה בינך לבינו. אתה כבר לא ההרגל - אתה האדם שמחליט.
        </p>
      </motion.div>

      {/* Prompt helper */}
      <button
        onClick={() => setShowPrompts(!showPrompts)}
        className="flex items-center gap-1.5 text-xs text-sea mb-3 min-h-[36px]"
      >
        <Sparkles size={14} />
        <span>צריך עזרה? הנה התחלות משפטים</span>
        <ChevronDown size={14} className={`transition-transform ${showPrompts ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {showPrompts && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-3"
          >
            <div className="space-y-1.5">
              {LETTER_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setLetterText(prev => prev + '\n' + prompt.starter);
                  }}
                  className="w-full text-right bg-card rounded-lg p-2.5 shadow-sm"
                >
                  <p className="text-xs font-medium text-text">{prompt.starter}</p>
                  <p className="text-[10px] text-text-light">{prompt.hint}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letter editor */}
      <div className="relative">
        <textarea
          value={letterText}
          onChange={(e) => setLetterText(e.target.value)}
          className="w-full bg-card rounded-2xl p-5 text-sm text-text border border-cream-dark focus:border-sage focus:outline-none resize-none leading-relaxed shadow-sm"
          style={{ minHeight: '300px', fontFamily: 'inherit' }}
          placeholder="התחל לכתוב..."
        />
        <div className="absolute bottom-3 left-3 text-[10px] text-text-light/50">
          {letterText.length} תווים
        </div>
      </div>

      <div className="mt-6">
        <PhaseNav canContinue={letterText.trim().length > 20} onNext={handleNext} onBack={onBack} nextLabel="סיים מכתב" />
      </div>
    </motion.div>
  );
}

// ─── Phase 5: Release Ceremony ────────────────────────────────────

function PhaseRelease({
  letter,
  onUpdate,
  onDone,
}: {
  letter: FarewellLetter;
  onUpdate: (u: Partial<FarewellLetter>) => void;
  onDone: () => void;
}) {
  const [released, setReleased] = useState(false);
  const [newResponses, setNewResponses] = useState<{ trigger: string; response: string }[]>(
    letter.newResponses.length > 0 ? letter.newResponses : [{ trigger: '', response: '' }]
  );
  const [mantra, setMantra] = useState(letter.mantra);
  const [showLetter, setShowLetter] = useState(false);

  const addResponse = () => {
    setNewResponses(prev => [...prev, { trigger: '', response: '' }]);
  };

  const updateResponse = (index: number, field: 'trigger' | 'response', value: string) => {
    setNewResponses(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
  };

  const handleRelease = () => {
    // Trigger haptic
    if (navigator.vibrate) navigator.vibrate([50, 100, 50, 100, 200]);
    setReleased(true);
    onUpdate({ newResponses, mantra });
  };

  if (released) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-10 text-center"
      >
        {/* Release animation */}
        <motion.div
          initial={{ scale: 1, y: 0 }}
          animate={{ scale: 0.3, y: -200, opacity: 0 }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="text-6xl mb-4"
        >
          ✉️
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 2 }}
            className="text-5xl mb-4"
          >
            🕊️
          </motion.div>

          <h2 className="text-2xl font-bold text-text mb-3">שחררת</h2>
          <p className="text-sm text-text-light leading-relaxed mb-6 max-w-xs mx-auto">
            המכתב שלך נשמר. אתה יכול לחזור אליו בכל רגע שתצטרך תזכורת למה בחרת להשתחרר.
          </p>

          {mantra && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="bg-sage/10 rounded-2xl p-4 mb-6 mx-4"
            >
              <p className="text-xs text-text-light mb-1">המנטרה החדשה שלך:</p>
              <p className="text-base font-bold text-sage">&ldquo;{mantra}&rdquo;</p>
            </motion.div>
          )}

          {/* Show letter button */}
          <button
            onClick={() => setShowLetter(!showLetter)}
            className="text-xs text-sea underline mb-4 min-h-[44px] inline-flex items-center"
          >
            {showLetter ? 'הסתר מכתב' : 'קרא את המכתב שלך'}
          </button>

          <AnimatePresence>
            {showLetter && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mx-4 mb-6"
              >
                <div className="bg-card rounded-2xl p-5 shadow-sm text-right">
                  <p className="text-sm text-text whitespace-pre-wrap leading-relaxed">
                    {letter.letterText}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            whileTap={{ scale: 0.97 }}
            onClick={onDone}
            className="bg-sage text-white px-8 py-3.5 rounded-full font-bold shadow-lg mx-auto block"
          >
            סיום 🌱
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-6"
    >
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <Wind size={40} className="text-sea mx-auto mb-3" />
        </motion.div>
        <h2 className="text-xl font-bold text-text mb-2">לפני שנשחרר</h2>
        <p className="text-sm text-text-light">
          בוא נבנה את התגובה החדשה שלך - מה תעשה <span className="font-semibold text-sea">במקום</span>?
        </p>
      </div>

      {/* ACT insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-sea/10 rounded-xl p-3 mb-5 flex items-start gap-2.5"
      >
        <Zap size={16} className="text-sea flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-text-light leading-relaxed">
          <span className="font-bold text-sea">התחייבות ערכית (ACT):</span>{' '}
          השינוי לא מגיע מלהילחם בהרגל, אלא מלבחור פעולה שמתאימה למי שאתה רוצה להיות.
          כל טריגר הוא הזדמנות לבחירה חדשה.
        </p>
      </motion.div>

      {/* New responses */}
      <p className="text-sm font-bold text-text mb-3">
        כשהטריגר מגיע, מה תעשה במקום?
      </p>

      <div className="space-y-3 mb-5">
        {newResponses.map((resp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl p-3 shadow-sm"
          >
            <div className="flex gap-2 mb-2">
              <div className="flex-1">
                <label className="text-[10px] text-text-light mb-1 block">כש...</label>
                <input
                  type="text"
                  value={resp.trigger}
                  onChange={(e) => updateResponse(i, 'trigger', e.target.value)}
                  placeholder="אני מרגיש לחץ"
                  className="w-full bg-cream rounded-lg p-2 text-xs text-text border border-cream-dark focus:border-sage focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-text-light mb-1 block">אני אבחר ב...</label>
                <input
                  type="text"
                  value={resp.response}
                  onChange={(e) => updateResponse(i, 'response', e.target.value)}
                  placeholder="הליכה קצרה"
                  className="w-full bg-cream rounded-lg p-2 text-xs text-text border border-cream-dark focus:border-sage focus:outline-none"
                />
              </div>
            </div>

            {/* Response suggestions */}
            {!resp.response && resp.trigger && (
              <div className="flex gap-1.5 flex-wrap mt-1.5">
                {NEW_RESPONSE_SUGGESTIONS
                  .find(s => resp.trigger.includes(s.trigger))
                  ?.responses.map((r, j) => (
                    <button
                      key={j}
                      onClick={() => updateResponse(i, 'response', r)}
                      className="text-[10px] bg-sage/10 text-sage px-2 py-1 rounded-full"
                    >
                      {r}
                    </button>
                  ))}
              </div>
            )}
          </motion.div>
        ))}

        <button
          onClick={addResponse}
          className="flex items-center gap-1.5 text-xs text-sage font-medium min-h-[36px]"
        >
          <Plus size={14} />
          הוסף תגובה
        </button>
      </div>

      {/* Personal mantra */}
      <div className="mb-8">
        <p className="text-sm font-bold text-text mb-2">המנטרה החדשה שלך:</p>
        <input
          type="text"
          value={mantra}
          onChange={(e) => setMantra(e.target.value)}
          placeholder="אני בוחר/ת את עצמי"
          className="w-full bg-card rounded-xl p-3 text-sm text-text text-center font-semibold border border-cream-dark focus:border-sage focus:outline-none"
          maxLength={60}
        />
        <div className="flex gap-2 flex-wrap mt-2 justify-center">
          {['אני חזק יותר מהדחף', 'אני בוחר חיים', 'אני ראוי לשינוי'].map((s) => (
            <button
              key={s}
              onClick={() => setMantra(s)}
              className={`text-[10px] px-2.5 py-1 rounded-full ${
                mantra === s ? 'bg-sage text-white' : 'bg-cream-dark text-text-light'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Release button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleRelease}
        className="w-full py-4 rounded-2xl bg-gradient-to-l from-sage to-sea text-white font-bold text-lg shadow-lg flex items-center justify-center gap-3"
      >
        <Wind size={22} />
        <span>שחרר את המכתב</span>
      </motion.button>
    </motion.div>
  );
}

// ─── Shared Navigation ────────────────────────────────────────────

function PhaseNav({
  canContinue,
  onNext,
  onBack,
  nextLabel = 'המשך',
}: {
  canContinue: boolean;
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
}) {
  return (
    <div className="fixed bottom-0 inset-x-0 bg-cream/80 backdrop-blur-lg border-t border-cream-dark p-4 z-10">
      <div className="flex gap-3 max-w-lg mx-auto">
        {onBack && (
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-full bg-cream-dark flex items-center justify-center text-text-light"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          disabled={!canContinue}
          className="flex-1 h-12 rounded-full bg-sage text-white font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-40"
        >
          <span>{nextLabel}</span>
          <ArrowLeft size={18} />
        </motion.button>
      </div>
    </div>
  );
}
