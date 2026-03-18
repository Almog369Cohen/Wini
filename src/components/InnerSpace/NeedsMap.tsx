import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { emotionalNeeds } from '../../data/reflections';

interface NeedsMapProps {
  selectedNeeds: string[];
  needNotes: Record<string, string>;
  onToggle: (needId: string) => void;
  onNote: (needId: string, note: string) => void;
}

export default function NeedsMap({
  selectedNeeds,
  needNotes,
  onToggle,
  onNote,
}: NeedsMapProps) {
  const [expandedNeed, setExpandedNeed] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const handleExpand = (needId: string) => {
    if (expandedNeed === needId) {
      setExpandedNeed(null);
    } else {
      setExpandedNeed(needId);
      setNoteText(needNotes[needId] || '');
    }
  };

  const handleSaveNote = (needId: string) => {
    onNote(needId, noteText);
    setExpandedNeed(null);
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-2xl p-5 shadow-sm">
        <div className="text-center mb-4">
          <h3 className="text-sm font-semibold text-text mb-1">
            איזה חסך ההרגל ממלא לך?
          </h3>
          <p className="text-xs text-text-light">
            סמן את מה שמרגיש נכון. אין תשובה לא נכונה.
          </p>
        </div>

        <div className="space-y-2">
          {emotionalNeeds.map((need, i) => {
            const isSelected = selectedNeeds.includes(need.id);
            const isExpanded = expandedNeed === need.id;

            return (
              <motion.div
                key={need.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <button
                  onClick={() => {
                    onToggle(need.id);
                    if (!isSelected) handleExpand(need.id);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-right ${
                    isSelected
                      ? 'bg-sage/10 border border-sage/20'
                      : 'bg-cream/30 border border-transparent hover:border-cream-dark'
                  }`}
                >
                  <span className="text-xl">{need.emoji}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isSelected ? 'text-sage' : 'text-text'}`}>
                      {need.label}
                    </p>
                    <p className="text-[10px] text-text-light">{need.description}</p>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full bg-sage flex items-center justify-center"
                    >
                      <span className="text-white text-xs">✓</span>
                    </motion.div>
                  )}
                </button>

                {/* Expanded note */}
                <AnimatePresence>
                  {isSelected && isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 pr-12">
                        <p className="text-xs text-text-light mb-1.5">
                          רוצה לכתוב על זה? מתי זה קורה?
                        </p>
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="למשל: כשאני חוזר מהעבודה עייף..."
                          className="w-full bg-card border border-cream-dark rounded-lg p-2 text-xs resize-none h-14 focus:outline-none focus:border-sage"
                        />
                        <button
                          onClick={() => handleSaveNote(need.id)}
                          className="text-[10px] text-sage mt-1 hover:underline"
                        >
                          שמור
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Saved note preview */}
                {isSelected && !isExpanded && needNotes[need.id] && (
                  <button
                    onClick={() => handleExpand(need.id)}
                    className="pr-12 pt-1"
                  >
                    <p className="text-[10px] text-sage-light italic">
                      "{needNotes[need.id]}"
                    </p>
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {selectedNeeds.length > 0 && (
        <div className="bg-sage/5 rounded-2xl p-4">
          <p className="text-xs text-sage leading-relaxed text-center">
            הכרה בצרכים שלך היא צעד אמיץ. עכשיו אתה יכול לחפש דרכים בריאות למלא אותם
            - במקום דרך ההרגל.
          </p>
        </div>
      )}
    </div>
  );
}
