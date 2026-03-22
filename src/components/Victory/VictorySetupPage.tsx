import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Plus, X, Sparkles, Volume2, VolumeX,
  Flame, Zap, Eye, Brain, Heart, Trophy, Target, Star,
} from 'lucide-react';
import type {
  PersonalVictory, CelebrationVisual, CelebrationSound, CelebrationIntensity,
} from '../../types';
import type { useVictoryPreferences } from '../../hooks/useVictoryPreferences';

type VictoryPrefsState = ReturnType<typeof useVictoryPreferences>;

interface VictorySetupPageProps extends VictoryPrefsState {
  showToast: (msg: string, type?: 'success' | 'error') => void;
  onComplete: () => void;
  todayCount: number;
}

// ─── Brain Science Cards ──────────────────────────────────────────

const BRAIN_CARDS = [
  {
    emoji: '🧠',
    title: 'המוח שלך עובד על תגמולים',
    body: 'כל פעם שאתה חווה הנאה, המוח משחרר דופמין - "מולקולת ההנאה". הרגלים רעים חוטפים את המנגנון הזה. הניצחונות שלך יוצרים נתיב חדש.',
    color: 'sage',
  },
  {
    emoji: '🔄',
    title: 'לולאת ההרגל: טריגר → פעולה → תגמול',
    body: 'ההרגל הישן נתן לך תגמול מיידי. כדי לשבור אותו, אנחנו צריכים ליצור תגמול חזק יותר - חגיגה שמרגישה אמיתית.',
    color: 'sea',
  },
  {
    emoji: '🌱',
    title: 'נוירופלסטיות - המוח משתנה',
    body: 'כל ניצחון קטן, גם "סתם" עמדתי בדחף, מחזק חיבור עצבי חדש. אחרי 21 יום, הנתיב החדש מתחיל לנצח. זה מדע, לא אמונה.',
    color: 'sage',
  },
];

// ─── Victory Suggestion Templates ─────────────────────────────────

const VICTORY_SUGGESTIONS: PersonalVictory[] = [
  { id: 'resist-urge', label: 'עמדתי בדחף', emoji: '🦁', description: 'הרגשתי דחף ולא נכנעתי' },
  { id: 'full-day', label: 'יום נקי שלם', emoji: '⭐', description: 'עברתי יום שלם בלי ליפול' },
  { id: 'checkin', label: 'צ\'ק-אין להרגל', emoji: '✅', description: 'עשיתי את מה שהתחייבתי' },
  { id: 'helped-self', label: 'עזרתי לעצמי', emoji: '🧘', description: 'עשיתי פעולה מודעת של טיפול עצמי' },
  { id: 'asked-help', label: 'ביקשתי עזרה', emoji: '🤝', description: 'פניתי למישהו כשהיה לי קשה' },
  { id: 'recognized', label: 'זיהיתי טריגר', emoji: '🔍', description: 'שמתי לב לטריגר לפני שנפלתי' },
  { id: 'chose-different', label: 'בחרתי אחרת', emoji: '🔀', description: 'כשהדחף הגיע, עשיתי פעולה חלופית' },
  { id: 'stayed-present', label: 'נשארתי בנוכחות', emoji: '🧘', description: 'לא ברחתי - ישבתי עם הרגש' },
  { id: 'morning-routine', label: 'שגרת בוקר', emoji: '🌅', description: 'התחלתי את היום עם שגרה בריאה' },
  { id: 'night-success', label: 'ניצחון לילי', emoji: '🌙', description: 'עברתי את הלילה בלי ליפול' },
];

// ─── Celebration Visuals ──────────────────────────────────────────

const VISUAL_OPTIONS: { id: CelebrationVisual; emoji: string; label: string; desc: string }[] = [
  { id: 'confetti', emoji: '🎊', label: 'קונפטי', desc: 'גשם של צבעים' },
  { id: 'fireworks', emoji: '🎆', label: 'זיקוקים', desc: 'פיצוצי אור' },
  { id: 'glow', emoji: '✨', label: 'זוהר', desc: 'הילה רכה וחמה' },
  { id: 'stars', emoji: '🌟', label: 'כוכבים', desc: 'שמיים זרועי כוכבים' },
  { id: 'nature', emoji: '🌿', label: 'טבע', desc: 'עלים ופרחים' },
];

const SOUND_OPTIONS: { id: CelebrationSound; emoji: string; label: string; desc: string }[] = [
  { id: 'ding', emoji: '🔔', label: 'צלצול', desc: 'סאונד ניצחון קצר' },
  { id: 'cheer', emoji: '🎉', label: 'תשואות', desc: 'קהל מריע' },
  { id: 'nature', emoji: '🎵', label: 'טבע', desc: 'צלילי טבע מרגיעים' },
  { id: 'gentle', emoji: '🎶', label: 'עדין', desc: 'מלודיה רכה' },
  { id: 'silent', emoji: '🤫', label: 'שקט', desc: 'ויזואלי בלבד' },
];

const INTENSITY_OPTIONS: { id: CelebrationIntensity; emoji: string; label: string; desc: string }[] = [
  { id: 'subtle', emoji: '🌸', label: 'עדין', desc: 'אפקט רך, לא מפריע' },
  { id: 'medium', emoji: '🎯', label: 'מאוזן', desc: 'ברור ומרגש' },
  { id: 'epic', emoji: '🔥', label: 'אפי', desc: 'חגיגה מלאה!' },
];

const MANTRA_SUGGESTIONS = [
  'אני חזק יותר מהדחף',
  'כל יום אני בוחר מחדש',
  'הגוף שלי, הבחירה שלי',
  'צעד אחד קדימה, תמיד',
  'אני לא לבד במסע הזה',
  'השינוי כבר קורה',
  'אני ראוי לחיים טובים יותר',
  'כל רגע הוא הזדמנות חדשה',
];

// ─── Main Component ───────────────────────────────────────────────

export default function VictorySetupPage({
  preferences,
  addPersonalVictory,
  removePersonalVictory,
  toggleVictory,
  setMantra,
  setVisual,
  setSound,
  setIntensity,
  setDailyGoal,
  completeSetup,
  defaultVictories: _defaultVictories,
  showToast,
  onComplete,
  todayCount,
}: VictorySetupPageProps) {
  const [step, setStep] = useState(0);
  const [customLabel, setCustomLabel] = useState('');
  const [customEmoji, setCustomEmoji] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);

  const totalSteps = 5;
  const isFirstTime = !preferences.setupDone;

  const goNext = () => {
    if (step < totalSteps - 1) setStep(step + 1);
    else handleFinish();
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleFinish = () => {
    completeSetup();
    showToast('מערכת הניצחונות שלך מוכנה! 🏆');
    onComplete();
  };

  const handleAddCustom = useCallback(() => {
    if (!customLabel.trim()) return;
    const id = `custom-${Date.now()}`;
    addPersonalVictory({
      id,
      label: customLabel.trim(),
      emoji: customEmoji || '🏅',
      description: 'ניצחון אישי שהגדרתי',
      isCustom: true,
    });
    setCustomLabel('');
    setCustomEmoji('');
    setShowAddCustom(false);
  }, [customLabel, customEmoji, addPersonalVictory]);

  const isVictorySelected = (id: string) =>
    preferences.personalVictories.some((v) => v.id === id);

  return (
    <div className="min-h-screen bg-cream" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-cream/80 backdrop-blur-lg border-b border-cream-dark px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-bold text-text">
            {isFirstTime ? 'בנה את מערכת הניצחונות שלך' : 'הגדרות ניצחונות'}
          </h1>
          {!isFirstTime && (
            <button onClick={onComplete} className="p-1.5 text-text-light">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <motion.div
              key={i}
              className="h-1 rounded-full flex-1"
              animate={{
                backgroundColor: i <= step ? 'var(--color-sage)' : 'var(--color-cream-dark)',
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-32">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <StepBrainScience key="brain" />
          )}
          {step === 1 && (
            <StepDefineVictories
              key="victories"
              selectedVictories={preferences.personalVictories}
              suggestions={VICTORY_SUGGESTIONS}
              isVictorySelected={isVictorySelected}
              onToggle={toggleVictory}
              onAddCustom={() => setShowAddCustom(true)}
              onRemoveCustom={removePersonalVictory}
            />
          )}
          {step === 2 && (
            <StepMantra
              key="mantra"
              mantra={preferences.mantra}
              onSetMantra={setMantra}
            />
          )}
          {step === 3 && (
            <StepCelebration
              key="celebration"
              visual={preferences.celebrationVisual}
              sound={preferences.celebrationSound}
              intensity={preferences.celebrationIntensity}
              onSetVisual={setVisual}
              onSetSound={setSound}
              onSetIntensity={setIntensity}
            />
          )}
          {step === 4 && (
            <StepGoal
              key="goal"
              dailyGoal={preferences.dailyGoal}
              todayCount={todayCount}
              mantra={preferences.mantra}
              onSetGoal={setDailyGoal}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="fixed bottom-0 inset-x-0 bg-cream/80 backdrop-blur-lg border-t border-cream-dark p-4 z-10">
        <div className="flex gap-3 max-w-lg mx-auto">
          {step > 0 && (
            <button
              onClick={goBack}
              className="w-12 h-12 rounded-full bg-cream-dark flex items-center justify-center text-text-light"
            >
              <ChevronRight size={20} />
            </button>
          )}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={goNext}
            className="flex-1 h-12 rounded-full bg-sage text-white font-bold flex items-center justify-center gap-2 shadow-lg"
          >
            {step === totalSteps - 1 ? (
              <>
                <Trophy size={18} />
                <span>{isFirstTime ? 'מוכן לנצח!' : 'שמור שינויים'}</span>
              </>
            ) : (
              <>
                <span>המשך</span>
                <ChevronLeft size={18} />
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Add custom victory modal */}
      <AnimatePresence>
        {showAddCustom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-50 flex items-end justify-center"
            onClick={() => setShowAddCustom(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-card rounded-t-3xl p-5"
              dir="rtl"
            >
              <h3 className="text-lg font-bold text-text mb-4">הגדר ניצחון אישי</h3>

              <div className="mb-4">
                <label className="text-xs text-text-light mb-1 block">מה הניצחון שלך?</label>
                <input
                  type="text"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  placeholder="למשל: הלכתי 30 דקות, שתיתי מים..."
                  className="w-full bg-cream rounded-xl p-3 text-sm text-text border border-cream-dark focus:border-sage focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="mb-5">
                <label className="text-xs text-text-light mb-2 block">בחר אימוג'י</label>
                <div className="flex gap-2 flex-wrap">
                  {['🏅', '💪', '🌟', '🎯', '🔥', '💎', '🌈', '🦋', '🏆', '❤️', '🧗', '🎨'].map((e) => (
                    <button
                      key={e}
                      onClick={() => setCustomEmoji(e)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                        customEmoji === e
                          ? 'bg-sage/20 ring-2 ring-sage scale-110'
                          : 'bg-cream-dark/50'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddCustom}
                disabled={!customLabel.trim()}
                className="w-full bg-sage text-white py-3 rounded-xl font-semibold disabled:opacity-40"
              >
                הוסף ניצחון
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Step 0: Brain Science ────────────────────────────────────────

function StepBrainScience() {
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
          className="text-5xl mb-3"
        >
          🧠
        </motion.div>
        <h2 className="text-xl font-bold text-text mb-2">למה חגיגות עובדות?</h2>
        <p className="text-sm text-text-light">
          הבנה קצרה של המדע מאחורי השינוי
        </p>
      </div>

      <div className="space-y-4">
        {BRAIN_CARDS.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
            className={`bg-card rounded-2xl p-4 shadow-sm border-r-4 ${
              card.color === 'sage' ? 'border-sage' : 'border-sea'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{card.emoji}</span>
              <div>
                <h3 className="font-bold text-text text-sm mb-1">{card.title}</h3>
                <p className="text-xs text-text-light leading-relaxed">{card.body}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-6 bg-sage/10 rounded-2xl p-4 text-center"
      >
        <Brain size={24} className="text-sage mx-auto mb-2" />
        <p className="text-sm font-semibold text-sage mb-1">הנקודה המרכזית</p>
        <p className="text-xs text-text-light leading-relaxed">
          כשאתה חוגג ניצחון קטן, המוח משחרר דופמין בדיוק כמו שההרגל הישן עשה.
          אבל הפעם - זה דופמין <span className="font-bold text-sage">בריא</span>.
          ככל שתחגוג יותר, המוח ילמד ש<span className="font-bold text-sage">הניצחון</span> הוא מקור ההנאה, לא הנפילה.
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Step 1: Define Your Victories ────────────────────────────────

function StepDefineVictories({
  selectedVictories,
  suggestions,
  isVictorySelected,
  onToggle,
  onAddCustom,
  onRemoveCustom,
}: {
  selectedVictories: PersonalVictory[];
  suggestions: PersonalVictory[];
  isVictorySelected: (id: string) => boolean;
  onToggle: (id: string) => void;
  onAddCustom: () => void;
  onRemoveCustom: (id: string) => void;
}) {
  const customVictories = selectedVictories.filter((v) => v.isCustom);

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
          className="text-5xl mb-3"
        >
          🏆
        </motion.div>
        <h2 className="text-xl font-bold text-text mb-2">מה נחשב ניצחון בעיניך?</h2>
        <p className="text-sm text-text-light">
          בחר את הרגעים שבשבילך הם הצלחה אמיתית
        </p>
      </div>

      <div className="space-y-2.5">
        {suggestions.map((victory, i) => {
          const selected = isVictorySelected(victory.id);
          return (
            <motion.button
              key={victory.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              onClick={() => onToggle(victory.id)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-right transition-all ${
                selected
                  ? 'bg-sage/15 ring-2 ring-sage/50'
                  : 'bg-card shadow-sm'
              }`}
            >
              <span className="text-2xl flex-shrink-0">{victory.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${selected ? 'text-sage' : 'text-text'}`}>
                  {victory.label}
                </p>
                <p className="text-[11px] text-text-light truncate">{victory.description}</p>
              </div>
              <motion.div
                animate={{ scale: selected ? 1 : 0 }}
                className="w-6 h-6 rounded-full bg-sage flex items-center justify-center flex-shrink-0"
              >
                <Sparkles size={14} className="text-white" />
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      {/* Custom victories */}
      {customVictories.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-text-light mb-2 font-medium">ניצחונות אישיים שהוספת:</p>
          <div className="space-y-2">
            {customVictories.map((v) => (
              <div
                key={v.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-sage/15 ring-2 ring-sage/50"
              >
                <span className="text-xl">{v.emoji}</span>
                <p className="text-sm font-semibold text-sage flex-1">{v.label}</p>
                <button
                  onClick={() => onRemoveCustom(v.id)}
                  className="p-1 text-text-light hover:text-coral transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add custom button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onAddCustom}
        className="w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-sage/30 text-sage font-medium text-sm hover:bg-sage/5 transition-colors"
      >
        <Plus size={18} />
        <span>הגדר ניצחון אישי</span>
      </motion.button>

      <p className="text-[10px] text-text-light/60 text-center mt-3">
        בחרת {selectedVictories.length} ניצחונות
      </p>
    </motion.div>
  );
}

// ─── Step 2: Personal Mantra ──────────────────────────────────────

function StepMantra({
  mantra,
  onSetMantra,
}: {
  mantra: string;
  onSetMantra: (m: string) => void;
}) {
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
          className="text-5xl mb-3"
        >
          💬
        </motion.div>
        <h2 className="text-xl font-bold text-text mb-2">המשפט שלך</h2>
        <p className="text-sm text-text-light">
          מנטרה אישית שתופיע בכל ניצחון - המילים שאתה צריך לשמוע
        </p>
      </div>

      {/* Brain tip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-sea/10 rounded-xl p-3 mb-5 flex items-start gap-2.5"
      >
        <Brain size={18} className="text-sea flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-text-light leading-relaxed">
          <span className="font-bold text-sea">טיפ מדעי:</span> מנטרה אישית מפעילה את ה-PFC
          (קורטקס פרה-פרונטלי) - החלק במוח שאחראי על שליטה עצמית. כשאתה חוזר על משפט חיובי,
          אתה ממש מחזק את "שריר" הרצון.
        </p>
      </motion.div>

      {/* Input */}
      <div className="mb-5">
        <textarea
          value={mantra}
          onChange={(e) => onSetMantra(e.target.value)}
          placeholder="כתוב את המשפט שנותן לך כוח..."
          className="w-full bg-card rounded-xl p-4 text-text text-center font-semibold border border-cream-dark focus:border-sage focus:outline-none resize-none h-24"
          maxLength={80}
        />
        <p className="text-[10px] text-text-light/50 text-center mt-1">{mantra.length}/80</p>
      </div>

      {/* Suggestions */}
      <p className="text-xs text-text-light mb-2 font-medium">או בחר השראה:</p>
      <div className="space-y-2">
        {MANTRA_SUGGESTIONS.map((suggestion, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.04 }}
            onClick={() => onSetMantra(suggestion)}
            className={`w-full text-right p-3 rounded-xl text-sm transition-all ${
              mantra === suggestion
                ? 'bg-sage/15 ring-2 ring-sage/50 text-sage font-semibold'
                : 'bg-card text-text shadow-sm'
            }`}
          >
            &ldquo;{suggestion}&rdquo;
          </motion.button>
        ))}
      </div>

      {/* Preview */}
      {mantra && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 bg-sage/10 rounded-2xl p-5 text-center"
        >
          <p className="text-xs text-text-light mb-2">ככה זה ייראה בניצחון:</p>
          <motion.p
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="text-base font-bold text-sage"
          >
            &ldquo;{mantra}&rdquo;
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Step 3: Celebration Style ────────────────────────────────────

function StepCelebration({
  visual,
  sound,
  intensity,
  onSetVisual,
  onSetSound,
  onSetIntensity,
}: {
  visual: CelebrationVisual;
  sound: CelebrationSound;
  intensity: CelebrationIntensity;
  onSetVisual: (v: CelebrationVisual) => void;
  onSetSound: (s: CelebrationSound) => void;
  onSetIntensity: (i: CelebrationIntensity) => void;
}) {
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
          className="text-5xl mb-3"
        >
          🎨
        </motion.div>
        <h2 className="text-xl font-bold text-text mb-2">איך תרצה לחגוג?</h2>
        <p className="text-sm text-text-light">
          התאם את החגיגה - ככה שתרגיש <span className="text-sage font-semibold">בדיוק</span> נכון
        </p>
      </div>

      {/* Brain tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-sage/10 rounded-xl p-3 mb-5 flex items-start gap-2.5"
      >
        <Eye size={18} className="text-sage flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-text-light leading-relaxed">
          <span className="font-bold text-sage">למה זה חשוב:</span> המוח זוכר חוויות
          רב-חושיות פי 3 יותר מחוויות חד-חושיות. ויזואלי + סאונד + הפטיק = חיבור עצבי חזק יותר.
        </p>
      </motion.div>

      {/* Visual style */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-text mb-2.5 flex items-center gap-2">
          <Sparkles size={16} className="text-sage" />
          אפקט ויזואלי
        </p>
        <div className="grid grid-cols-2 gap-2">
          {VISUAL_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSetVisual(opt.id)}
              className={`p-3 rounded-xl text-right transition-all ${
                visual === opt.id
                  ? 'bg-sage/15 ring-2 ring-sage/50'
                  : 'bg-card shadow-sm'
              }`}
            >
              <span className="text-xl block mb-1">{opt.emoji}</span>
              <p className={`text-xs font-semibold ${visual === opt.id ? 'text-sage' : 'text-text'}`}>{opt.label}</p>
              <p className="text-[10px] text-text-light">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Sound style */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-text mb-2.5 flex items-center gap-2">
          <Volume2 size={16} className="text-sea" />
          סאונד
        </p>
        <div className="grid grid-cols-2 gap-2">
          {SOUND_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSetSound(opt.id)}
              className={`p-3 rounded-xl text-right transition-all ${
                sound === opt.id
                  ? 'bg-sea/15 ring-2 ring-sea/50'
                  : 'bg-card shadow-sm'
              }`}
            >
              <span className="text-xl block mb-1">{opt.emoji}</span>
              <p className={`text-xs font-semibold ${sound === opt.id ? 'text-sea' : 'text-text'}`}>{opt.label}</p>
              <p className="text-[10px] text-text-light">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Intensity */}
      <div>
        <p className="text-sm font-semibold text-text mb-2.5 flex items-center gap-2">
          <Zap size={16} className="text-coral" />
          עוצמה
        </p>
        <div className="flex gap-2">
          {INTENSITY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSetIntensity(opt.id)}
              className={`flex-1 p-3 rounded-xl text-center transition-all ${
                intensity === opt.id
                  ? 'bg-sage/15 ring-2 ring-sage/50'
                  : 'bg-card shadow-sm'
              }`}
            >
              <span className="text-xl block mb-1">{opt.emoji}</span>
              <p className={`text-xs font-semibold ${intensity === opt.id ? 'text-sage' : 'text-text'}`}>{opt.label}</p>
              <p className="text-[10px] text-text-light">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Step 4: Daily Goal + Summary ─────────────────────────────────

function StepGoal({
  dailyGoal,
  todayCount,
  mantra,
  onSetGoal,
}: {
  dailyGoal: number;
  todayCount: number;
  mantra: string;
  onSetGoal: (g: number) => void;
}) {
  const goalOptions = [3, 5, 7, 10];

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
          className="text-5xl mb-3"
        >
          🎯
        </motion.div>
        <h2 className="text-xl font-bold text-text mb-2">יעד יומי</h2>
        <p className="text-sm text-text-light">
          כמה ניצחונות ביום ירגישו לך כמו הצלחה?
        </p>
      </div>

      {/* Brain tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-sea/10 rounded-xl p-3 mb-5 flex items-start gap-2.5"
      >
        <Target size={18} className="text-sea flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-text-light leading-relaxed">
          <span className="font-bold text-sea">טיפ:</span> יעד שניתן להשגה הוא קריטי.
          הצלחה עקבית בונה ביטחון עצמי. התחל נמוך ותעלה - עדיף 3 ניצחונות בטוחים מ-10 שמרגישים בלתי אפשריים.
        </p>
      </motion.div>

      {/* Goal selector */}
      <div className="flex gap-3 justify-center mb-6">
        {goalOptions.map((g) => (
          <motion.button
            key={g}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSetGoal(g)}
            className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all ${
              dailyGoal === g
                ? 'bg-sage text-white shadow-lg shadow-sage/30 scale-110'
                : 'bg-card text-text shadow-sm'
            }`}
          >
            <span className="text-xl font-black">{g}</span>
            <span className="text-[9px] mt-[-2px]">{dailyGoal === g ? 'ביום' : ''}</span>
          </motion.button>
        ))}
      </div>

      {/* Preview card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-2xl p-5 shadow-sm"
      >
        <h3 className="text-sm font-bold text-text text-center mb-4">תצוגה מקדימה של מסע הניצחונות שלך</h3>

        {/* Mini goal ring */}
        <div className="flex justify-center mb-4">
          <div className="relative w-20 h-20">
            <svg width={80} height={80} className="-rotate-90">
              <circle cx={40} cy={40} r={34} fill="none" stroke="var(--color-cream-dark)" strokeWidth={6} />
              <motion.circle
                cx={40} cy={40} r={34}
                fill="none"
                stroke="var(--color-sage)"
                strokeWidth={6}
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 34}
                initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                animate={{
                  strokeDashoffset: 2 * Math.PI * 34 * (1 - Math.min(todayCount / dailyGoal, 1)),
                }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.7 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-black text-sage">{todayCount}</span>
              <span className="text-[9px] text-text-light">מתוך {dailyGoal}</span>
            </div>
          </div>
        </div>

        {/* Mantra preview */}
        {mantra && (
          <div className="bg-sage/10 rounded-xl p-3 text-center mb-3">
            <p className="text-[10px] text-text-light mb-1">המנטרה שלך:</p>
            <p className="text-sm font-bold text-sage">&ldquo;{mantra}&rdquo;</p>
          </div>
        )}

        {/* Summary dots */}
        <div className="flex justify-center gap-1.5">
          {Array.from({ length: dailyGoal }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + i * 0.05 }}
              className={`w-3 h-3 rounded-full ${
                i < todayCount ? 'bg-sage' : 'bg-cream-dark'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Motivational closer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-5 text-center"
      >
        <p className="text-xs text-text-light">
          <Star size={12} className="text-sage inline-block ml-1" />
          כל ניצחון שלך משנה את המוח לטובה
        </p>
      </motion.div>
    </motion.div>
  );
}
