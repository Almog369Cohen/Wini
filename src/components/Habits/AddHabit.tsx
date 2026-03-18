import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import type { HabitType, HabitCategory } from '../../types';

interface AddHabitProps {
  onAdd: (data: {
    name: string;
    type: HabitType;
    category: HabitCategory;
    dailyCost?: number;
    triggers?: string[];
    reasons?: string[];
  }) => void;
  onClose: () => void;
}

const categories: { value: HabitCategory; label: string; emoji: string }[] = [
  { value: 'smoking', label: 'עישון', emoji: '🚬' },
  { value: 'alcohol', label: 'אלכוהול', emoji: '🍷' },
  { value: 'sugar', label: 'סוכר', emoji: '🍬' },
  { value: 'caffeine', label: 'קפאין', emoji: '☕' },
  { value: 'screens', label: 'מסכים', emoji: '📱' },
  { value: 'junkfood', label: 'ג\'אנק פוד', emoji: '🍔' },
  { value: 'exercise', label: 'ספורט', emoji: '🏃' },
  { value: 'meditation', label: 'מדיטציה', emoji: '🧘' },
  { value: 'reading', label: 'קריאה', emoji: '📖' },
  { value: 'water', label: 'שתיית מים', emoji: '💧' },
  { value: 'sleep', label: 'שינה', emoji: '😴' },
  { value: 'other', label: 'אחר', emoji: '✨' },
];

export default function AddHabit({ onAdd, onClose }: AddHabitProps) {
  const [type, setType] = useState<HabitType>('quit');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<HabitCategory>('smoking');
  const [dailyCost, setDailyCost] = useState('');
  const [reasonInput, setReasonInput] = useState('');
  const [reasons, setReasons] = useState<string[]>([]);
  const [triggerInput, setTriggerInput] = useState('');
  const [triggers, setTriggers] = useState<string[]>([]);

  const filteredCategories = categories.filter((c) => {
    const quitCats: HabitCategory[] = ['smoking', 'alcohol', 'sugar', 'caffeine', 'screens', 'junkfood', 'other'];
    const buildCats: HabitCategory[] = ['exercise', 'meditation', 'reading', 'water', 'sleep', 'other'];
    return type === 'quit' ? quitCats.includes(c.value) : buildCats.includes(c.value);
  });

  const addReason = () => {
    if (reasonInput.trim()) {
      setReasons((prev) => [...prev, reasonInput.trim()]);
      setReasonInput('');
    }
  };

  const addTrigger = () => {
    if (triggerInput.trim()) {
      setTriggers((prev) => [...prev, triggerInput.trim()]);
      setTriggerInput('');
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      type,
      category,
      dailyCost: dailyCost ? Number(dailyCost) : undefined,
      triggers,
      reasons,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-cream rounded-t-2xl w-full max-w-lg max-h-[85dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-cream z-10 flex items-center justify-between p-4 border-b border-cream-dark">
          <h2 className="text-lg font-semibold text-text">הרגל חדש</h2>
          <button onClick={onClose} className="p-1 text-text-light hover:text-text">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Type toggle */}
          <div className="flex bg-cream-dark rounded-xl p-1">
            <button
              onClick={() => { setType('quit'); setCategory('smoking'); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                type === 'quit'
                  ? 'bg-coral text-white'
                  : 'text-text-light'
              }`}
            >
              גמילה מהרגל רע
            </button>
            <button
              onClick={() => { setType('build'); setCategory('exercise'); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                type === 'build'
                  ? 'bg-sage text-white'
                  : 'text-text-light'
              }`}
            >
              בניית הרגל חיובי
            </button>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs text-text-light block mb-1">שם ההרגל</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === 'quit' ? 'למשל: סיגריות' : 'למשל: ריצה בוקר'}
              className="w-full bg-card border border-cream-dark rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sage"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs text-text-light block mb-2">קטגוריה</label>
            <div className="flex flex-wrap gap-2">
              {filteredCategories.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all ${
                    category === c.value
                      ? type === 'quit'
                        ? 'bg-coral text-white'
                        : 'bg-sage text-white'
                      : 'bg-card border border-cream-dark text-text-light'
                  }`}
                >
                  <span>{c.emoji}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Daily cost (for quit habits) */}
          {type === 'quit' && (
            <div>
              <label className="text-xs text-text-light block mb-1">
                עלות יומית (₪) - אופציונלי
              </label>
              <input
                type="number"
                value={dailyCost}
                onChange={(e) => setDailyCost(e.target.value)}
                placeholder="כמה זה עולה לך ביום?"
                className="w-full bg-card border border-cream-dark rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sage"
              />
            </div>
          )}

          {/* Reasons */}
          <div>
            <label className="text-xs text-text-light block mb-1">
              למה אני עושה את זה? (יופיע ב-SOS)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addReason()}
                placeholder="הוסף סיבה..."
                className="flex-1 bg-card border border-cream-dark rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-sage"
              />
              <button
                onClick={addReason}
                className="bg-sage/10 text-sage px-3 rounded-xl hover:bg-sage/20 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            {reasons.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {reasons.map((r, i) => (
                  <span
                    key={i}
                    className="bg-sage/10 text-sage text-xs px-2.5 py-1 rounded-full cursor-pointer hover:bg-coral/10 hover:text-coral transition-colors"
                    onClick={() => setReasons((prev) => prev.filter((_, idx) => idx !== i))}
                  >
                    {r} ×
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Triggers (for quit habits) */}
          {type === 'quit' && (
            <div>
              <label className="text-xs text-text-light block mb-1">
                טריגרים - מה גורם לדחף?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={triggerInput}
                  onChange={(e) => setTriggerInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTrigger()}
                  placeholder="למשל: אחרי אוכל, לחץ..."
                  className="flex-1 bg-card border border-cream-dark rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-sage"
                />
                <button
                  onClick={addTrigger}
                  className="bg-sand/20 text-sand px-3 rounded-xl hover:bg-sand/30 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              {triggers.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {triggers.map((t, i) => (
                    <span
                      key={i}
                      className="bg-sand/10 text-sand text-xs px-2.5 py-1 rounded-full cursor-pointer hover:bg-coral/10 hover:text-coral transition-colors"
                      onClick={() => setTriggers((prev) => prev.filter((_, idx) => idx !== i))}
                    >
                      {t} ×
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className={`w-full py-3 rounded-xl text-white font-medium transition-all ${
              name.trim()
                ? type === 'quit'
                  ? 'bg-coral hover:bg-coral-light'
                  : 'bg-sage hover:bg-sage-dark'
                : 'bg-cream-dark text-text-light cursor-not-allowed'
            }`}
          >
            {type === 'quit' ? 'התחל גמילה' : 'התחל לבנות'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
