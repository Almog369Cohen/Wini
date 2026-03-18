import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Send, Check } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { reflectionPrompts } from '../../data/reflections';
import type { Reflection } from '../../types';

interface ReflectionCardsProps {
  reflections: Reflection[];
  journeyStage: number;
  onAnswer: (promptId: string, answer: string) => void;
}

export default function ReflectionCards({
  reflections,
  journeyStage,
  onAnswer,
}: ReflectionCardsProps) {
  const availablePrompts = reflectionPrompts.filter((p) => p.stage <= journeyStage);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [justSaved, setJustSaved] = useState(false);

  const prompt = availablePrompts[currentIndex];
  if (!prompt) return null;

  const existingAnswer = reflections.find((r) => r.promptId === prompt.id);

  const handleSave = () => {
    if (!answer.trim()) return;
    onAnswer(prompt.id, answer.trim());
    setAnswer('');
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const next = () => {
    setCurrentIndex((i) => (i + 1) % availablePrompts.length);
    setAnswer('');
    setJustSaved(false);
  };

  const prev = () => {
    setCurrentIndex((i) => (i - 1 + availablePrompts.length) % availablePrompts.length);
    setAnswer('');
    setJustSaved(false);
  };

  const categoryColors = {
    understand: 'from-sand/20 to-sand/5',
    feel: 'from-coral/15 to-coral/5',
    grow: 'from-sage/15 to-sage/5',
    dream: 'from-sea/20 to-sea/5',
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={prompt.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className={`bg-gradient-to-b ${categoryColors[prompt.category]} rounded-2xl p-5 shadow-sm`}
        >
          <div className="text-center mb-4">
            <p className="text-base font-semibold text-text leading-relaxed mb-2">
              {prompt.question}
            </p>
            <p className="text-xs text-text-light italic">{prompt.subtext}</p>
          </div>

          {existingAnswer && !justSaved ? (
            <div className="bg-card/60 rounded-xl p-3 mb-3">
              <p className="text-xs text-text-light mb-1">
                ענית {format(new Date(existingAnswer.date), 'd MMMM', { locale: he })}
              </p>
              <p className="text-sm text-text">{existingAnswer.answer}</p>
            </div>
          ) : null}

          {justSaved ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-4"
            >
              <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-2">
                <Check size={20} className="text-sage" />
              </div>
              <p className="text-sm text-sage font-medium">נשמר. תודה שהקשבת לעצמך.</p>
            </motion.div>
          ) : (
            <>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="קח את הזמן שלך... אין לחץ."
                className="w-full bg-card/60 border border-cream-dark/50 rounded-xl p-3 text-sm resize-none h-24 focus:outline-none focus:border-sage placeholder:text-text-light/50"
              />
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                disabled={!answer.trim()}
                className={`w-full mt-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                  answer.trim()
                    ? 'bg-sage text-white'
                    : 'bg-cream-dark text-text-light cursor-not-allowed'
                }`}
              >
                <Send size={14} />
                שמור תשובה
              </motion.button>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={prev} className="w-8 h-8 rounded-full bg-card shadow-sm flex items-center justify-center text-text-light hover:text-sage">
          <ChevronRight size={18} />
        </button>
        <span className="text-[10px] text-text-light">
          {currentIndex + 1} / {availablePrompts.length}
        </span>
        <button onClick={next} className="w-8 h-8 rounded-full bg-card shadow-sm flex items-center justify-center text-text-light hover:text-sage">
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* Previous reflections */}
      {reflections.length > 0 && (
        <div className="bg-card rounded-2xl p-4 shadow-sm">
          <h3 className="text-xs text-text-light font-semibold mb-3">
            תשובות קודמות ({reflections.length})
          </h3>
          <div className="space-y-2.5 max-h-60 overflow-y-auto">
            {reflections.slice(0, 5).map((r) => {
              const p = reflectionPrompts.find((rp) => rp.id === r.promptId);
              return (
                <div key={r.id} className="bg-cream/30 rounded-xl p-3">
                  <p className="text-[10px] text-text-light mb-1">
                    {p?.question}
                  </p>
                  <p className="text-xs text-text">{r.answer}</p>
                  <p className="text-[9px] text-text-light mt-1">
                    {format(new Date(r.date), 'd MMMM yyyy', { locale: he })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
