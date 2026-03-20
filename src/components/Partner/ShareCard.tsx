import { motion } from 'framer-motion';

interface ShareCardProps {
  userName: string;
  streak: number;
  victories: number;
  habitsCount: number;
}

export default function ShareCard({ userName, streak, victories, habitsCount }: ShareCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
      className="bg-white rounded-3xl p-6 shadow-lg border border-sage/20 overflow-hidden relative"
    >
      {/* Decorative background circles */}
      <div className="absolute top-[-30px] left-[-30px] w-24 h-24 rounded-full bg-sage/10" />
      <div className="absolute bottom-[-20px] right-[-20px] w-20 h-20 rounded-full bg-sage/5" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-5 relative z-10"
      >
        <div className="text-3xl mb-2">🌱</div>
        <h3 className="text-lg font-bold text-text">{userName}</h3>
        <p className="text-xs text-text-light">במסע שינוי עם Wini</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-5 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-sage/10 rounded-2xl p-3 text-center"
        >
          <p className="text-2xl font-bold text-sage">{streak}</p>
          <p className="text-[10px] text-text-light mt-0.5">ימים רצופים</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-sage/10 rounded-2xl p-3 text-center"
        >
          <p className="text-2xl font-bold text-sage">{victories}</p>
          <p className="text-[10px] text-text-light mt-0.5">ניצחונות</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-sage/10 rounded-2xl p-3 text-center"
        >
          <p className="text-2xl font-bold text-sage">{habitsCount}</p>
          <p className="text-[10px] text-text-light mt-0.5">הרגלים פעילים</p>
        </motion.div>
      </div>

      {/* Motivational message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-cream rounded-xl p-3 text-center mb-4 relative z-10"
      >
        <p className="text-sm text-sage-dark font-medium leading-relaxed">
          {streak >= 30
            ? 'חודש שלם של עקביות! השינוי כבר חלק ממני'
            : streak >= 14
              ? 'שבועיים של התמדה! אני על הדרך הנכונה'
              : streak >= 7
                ? 'שבוע שלם! ההרגלים החדשים מתגבשים'
                : streak >= 3
                  ? 'כבר 3 ימים! התחלתי לבנות מומנטום'
                  : 'כל מסע מתחיל בצעד הראשון'}
        </p>
      </motion.div>

      {/* Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center justify-center gap-1.5 relative z-10"
      >
        <span className="text-xs text-text-light">נוצר עם</span>
        <span className="text-sm font-bold text-sage">Wini</span>
        <span className="text-xs">🌿</span>
      </motion.div>
    </motion.div>
  );
}
