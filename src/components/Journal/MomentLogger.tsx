import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsDown, Trophy, Send } from 'lucide-react';
import type { MomentType, WithdrawalSymptom } from '../../types';

interface MomentLoggerProps {
  onSubmit: (data: {
    type: MomentType;
    mood: number;
    cravingIntensity: number;
    note: string;
    triggers?: string[];
    whatHelped?: string;
    symptoms?: WithdrawalSymptom[];
  }) => void;
}

const symptomOptions: { value: WithdrawalSymptom; label: string; emoji: string }[] = [
  { value: 'headache', label: 'כאב ראש', emoji: '🤕' },
  { value: 'irritability', label: 'עצבנות', emoji: '😤' },
  { value: 'insomnia', label: 'נדודי שינה', emoji: '😵' },
  { value: 'anxiety', label: 'חרדה', emoji: '😰' },
  { value: 'fatigue', label: 'עייפות', emoji: '😩' },
  { value: 'appetite', label: 'שינוי תיאבון', emoji: '🍽️' },
  { value: 'concentration', label: 'קושי בריכוז', emoji: '🧠' },
  { value: 'restlessness', label: 'אי שקט', emoji: '😖' },
];

const quickTriggers = ['לחץ', 'שעמום', 'אחרי אוכל', 'חברה', 'עייפות', 'כעס'];

export default function MomentLogger({ onSubmit }: MomentLoggerProps) {
  const [type, setType] = useState<MomentType | null>(null);
  const [craving, setCraving] = useState(5);
  const [note, setNote] = useState('');
  const [whatHelped, setWhatHelped] = useState('');
  const [symptoms, setSymptoms] = useState<WithdrawalSymptom[]>([]);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleSymptom = (s: WithdrawalSymptom) => {
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const toggleTrigger = (t: string) => {
    setTriggers((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const reset = () => {
    setType(null);
    setCraving(5);
    setNote('');
    setWhatHelped('');
    setSymptoms([]);
    setTriggers([]);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (!type) return;
    onSubmit({
      type,
      mood: type === 'victory' ? 4 : 2,
      cravingIntensity: craving,
      note,
      triggers: triggers.length > 0 ? triggers : undefined,
      whatHelped: whatHelped || undefined,
      symptoms: symptoms.length > 0 ? symptoms : undefined,
    });
    setSubmitted(true);
    setTimeout(reset, 2000);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-8"
      >
        <div className="text-4xl mb-3">{type === 'victory' ? '💪' : '📝'}</div>
        <h3 className="text-lg font-semibold text-text mb-1">
          {type === 'victory' ? 'ניצחון נרשם!' : 'הרגע תועד'}
        </h3>
        <p className="text-sm text-text-light">
          {type === 'victory'
            ? 'כל ניצחון מחזק אותך. המשך ככה!'
            : 'הכרה בנפילה היא הצעד הראשון. אתה אמיץ.'}
        </p>
      </motion.div>
    );
  }

  // Step 1: Choose type
  if (!type) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-text-light text-center mb-2">מה קרה עכשיו?</p>

        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setType('fall')}
            className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-coral/8 border-2 border-coral/20 hover:border-coral/40 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-coral/15 flex items-center justify-center">
              <ThumbsDown size={22} className="text-coral" />
            </div>
            <span className="text-sm font-semibold text-coral">רגע של נפילה</span>
            <span className="text-[10px] text-text-light">נכנעתי לדחף</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setType('victory')}
            className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-sage/8 border-2 border-sage/20 hover:border-sage/40 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-sage/15 flex items-center justify-center">
              <Trophy size={22} className="text-sage" />
            </div>
            <span className="text-sm font-semibold text-sage">רגע של ניצחון</span>
            <span className="text-[10px] text-text-light">התגברתי על הדחף</span>
          </motion.button>
        </div>

        <p className="text-[10px] text-text-light text-center">
          תעד כל רגע כדי לזהות את הדפוסים שלך
        </p>
      </div>
    );
  }

  const isFall = type === 'fall';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={type}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-4"
      >
        {/* Type indicator */}
        <div className="flex items-center justify-between">
          <button onClick={reset} className="text-xs text-text-light hover:text-text">
            ← חזור
          </button>
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
              isFall ? 'bg-coral/10 text-coral' : 'bg-sage/10 text-sage'
            }`}
          >
            {isFall ? <ThumbsDown size={12} /> : <Trophy size={12} />}
            {isFall ? 'נפילה' : 'ניצחון'}
          </div>
        </div>

        {/* Craving intensity */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs text-text-light">
              {isFall ? 'כמה חזק היה הדחף?' : 'כמה חזק היה הדחף שניצחת?'}
            </label>
            <span
              className="text-sm font-bold"
              style={{
                color: craving <= 3 ? '#03b28c' : craving <= 6 ? '#059cc0' : '#e05c4d',
              }}
            >
              {craving}/10
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={craving}
            onChange={(e) => setCraving(Number(e.target.value))}
            className="w-full h-2 bg-cream-dark rounded-lg appearance-none cursor-pointer"
            style={{
              accentColor: craving <= 3 ? '#03b28c' : craving <= 6 ? '#059cc0' : '#e05c4d',
            }}
          />
        </div>

        {/* Fall-specific: triggers */}
        {isFall && (
          <div>
            <label className="text-xs text-text-light block mb-2">מה גרם לזה?</label>
            <div className="flex flex-wrap gap-1.5">
              {quickTriggers.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTrigger(t)}
                  className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                    triggers.includes(t)
                      ? 'bg-coral/15 text-coral border border-coral/30'
                      : 'bg-cream/50 text-text-light border border-cream-dark'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fall-specific: symptoms */}
        {isFall && (
          <div>
            <label className="text-xs text-text-light block mb-2">תסמינים</label>
            <div className="flex flex-wrap gap-1.5">
              {symptomOptions.map((s) => (
                <button
                  key={s.value}
                  onClick={() => toggleSymptom(s.value)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] transition-all ${
                    symptoms.includes(s.value)
                      ? 'bg-coral/15 text-coral border border-coral/30'
                      : 'bg-cream/50 text-text-light border border-cream-dark'
                  }`}
                >
                  <span>{s.emoji}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Victory-specific: what helped */}
        {!isFall && (
          <div>
            <label className="text-xs text-text-light block mb-1">מה עזר לך?</label>
            <input
              type="text"
              value={whatHelped}
              onChange={(e) => setWhatHelped(e.target.value)}
              placeholder="למשל: הליכה, נשימות, שיחה..."
              className="w-full bg-cream/50 border border-cream-dark rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sage"
            />
          </div>
        )}

        {/* Note */}
        <div>
          <label className="text-xs text-text-light block mb-1">
            {isFall ? 'מה קרה?' : 'ספר על הרגע'}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={isFall ? 'תאר בקצרה מה קרה...' : 'איך הרגשת כשניצחת?'}
            className="w-full bg-cream/50 border border-cream-dark rounded-xl p-3 text-sm resize-none h-16 focus:outline-none focus:border-sage"
          />
        </div>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors text-white ${
            isFall ? 'bg-coral hover:bg-coral-light' : 'bg-sage hover:bg-sage-dark'
          }`}
        >
          <Send size={16} />
          {isFall ? 'תעד נפילה' : 'תעד ניצחון'}
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
