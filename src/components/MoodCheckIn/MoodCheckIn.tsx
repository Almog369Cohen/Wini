import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Heart, ChevronLeft, ChevronRight, Sparkles, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { MoodType } from '../../types';

interface MoodCheckInProps {
  onComplete: (mood: MoodType, energy: number, note?: string, secondaryMoods?: MoodType[]) => void;
  isUpdate?: boolean;
}

const MOODS: { type: MoodType; emoji: string; label: string; lightBg: string; darkBg: string; border: string }[] = [
  { type: 'happy', emoji: '😊', label: 'שמח', lightBg: '#fef9c3', darkBg: 'rgba(253,224,71,0.15)', border: '#fde047' },
  { type: 'calm', emoji: '🧘', label: 'רגוע', lightBg: '#dcfce7', darkBg: 'rgba(134,239,172,0.15)', border: '#86efac' },
  { type: 'energetic', emoji: '⚡', label: 'אנרגטי', lightBg: '#ffedd5', darkBg: 'rgba(253,186,116,0.15)', border: '#fdba74' },
  { type: 'hopeful', emoji: '🌅', label: 'מלא תקווה', lightBg: '#f3e8ff', darkBg: 'rgba(192,132,252,0.15)', border: '#c084fc' },
  { type: 'neutral', emoji: '😐', label: 'ניטרלי', lightBg: '#f3f4f6', darkBg: 'rgba(209,213,219,0.12)', border: '#d1d5db' },
  { type: 'tired', emoji: '😴', label: 'עייף', lightBg: '#dbeafe', darkBg: 'rgba(147,197,253,0.15)', border: '#93c5fd' },
  { type: 'sad', emoji: '😢', label: 'עצוב', lightBg: '#e0e7ff', darkBg: 'rgba(165,180,252,0.15)', border: '#a5b4fc' },
  { type: 'anxious', emoji: '😰', label: 'חרד', lightBg: '#fee2e2', darkBg: 'rgba(252,165,165,0.15)', border: '#fca5a5' },
  { type: 'frustrated', emoji: '😣', label: 'מתוסכל', lightBg: '#ffe4e6', darkBg: 'rgba(253,164,175,0.15)', border: '#fda4af' },
  { type: 'irritable', emoji: '😤', label: 'עצבני', lightBg: '#fef3c7', darkBg: 'rgba(252,211,77,0.15)', border: '#fcd34d' },
  { type: 'lonely', emoji: '🫂', label: 'בודד', lightBg: '#ccfbf1', darkBg: 'rgba(94,234,212,0.15)', border: '#5eead4' },
  { type: 'exhausted', emoji: '🥱', label: 'תשוש', lightBg: '#f1f5f9', darkBg: 'rgba(203,213,225,0.12)', border: '#cbd5e1' },
];

const ENERGY_LEVELS = [
  { level: 1, label: 'ריק לגמרי', emoji: '🪫', lightBg: '#fee2e2', darkBg: 'rgba(252,165,165,0.15)', border: '#fca5a5' },
  { level: 2, label: 'נמוך', emoji: '🔋', lightBg: '#ffedd5', darkBg: 'rgba(253,186,116,0.15)', border: '#fdba74' },
  { level: 3, label: 'בינוני', emoji: '⚡', lightBg: '#fef9c3', darkBg: 'rgba(253,224,71,0.15)', border: '#fde047' },
  { level: 4, label: 'טוב', emoji: '💪', lightBg: '#dcfce7', darkBg: 'rgba(134,239,172,0.15)', border: '#86efac' },
  { level: 5, label: 'מלא אנרגיה', emoji: '🚀', lightBg: '#d1fae5', darkBg: 'rgba(110,231,183,0.15)', border: '#6ee7b7' },
];

const GREETING = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: 'בוקר טוב', icon: Sun, sub: 'איך אתה מרגיש הבוקר?' };
  if (hour >= 12 && hour < 17) return { text: 'צהריים טובים', icon: Sun, sub: 'מה המצב שלך עכשיו?' };
  if (hour >= 17 && hour < 21) return { text: 'ערב טוב', icon: Moon, sub: 'איך עבר עליך היום?' };
  return { text: 'לילה טוב', icon: Moon, sub: 'איך אתה מרגיש לפני השינה?' };
};

export default function MoodCheckIn({ onComplete, isUpdate = false }: MoodCheckInProps) {
  const [step, setStep] = useState(0);
  const [selectedMoods, setSelectedMoods] = useState<Set<MoodType>>(new Set());
  const [energy, setEnergy] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const greeting = GREETING();
  const GreetingIcon = greeting.icon;

  const toggleMood = (mood: MoodType) => {
    setSelectedMoods(prev => {
      const next = new Set(prev);
      if (next.has(mood)) next.delete(mood);
      else next.add(mood);
      return next;
    });
  };

  const handleComplete = () => {
    if (selectedMoods.size === 0) return;
    const moodsArray = Array.from(selectedMoods);
    const primaryMood = moodsArray[0];
    const secondaryMoods = moodsArray.slice(1);
    onComplete(primaryMood, energy ?? 3, note || undefined, secondaryMoods.length > 0 ? secondaryMoods : undefined);
  };

  const selectedMoodEmojis = Array.from(selectedMoods).map(m => MOODS.find(mood => mood.type === m)?.emoji).join(' ');

  return (
    <div className="fixed inset-0 bg-cream z-[100] flex flex-col overflow-y-auto" dir="rtl">
      <AnimatePresence mode="wait">
        {/* Step 0: Select moods */}
        {step === 0 && (
          <motion.div
            key="mood"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-start pt-10 px-5 pb-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-14 h-14 rounded-full bg-sage/10 flex items-center justify-center mb-3"
            >
              <GreetingIcon size={28} className="text-sage" />
            </motion.div>

            <h1 className="text-xl font-bold text-text mb-0.5">{isUpdate ? 'עדכון מצב רוח' : greeting.text}</h1>
            <p className="text-text-light text-sm mb-1">{greeting.sub}</p>
            <p className="text-xs text-text-light/70 mb-4">אפשר לבחור כמה שמתאים</p>

            <div className="grid grid-cols-4 gap-2 w-full max-w-sm">
              {MOODS.map((mood, i) => {
                const isSelected = selectedMoods.has(mood.type);
                return (
                  <motion.button
                    key={mood.type}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: isSelected ? 1.08 : 1 }}
                    transition={{ delay: 0.05 + i * 0.02 }}
                    onClick={() => toggleMood(mood.type)}
                    style={{
                      backgroundColor: isDark ? mood.darkBg : mood.lightBg,
                      borderColor: isDark ? `${mood.border}60` : mood.border,
                      boxShadow: isSelected ? `0 0 0 3px ${mood.border}${isDark ? '80' : ''}, 0 2px 8px ${mood.border}66` : 'none',
                    }}
                    className="border-2 rounded-xl p-2 flex flex-col items-center gap-0.5 transition-all active:scale-95 relative"
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-sage flex items-center justify-center"
                      >
                        <Check size={12} className="text-white" />
                      </motion.div>
                    )}
                    <span className="text-xl">{mood.emoji}</span>
                    <span className="text-[10px] font-medium text-text">{mood.label}</span>
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              animate={{ opacity: selectedMoods.size > 0 ? 1 : 0.3 }}
              whileTap={selectedMoods.size > 0 ? { scale: 0.95 } : undefined}
              onClick={() => selectedMoods.size > 0 && setStep(1)}
              disabled={selectedMoods.size === 0}
              className="mt-5 w-full max-w-sm bg-sage text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              <span>המשך</span>
              <ChevronLeft size={18} />
              {selectedMoods.size > 0 && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {selectedMoods.size} נבחרו
                </span>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Step 1: Energy level */}
        {step === 1 && (
          <motion.div
            key="energy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center p-6"
          >
            <button onClick={() => setStep(0)} className="absolute top-4 right-4 p-2">
              <ChevronRight size={24} className="text-text-light" />
            </button>

            <div className="text-3xl mb-4">{selectedMoodEmojis}</div>
            <h2 className="text-xl font-bold text-text mb-2">מה רמת האנרגיה שלך?</h2>
            <p className="text-text-light mb-6">זה יעזור לי להתאים לך תוכנית יום</p>

            <div className="flex flex-col gap-3 w-full max-w-sm">
              {ENERGY_LEVELS.map((e, i) => {
                const isSelected = energy === e.level;
                return (
                  <motion.button
                    key={e.level}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    onClick={() => setEnergy(e.level)}
                    style={{
                      backgroundColor: isDark ? e.darkBg : e.lightBg,
                      borderColor: isDark ? `${e.border}60` : e.border,
                      boxShadow: isSelected ? `0 0 0 3px ${e.border}${isDark ? '80' : ''}` : 'none',
                    }}
                    className="border-2 rounded-xl p-3.5 flex items-center gap-3 transition-all active:scale-95"
                  >
                    <span className="text-2xl">{e.emoji}</span>
                    <span className="font-semibold text-text">{e.label}</span>
                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mr-auto">
                        <Check size={18} className="text-sage" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              animate={{ opacity: energy !== null ? 1 : 0.3 }}
              whileTap={energy !== null ? { scale: 0.95 } : undefined}
              onClick={() => energy !== null && setStep(2)}
              disabled={energy === null}
              className="mt-5 w-full max-w-sm bg-sage text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              <span>המשך</span>
              <ChevronLeft size={18} />
            </motion.button>
          </motion.div>
        )}

        {/* Step 2: Note */}
        {step === 2 && (
          <motion.div
            key="note"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center p-6"
          >
            <button onClick={() => setStep(1)} className="absolute top-4 right-4 p-2">
              <ChevronRight size={24} className="text-text-light" />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mb-4"
            >
              <Heart size={28} className="text-sage" />
            </motion.div>

            <h2 className="text-xl font-bold text-text mb-2">רוצה לשתף מה עובר עליך?</h2>
            <p className="text-text-light mb-6 text-center">
              זה לגמרי אופציונלי, אבל לפעמים כתיבה עוזרת לעבד
            </p>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="מה על הלב שלך עכשיו..."
              className="w-full max-w-sm h-32 bg-card rounded-xl p-4 text-right resize-none border border-cream-dark focus:border-sage focus:outline-none text-text placeholder:text-text-light/50"
              dir="rtl"
            />

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleComplete}
              className="mt-6 w-full max-w-sm bg-sage text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              {note ? 'יאללה, תכין לי תוכנית' : 'דלג ותכין תוכנית'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 pb-6">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === step ? 'bg-sage w-6' : i < step ? 'bg-sage/50' : 'bg-cream-dark'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
