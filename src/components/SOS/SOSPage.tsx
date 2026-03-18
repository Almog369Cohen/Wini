import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Timer, Heart, Lightbulb } from 'lucide-react';
import type { Habit } from '../../types';
import { alternativeActivities } from '../../data/activities';
import BreathingExercise from './BreathingExercise';
import CravingTimer from './CravingTimer';

type SOSTab = 'breathe' | 'timer' | 'reasons' | 'activities';

interface SOSPageProps {
  habits: Habit[];
}

export default function SOSPage({ habits }: SOSPageProps) {
  const [activeTab, setActiveTab] = useState<SOSTab>('breathe');

  const allReasons = habits
    .filter((h) => h.type === 'quit' && h.isActive)
    .flatMap((h) => h.reasons.map((r) => ({ reason: r, habitName: h.name })));

  const tabs: { id: SOSTab; label: string; Icon: typeof Wind }[] = [
    { id: 'breathe', label: 'נשימה', Icon: Wind },
    { id: 'timer', label: 'טיימר', Icon: Timer },
    { id: 'reasons', label: 'סיבות', Icon: Heart },
    { id: 'activities', label: 'חלופות', Icon: Lightbulb },
  ];

  return (
    <motion.div
      key="sos"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 pt-6 max-w-lg mx-auto"
    >
      <div className="text-center mb-5">
        <h1 className="text-2xl font-bold text-coral">רגע של משבר</h1>
        <p className="text-sm text-text-light mt-1">הכל בסדר. זה זמני. בוא נעבור את זה ביחד.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-card rounded-xl p-1 shadow-sm mb-5">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-[11px] transition-all ${
              activeTab === id
                ? 'bg-coral/10 text-coral font-medium'
                : 'text-text-light'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-card rounded-2xl p-5 shadow-sm min-h-[300px]">
        {activeTab === 'breathe' && <BreathingExercise />}

        {activeTab === 'timer' && <CravingTimer />}

        {activeTab === 'reasons' && (
          <div>
            <h2 className="text-sm font-semibold text-text mb-3 text-center">
              למה אתה עושה את זה
            </h2>
            {allReasons.length > 0 ? (
              <div className="space-y-2.5">
                {allReasons.map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2 bg-sage/5 rounded-xl p-3"
                  >
                    <Heart size={14} className="text-coral mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-text">{r.reason}</p>
                      <p className="text-[10px] text-text-light">{r.habitName}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-text-light text-sm">
                  עוד לא הוספת סיבות. הוסף סיבות בהרגלים שלך כדי שיופיעו כאן ברגעי משבר.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'activities' && (
          <div>
            <h2 className="text-sm font-semibold text-text mb-3 text-center">
              דופמין בריא במקום
            </h2>
            <div className="space-y-2">
              {alternativeActivities.map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 bg-cream/50 rounded-xl p-3 hover:bg-cream transition-colors"
                >
                  <span className="text-xl">{activity.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-text">
                        {activity.title}
                      </h3>
                      <span className="text-[10px] text-sand bg-sand/10 px-2 py-0.5 rounded-full">
                        {activity.duration}
                      </span>
                    </div>
                    <p className="text-xs text-text-light mt-0.5">
                      {activity.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Encouraging message */}
      <div className="text-center mt-4 mb-6">
        <p className="text-xs text-sage italic">
          כל דקה שאתה מתמודד עם הדחף - אתה מתחזק. אתה עושה עבודה מדהימה.
        </p>
      </div>
    </motion.div>
  );
}
