import { motion } from 'framer-motion';
import { journeyStages } from '../../data/reflections';

interface JourneyMapProps {
  currentStage: number;
  onSetStage: (stage: number) => void;
  reflectionCount: number;
  needsCount: number;
}

export default function JourneyMap({
  currentStage,
  onSetStage,
  reflectionCount,
  needsCount,
}: JourneyMapProps) {
  return (
    <div className="space-y-4">
      <div className="bg-card rounded-2xl p-5 shadow-sm">
        <div className="text-center mb-5">
          <h3 className="text-sm font-semibold text-text mb-1">המסע הפנימי שלך</h3>
          <p className="text-xs text-text-light">
            איפה אתה מרגיש שאתה נמצא? אין מסלול קבוע - כל אחד מתקדם בקצב שלו.
          </p>
        </div>

        {/* Moon phases journey */}
        <div className="flex justify-center gap-2 mb-6">
          {journeyStages.map((s) => (
            <motion.button
              key={s.stage}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSetStage(s.stage)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                currentStage === s.stage
                  ? 'bg-sage/15 scale-110'
                  : currentStage > s.stage
                    ? 'opacity-70'
                    : 'opacity-30'
              }`}
            >
              <span className="text-2xl">{s.emoji}</span>
              <span className={`text-[9px] ${
                currentStage === s.stage ? 'text-sage font-bold' : 'text-text-light'
              }`}>
                {s.name}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Current stage details */}
        <motion.div
          key={currentStage}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-sage/5 rounded-xl p-4 text-center"
        >
          <p className="text-3xl mb-2">{journeyStages[currentStage].emoji}</p>
          <h4 className="text-base font-semibold text-sage mb-1">
            {journeyStages[currentStage].name}
          </h4>
          <p className="text-sm text-text leading-relaxed">
            {journeyStages[currentStage].description}
          </p>
        </motion.div>

        {/* Progress indicators */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-cream/30 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-text">{reflectionCount}</p>
            <p className="text-[10px] text-text-light">שיקופים שכתבת</p>
          </div>
          <div className="bg-cream/30 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-text">{needsCount}</p>
            <p className="text-[10px] text-text-light">צרכים שזיהית</p>
          </div>
        </div>
      </div>

      {/* Encouragement */}
      <div className="bg-card rounded-2xl p-4 shadow-sm text-center">
        <p className="text-xs text-text-light leading-relaxed">
          {currentStage === 0 && 'עצם זה שאתה כאן אומר שאתה אמיץ. ההכרה היא הצעד הראשון.'}
          {currentStage === 1 && 'להבין את ה"למה" זה מפתח לשינוי אמיתי. המשך לחפור.'}
          {currentStage === 2 && 'קבלה עצמית היא לא חולשה - היא הכוח הכי גדול שיש.'}
          {currentStage === 3 && 'אתה בונה חיים חדשים. כל יום הוא לבנה חדשה.'}
          {currentStage === 4 && 'חירות אמיתית. אתה הוכחת שאפשר. עכשיו עזור לאחרים.'}
        </p>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-text-light italic">
          "אתה לא צריך לראות את כל המדרגות. רק תעלה את הראשונה."
        </p>
      </div>
    </div>
  );
}
