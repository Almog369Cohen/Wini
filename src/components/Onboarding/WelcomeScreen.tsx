import { useState } from 'react';
import { motion } from 'framer-motion';

interface WelcomeScreenProps {
  onComplete: (name: string) => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [name, setName] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-cream z-[110] flex flex-col items-center justify-center p-6"
      dir="rtl"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="text-6xl mb-6"
      >
        🌱
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-bold text-text mb-2"
      >
        ברוכים הבאים ל-Wini
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-text-light text-center mb-8 max-w-xs"
      >
        האפליקציה שתעזור לך לגמול מהרגלים רעים ולבנות חיים חדשים
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-sm"
      >
        <label className="text-sm font-medium text-text mb-2 block">
          איך קוראים לך?
        </label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="השם או הכינוי שלך..."
          className="w-full bg-card rounded-xl p-4 text-text text-center text-lg border border-cream-dark focus:border-sage focus:outline-none mb-4"
          autoFocus
          onKeyDown={e => {
            if (e.key === 'Enter' && name.trim()) onComplete(name.trim());
          }}
        />

        <motion.button
          animate={{ opacity: name.trim() ? 1 : 0.3 }}
          whileTap={name.trim() ? { scale: 0.95 } : undefined}
          onClick={() => name.trim() && onComplete(name.trim())}
          disabled={!name.trim()}
          className="w-full bg-sage text-white py-3.5 rounded-xl font-semibold text-lg disabled:cursor-not-allowed"
        >
          יאללה, בוא נתחיל! 🚀
        </motion.button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-[11px] text-text-light/50 mt-8 text-center"
      >
        כל הנתונים שלך נשמרים על המכשיר שלך בלבד
      </motion.p>
    </motion.div>
  );
}
