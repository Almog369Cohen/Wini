import { motion } from 'framer-motion';
import { RefreshCw, ChevronLeft } from 'lucide-react';
import type { MoodType, MoodEntry } from '../../types';

interface MoodWidgetProps {
  currentMood: MoodType;
  currentMoods: MoodType[];
  currentEnergy: number;
  todayEntries: MoodEntry[];
  moodEmojis: Record<MoodType, string>;
  moodLabels: Record<MoodType, string>;
  onChangeMood: () => void;
  onViewPlan: () => void;
}

export default function MoodWidget({
  currentMood,
  currentMoods,
  currentEnergy,
  todayEntries,
  moodEmojis,
  moodLabels,
  onChangeMood,
  onViewPlan,
}: MoodWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-4 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-text">איך אני מרגיש</h3>
        <button
          onClick={onChangeMood}
          className="flex items-center gap-1 text-xs text-sage"
        >
          <RefreshCw size={12} />
          עדכון
        </button>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="text-2xl flex gap-1">
          {currentMoods.map(m => (
            <span key={m}>{moodEmojis[m]}</span>
          ))}
        </div>
        <div>
          <p className="font-medium text-text">
            {currentMoods.map(m => moodLabels[m]).join(', ')}
          </p>
          <div className="flex gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className={`w-5 h-1.5 rounded-full ${
                  i <= currentEnergy ? 'bg-sage' : 'bg-cream-dark'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Today's mood timeline */}
      {todayEntries.length > 1 && (
        <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
          {todayEntries.map((entry, i) => (
            <div
              key={entry.id}
              className="flex flex-col items-center gap-0.5 flex-shrink-0"
              title={`${new Date(entry.timestamp).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}`}
            >
              <span className="text-xs">{moodEmojis[entry.mood]}</span>
              <span className="text-[9px] text-text-light">
                {new Date(entry.timestamp).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onViewPlan}
        className="w-full bg-sage/10 text-sage font-medium py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 active:bg-sage/20 transition-colors"
      >
        התוכנית שלי להיום
        <ChevronLeft size={16} />
      </button>
    </motion.div>
  );
}
