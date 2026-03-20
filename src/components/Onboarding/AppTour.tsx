import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  ListChecks,
  AlertCircle,
  CalendarCheck,
  BookOpen,
  ChevronLeft,
  Sparkles,
  Target,
  TreePine,
} from 'lucide-react';

interface AppTourProps {
  userName: string;
  onComplete: () => void;
}

interface TourStep {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  accentColor: string;
  illustration: string;
  tip?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    icon: <Sparkles size={28} />,
    title: 'ברוכים הבאים ל-Wini!',
    description: 'האפליקציה שלך לבניית הרגלים חיוביים ושבירת הרגלים שליליים. בוא נעשה סיור קצר.',
    gradient: 'from-[#5b8a72] to-[#7ba894]',
    accentColor: '#5b8a72',
    illustration: '🌱',
  },
  {
    id: 'garden',
    icon: <Home size={28} />,
    title: 'הגן שלי',
    description: 'המסך הראשי שלך. כאן תראה את העץ הגדל שלך, מצב הרוח, סטטיסטיקות יומיות וציטוט מעורר השראה.',
    gradient: 'from-[#5b8a72] to-[#4a7260]',
    accentColor: '#5b8a72',
    illustration: '🌳',
    tip: 'העץ גדל ככל שאתה מתקדם במסע שלך!',
  },
  {
    id: 'habits',
    icon: <ListChecks size={28} />,
    title: 'ההרגלים שלי',
    description: 'כאן תנהל את כל ההרגלים שלך. תעקוב אחרי הסטריק, תסמן ביצוע ותראה תחליפים להרגלים שליליים.',
    gradient: 'from-[#4a7260] to-[#5b8a72]',
    accentColor: '#4a7260',
    illustration: '✅',
    tip: 'לחץ על הכרטיס של הרגל כדי לראות פרטים נוספים',
  },
  {
    id: 'sos',
    icon: <AlertCircle size={28} />,
    title: 'כפתור SOS',
    description: 'הכפתור הכי חשוב! כשמרגיש דחף או קושי - לחץ כאן. נעזור לך לצלוח את הרגע הקשה.',
    gradient: 'from-[#c97b63] to-[#d99a86]',
    accentColor: '#c97b63',
    illustration: '🆘',
    tip: 'עובד גם להרגלים שליליים (דחף) וגם לחיוביים (חסם)',
  },
  {
    id: 'routines',
    icon: <CalendarCheck size={28} />,
    title: 'שגרות',
    description: 'בנה שגרות בוקר וערב מותאמות אישית. שגרה יציבה היא הבסיס לכל שינוי.',
    gradient: 'from-[#8fbc8f] to-[#5b8a72]',
    accentColor: '#8fbc8f',
    illustration: '☀️',
    tip: 'התחל עם שגרת בוקר פשוטה של 3 פעולות',
  },
  {
    id: 'journal',
    icon: <BookOpen size={28} />,
    title: 'יומן',
    description: 'תעד את הרגעים הקשים והניצחונות. היומן עוזר לזהות דפוסים ולהבין מה עובד עבורך.',
    gradient: 'from-[#d4a574] to-[#c97b63]',
    accentColor: '#d4a574',
    illustration: '📔',
    tip: 'כתיבה אחרי רגע קשה עוזרת לעבד רגשות',
  },
  {
    id: 'nutrition',
    icon: <Sparkles size={28} />,
    title: 'תזונה ומים',
    description: 'עקוב אחרי הארוחות ושתיית המים שלך. סמן מה אכלת, כמה שתית, ותראה את ההתקדמות.',
    gradient: 'from-[#d4a574] to-[#e0c09e]',
    accentColor: '#d4a574',
    illustration: '🍽️',
    tip: 'לא צריך לספור קלוריות - פשוט לסמן שאכלת',
  },
  {
    id: 'ready',
    icon: <Target size={28} />,
    title: 'מוכנים לצאת לדרך!',
    description: 'כל מסע מתחיל בצעד אחד קטן. אנחנו כאן איתך בכל שלב. בהצלחה!',
    gradient: 'from-[#5b8a72] via-[#4a7260] to-[#3d5c4e]',
    accentColor: '#5b8a72',
    illustration: '🚀',
  },
];

export default function AppTour({ userName, onComplete }: AppTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const step = TOUR_STEPS[currentStep];
  const isLast = currentStep === TOUR_STEPS.length - 1;
  const isFirst = currentStep === 0;

  // Replace welcome title with personalized one
  const title = isFirst ? `${userName}, ברוכים הבאים!` : step.title;

  const goNext = () => {
    if (isLast) {
      onComplete();
      return;
    }
    setDirection(1);
    setCurrentStep((s) => s + 1);
  };

  const goBack = () => {
    if (isFirst) return;
    setDirection(-1);
    setCurrentStep((s) => s - 1);
  };

  const skip = () => {
    onComplete();
  };

  // Swipe handling
  const [touchStart, setTouchStart] = useState(0);
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => setTouchStart(e.touches[0].clientX);
    const handleTouchEnd = (e: TouchEvent) => {
      const diff = touchStart - e.changedTouches[0].clientX;
      // RTL: swipe left = next, swipe right = back
      if (Math.abs(diff) > 50) {
        if (diff < 0) goNext();
        else goBack();
      }
    };
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  });

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex flex-col overflow-hidden"
      dir="rtl"
    >
      {/* Animated gradient background */}
      <motion.div
        key={step.id + '-bg'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`absolute inset-0 bg-gradient-to-b ${step.gradient}`}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/10"
            initial={{
              x: Math.random() * 400,
              y: Math.random() * 800,
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Skip button */}
      {!isLast && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={skip}
          className="absolute top-12 left-5 z-10 text-white/70 text-sm font-medium backdrop-blur-sm bg-white/10 px-3 py-1.5 rounded-full"
        >
          דלג
        </motion.button>
      )}

      {/* Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex flex-col items-center text-center max-w-sm w-full"
          >
            {/* Illustration circle */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              className="relative mb-6"
            >
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-white/10 blur-xl scale-150" />

              {/* Glassmorphism circle */}
              <div className="relative w-28 h-28 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
                <span className="text-5xl">{step.illustration}</span>
              </div>

              {/* Small floating icon */}
              <motion.div
                animate={{ y: [-3, 3, -3] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-1 -right-1 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white"
              >
                {step.icon}
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-white mb-3 leading-tight"
            >
              {title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/85 text-base leading-relaxed mb-4 max-w-xs"
            >
              {step.description}
            </motion.p>

            {/* Tip card */}
            {step.tip && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.45 }}
                className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 max-w-xs w-full"
              >
                <div className="flex items-start gap-2">
                  <Sparkles size={14} className="text-yellow-200 mt-0.5 flex-shrink-0" />
                  <p className="text-white/90 text-xs leading-relaxed">{step.tip}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="relative px-6 pb-12 safe-area-bottom">
        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {TOUR_STEPS.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === currentStep ? 24 : 8,
                opacity: i === currentStep ? 1 : 0.4,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="h-2 rounded-full bg-white"
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3 max-w-sm mx-auto">
          {!isFirst && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileTap={{ scale: 0.95 }}
              onClick={goBack}
              className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white"
            >
              <ChevronLeft size={20} className="rotate-180" />
            </motion.button>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={goNext}
            className="flex-1 h-12 rounded-full bg-white text-base font-bold flex items-center justify-center gap-2 shadow-lg"
            style={{ color: step.accentColor }}
          >
            {isLast ? (
              <>
                <TreePine size={18} />
                <span>בואו נתחיל!</span>
              </>
            ) : (
              <>
                <span>המשך</span>
                <ChevronLeft size={18} />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
