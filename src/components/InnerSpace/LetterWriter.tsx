import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import type { LetterToSelf } from '../../types';

interface LetterWriterProps {
  letters: LetterToSelf[];
  onWrite: (content: string, type: 'past' | 'future', openDate?: string) => void;
}

export default function LetterWriter({ letters, onWrite }: LetterWriterProps) {
  const [letterType, setLetterType] = useState<'past' | 'future' | null>(null);
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(false);

  const prompts = {
    past: {
      title: 'מכתב לעצמי הצעיר',
      placeholder: 'אם היית יכול לדבר עם עצמך לפני שהתחלת את ההרגל הזה, מה היית אומר? מה היית רוצה שתדע?',
      icon: '👦',
    },
    future: {
      title: 'מכתב לעצמי העתידי',
      placeholder: 'כתוב לעצמך בעוד שנה. מה אתה מקווה? מה אתה מבטיח? מה אתה רוצה לזכור מהרגע הזה?',
      icon: '🌟',
    },
  };

  const handleSend = () => {
    if (!content.trim() || !letterType) return;
    onWrite(content.trim(), letterType);
    setContent('');
    setLetterType(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (saved) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card rounded-2xl p-8 shadow-sm text-center"
      >
        <div className="text-4xl mb-3">💌</div>
        <h3 className="text-lg font-semibold text-text mb-1">המכתב נשמר</h3>
        <p className="text-sm text-text-light">
          המילים שלך שמורות כאן. תמיד תוכל לחזור אליהן.
        </p>
      </motion.div>
    );
  }

  if (!letterType) {
    return (
      <div className="space-y-4">
        <div className="bg-card rounded-2xl p-5 shadow-sm text-center">
          <h3 className="text-sm font-semibold text-text mb-1">כתוב מכתב לעצמך</h3>
          <p className="text-xs text-text-light mb-4">
            לפעמים המילים הכי חשובות הן אלה שאנחנו אומרים לעצמנו.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setLetterType('past')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-sand/10 border border-sand/20 hover:border-sand/40 transition-all"
            >
              <span className="text-3xl">👦</span>
              <span className="text-xs font-medium text-text">לעצמי הצעיר</span>
              <span className="text-[9px] text-text-light">מה הייתי רוצה לדעת</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setLetterType('future')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-sage/10 border border-sage/20 hover:border-sage/40 transition-all"
            >
              <span className="text-3xl">🌟</span>
              <span className="text-xs font-medium text-text">לעצמי העתידי</span>
              <span className="text-[9px] text-text-light">מה אני מבטיח</span>
            </motion.button>
          </div>
        </div>

        {/* Previous letters */}
        {letters.length > 0 && (
          <div className="bg-card rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs text-text-light font-semibold mb-3">
              המכתבים שלי ({letters.length})
            </h3>
            <div className="space-y-2.5">
              {letters.map((letter) => (
                <div
                  key={letter.id}
                  className={`rounded-xl p-3 ${
                    letter.type === 'past' ? 'bg-sand/5' : 'bg-sage/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Mail size={12} className="text-text-light" />
                      <span className="text-[10px] text-text-light">
                        {letter.type === 'past' ? 'לעצמי הצעיר' : 'לעצמי העתידי'}
                      </span>
                    </div>
                    <span className="text-[9px] text-text-light">
                      {format(new Date(letter.date), 'd MMMM yyyy', { locale: he })}
                    </span>
                  </div>
                  <p className="text-xs text-text leading-relaxed">{letter.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const p = prompts[letterType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-5 shadow-sm"
    >
      <button
        onClick={() => setLetterType(null)}
        className="text-xs text-text-light hover:text-text mb-3"
      >
        ← חזור
      </button>

      <div className="text-center mb-4">
        <span className="text-3xl">{p.icon}</span>
        <h3 className="text-sm font-semibold text-text mt-2">{p.title}</h3>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={p.placeholder}
        className="w-full bg-cream/30 border border-cream-dark rounded-xl p-4 text-sm resize-none h-40 focus:outline-none focus:border-sage leading-relaxed placeholder:text-text-light/50 placeholder:text-xs"
        autoFocus
      />

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSend}
        disabled={!content.trim()}
        className={`w-full mt-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
          content.trim()
            ? 'bg-sage text-white'
            : 'bg-cream-dark text-text-light cursor-not-allowed'
        }`}
      >
        <Send size={14} />
        שלח מכתב
      </motion.button>
    </motion.div>
  );
}
