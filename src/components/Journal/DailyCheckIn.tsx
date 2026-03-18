import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import type { WithdrawalSymptom } from '../../types';

interface DailyCheckInProps {
  onSubmit: (data: {
    mood: number;
    cravingIntensity: number;
    note: string;
    triggers?: string[];
    whatHelped?: string;
    symptoms?: WithdrawalSymptom[];
  }) => void;
}

const moods = [
  { value: 1, emoji: '😔', label: 'קשה' },
  { value: 2, emoji: '😕', label: 'לא טוב' },
  { value: 3, emoji: '😐', label: 'סביר' },
  { value: 4, emoji: '🙂', label: 'טוב' },
  { value: 5, emoji: '😊', label: 'מצוין' },
];

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

export default function DailyCheckIn({ onSubmit }: DailyCheckInProps) {
  const [mood, setMood] = useState(3);
  const [craving, setCraving] = useState(5);
  const [note, setNote] = useState('');
  const [whatHelped, setWhatHelped] = useState('');
  const [symptoms, setSymptoms] = useState<WithdrawalSymptom[]>([]);

  const toggleSymptom = (s: WithdrawalSymptom) => {
    setSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = () => {
    onSubmit({
      mood,
      cravingIntensity: craving,
      note,
      whatHelped,
      symptoms: symptoms.length > 0 ? symptoms : undefined,
    });
    setNote('');
    setWhatHelped('');
    setSymptoms([]);
  };

  return (
    <div className="space-y-5">
      {/* Mood */}
      <div>
        <label className="text-xs text-text-light block mb-2">איך אתה מרגיש?</label>
        <div className="flex justify-between bg-cream/50 rounded-xl p-2">
          {moods.map((m) => (
            <button
              key={m.value}
              onClick={() => setMood(m.value)}
              className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition-all ${
                mood === m.value
                  ? 'bg-card shadow-sm scale-110'
                  : 'opacity-50 hover:opacity-70'
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-[9px] text-text-light">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Craving intensity */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs text-text-light">עוצמת דחף</label>
          <span
            className="text-sm font-bold"
            style={{
              color:
                craving <= 3
                  ? '#5b8a72'
                  : craving <= 6
                    ? '#d4a574'
                    : '#c97b63',
            }}
          >
            {craving}/10
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          value={craving}
          onChange={(e) => setCraving(Number(e.target.value))}
          className="w-full h-2 bg-cream-dark rounded-lg appearance-none cursor-pointer"
          style={{
            accentColor:
              craving <= 3
                ? '#5b8a72'
                : craving <= 6
                  ? '#d4a574'
                  : '#c97b63',
          }}
        />
        <div className="flex justify-between text-[9px] text-text-light mt-1">
          <span>אין דחף</span>
          <span>דחף חזק מאוד</span>
        </div>
      </div>

      {/* Withdrawal Symptoms */}
      <div>
        <label className="text-xs text-text-light block mb-2">
          תסמיני גמילה (סמן מה שרלוונטי)
        </label>
        <div className="flex flex-wrap gap-2">
          {symptomOptions.map((s) => (
            <button
              key={s.value}
              onClick={() => toggleSymptom(s.value)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs transition-all ${
                symptoms.includes(s.value)
                  ? 'bg-coral/15 text-coral border border-coral/30'
                  : 'bg-cream/50 text-text-light border border-cream-dark hover:border-sand'
              }`}
            >
              <span>{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Note */}
      <div>
        <label className="text-xs text-text-light block mb-1">מה עובר עליך?</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="ספר קצת על היום שלך..."
          className="w-full bg-cream/50 border border-cream-dark rounded-xl p-3 text-sm resize-none h-20 focus:outline-none focus:border-sage"
        />
      </div>

      {/* What helped */}
      <div>
        <label className="text-xs text-text-light block mb-1">מה עזר לך היום?</label>
        <input
          type="text"
          value={whatHelped}
          onChange={(e) => setWhatHelped(e.target.value)}
          placeholder="למשל: הליכה, שיחה עם חבר..."
          className="w-full bg-cream/50 border border-cream-dark rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sage"
        />
      </div>

      {/* Submit */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        className="w-full bg-sage text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-sage-dark transition-colors"
      >
        <Send size={16} />
        שמור צ'ק-אין
      </motion.button>
    </div>
  );
}
