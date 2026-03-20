import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Flame, Clock, Star } from 'lucide-react';
import { useDailyChallenges } from '../../hooks/useDailyChallenges';

interface DailyChallengesPageProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1.5 text-text-light">
      <Clock size={13} />
      <span className="text-xs">אתגר חדש מחר בעוד</span>
      <span className="text-xs font-mono font-bold text-sage" dir="ltr">{timeLeft}</span>
    </div>
  );
}

// Simple confetti particles
function ChallengeConfetti() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random() * 1.5,
    color: ['#03b28c', '#059cc0', '#e05c4d', '#f59e0b', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 6)],
    size: 4 + Math.random() * 6,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: 0, rotate: 360 + Math.random() * 360 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

export default function DailyChallengesPage({ showToast }: DailyChallengesPageProps) {
  const { todayChallenges, completeChallenge, todayCompleted, streak, xpEarned, categoryMeta } = useDailyChallenges();
  const [justCompleted, setJustCompleted] = useState<string | null>(null);
  const [showAllDone, setShowAllDone] = useState(false);
  const [prevCompletedCount, setPrevCompletedCount] = useState(todayCompleted.length);

  const completedCount = todayCompleted.length;
  const allDone = completedCount >= 3;

  useEffect(() => {
    if (completedCount >= 3 && prevCompletedCount < 3) {
      setShowAllDone(true);
    }
    setPrevCompletedCount(completedCount);
  }, [completedCount, prevCompletedCount]);

  const handleComplete = (id: string) => {
    if (todayCompleted.includes(id)) return;
    setJustCompleted(id);
    completeChallenge(id);
    showToast('+10 XP!');
    setTimeout(() => setJustCompleted(null), 600);
  };

  const todayDate = new Date().toLocaleDateString('he-IL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <motion.div
      key="challenges"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 pt-6 pb-8 max-w-lg mx-auto"
    >
      {/* Confetti when all done */}
      <AnimatePresence>
        {showAllDone && <ChallengeConfetti />}
      </AnimatePresence>

      {/* Header */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-3xl mb-2"
        >
          🎯
        </motion.div>
        <h1 className="text-2xl font-bold text-text mb-1">אתגר יומי</h1>
        <p className="text-xs text-text-light">{todayDate}</p>
      </div>

      {/* Progress indicator */}
      <div className="bg-card rounded-2xl p-4 shadow-sm mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text">התקדמות היום</span>
          <span className="text-sm font-bold text-sage">{completedCount}/3</span>
        </div>
        <div className="h-2.5 bg-cream-dark rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-sage rounded-full"
            initial={false}
            animate={{ width: `${(completedCount / 3) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-amber-500" />
            <span className="text-[11px] text-text-light">{xpEarned} XP</span>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1">
              <Flame size={12} className="text-coral" />
              <span className="text-[11px] text-text-light">{streak} ימים רצופים</span>
            </div>
          )}
        </div>
      </div>

      {/* All done celebration */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-sage/15 border border-sage/30 rounded-2xl p-5 mb-5 text-center"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="text-4xl mb-2"
            >
              🏆
            </motion.div>
            <h2 className="text-lg font-bold text-sage mb-1">אלוף! השלמת את כל האתגרים!</h2>
            <p className="text-xs text-text-light">+20 XP בונוס על השלמת את כל שלושת האתגרים</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Challenge cards */}
      <div className="space-y-3 mb-6">
        {todayChallenges.map((challenge, index) => {
          const isCompleted = todayCompleted.includes(challenge.id);
          const isJust = justCompleted === challenge.id;
          const meta = categoryMeta[challenge.category];

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-card rounded-2xl shadow-sm overflow-hidden transition-colors duration-300 ${
                isCompleted ? 'bg-sage/5 border border-sage/20' : 'border border-transparent'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Emoji */}
                  <motion.div
                    animate={isJust ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                      isCompleted ? 'bg-sage/15' : 'bg-cream-dark'
                    }`}
                  >
                    {challenge.emoji}
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${meta.color}`}>
                        {meta.emoji} {meta.label}
                      </span>
                      <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full font-medium">
                        +{challenge.xpReward} XP
                      </span>
                    </div>
                    <h3 className={`text-sm font-semibold mb-0.5 ${
                      isCompleted ? 'line-through text-text-light' : 'text-text'
                    }`}>
                      {challenge.title}
                    </h3>
                    <p className="text-[11px] text-text-light leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>

                  {/* Complete button */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleComplete(challenge.id)}
                    disabled={isCompleted}
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isCompleted
                        ? 'bg-sage text-white shadow-md'
                        : 'bg-cream-dark text-text-light hover:bg-sage/20 hover:text-sage'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {isCompleted ? (
                        <motion.div
                          key="done"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <Check size={18} strokeWidth={3} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="todo"
                          className="w-4 h-4 rounded-full border-2 border-current"
                        />
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>

              {/* Completed green bar */}
              <AnimatePresence>
                {isCompleted && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="h-0.5 bg-sage origin-right"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Streak */}
      {streak > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-coral/10 border border-coral/20 rounded-xl p-3 mb-4 flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-full bg-coral/15 flex items-center justify-center">
            <Flame size={18} className="text-coral" />
          </div>
          <div>
            <p className="text-sm font-bold text-coral">{streak} ימים רצופים של אתגרים</p>
            <p className="text-[10px] text-text-light">המשך כך! כל יום מביא אותך קדימה</p>
          </div>
        </motion.div>
      )}

      {/* Countdown */}
      <div className="text-center">
        <CountdownTimer />
      </div>
    </motion.div>
  );
}
