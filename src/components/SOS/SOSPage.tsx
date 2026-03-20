import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Timer, Heart, Zap, Plus, Check, Shield } from 'lucide-react';
import type { Habit, DopamineLog } from '../../types';
import { alternativeActivities } from '../../data/activities';
import BreathingExercise from './BreathingExercise';
import CravingTimer from './CravingTimer';
import ReinforcementGallery from '../Reinforcement/ReinforcementGallery';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

type SOSTab = 'breathe' | 'timer' | 'reasons' | 'dopamine' | 'reinforcement';

interface SOSPageProps {
  habits: Habit[];
  todayDopamineLogs: DopamineLog[];
  todayDopamineCount: number;
  dopamineGoalProgress: number;
  dopamineStreak: number;
  dailyGoal: number;
  onLogDopamine: (title: string, icon: string, custom?: boolean) => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export default function SOSPage({
  habits,
  todayDopamineLogs,
  todayDopamineCount,
  dopamineGoalProgress,
  dopamineStreak,
  dailyGoal,
  onLogDopamine,
  showToast,
}: SOSPageProps) {
  const [activeTab, setActiveTab] = useState<SOSTab>('dopamine');
  const [showCustom, setShowCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [justLogged, setJustLogged] = useState<string | null>(null);

  const allReasons = habits
    .filter((h) => h.type === 'quit' && h.isActive)
    .flatMap((h) => h.reasons.map((r) => ({ reason: r, habitName: h.name })));

  const tabs: { id: SOSTab; label: string; Icon: typeof Wind }[] = [
    { id: 'dopamine', label: 'דופמין בריא', Icon: Zap },
    { id: 'reinforcement', label: 'חיזוקים', Icon: Shield },
    { id: 'breathe', label: 'נשימה', Icon: Wind },
    { id: 'timer', label: 'טיימר', Icon: Timer },
    { id: 'reasons', label: 'סיבות', Icon: Heart },
  ];

  const handleLog = (title: string, icon: string) => {
    onLogDopamine(title, icon);
    setJustLogged(title);
    showToast(`${icon} ${title} - נרשם!`);
    setTimeout(() => setJustLogged(null), 1500);
  };

  const handleCustomLog = () => {
    if (!customTitle.trim()) return;
    onLogDopamine(customTitle.trim(), '✨', true);
    showToast(`✨ ${customTitle.trim()} - נרשם!`);
    setCustomTitle('');
    setShowCustom(false);
  };

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
                ? id === 'dopamine'
                  ? 'bg-sage/10 text-sage font-medium'
                  : 'bg-coral/10 text-coral font-medium'
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
        {activeTab === 'reinforcement' && <ReinforcementGallery />}

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

        {activeTab === 'dopamine' && (
          <div>
            {/* Daily progress */}
            <div className="text-center mb-4">
              <h2 className="text-sm font-semibold text-text mb-2">
                אסוף דופמין בריא היום
              </h2>
              <div className="flex items-center justify-center gap-4 mb-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-sage">{todayDopamineCount}</p>
                  <p className="text-[9px] text-text-light">מתוך {dailyGoal}</p>
                </div>
                {dopamineStreak > 1 && (
                  <div className="flex items-center gap-1 bg-sand/15 px-2.5 py-1 rounded-full">
                    <span className="text-xs">🔥</span>
                    <span className="text-xs font-bold text-sand">{dopamineStreak}</span>
                    <span className="text-[9px] text-text-light">ימים</span>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="h-3 bg-cream-dark rounded-full overflow-hidden mb-1">
                <motion.div
                  className="h-full bg-gradient-to-l from-sage to-sea rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${dopamineGoalProgress * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-[10px] text-text-light">
                {dopamineGoalProgress >= 1
                  ? '🎉 הגעת ליעד היומי! אפשר להמשיך'
                  : `עוד ${dailyGoal - todayDopamineCount} פעילויות ליעד`}
              </p>
            </div>

            {/* Activity buttons */}
            <div className="space-y-2 mb-4">
              {alternativeActivities.map((activity, i) => {
                const alreadyLogged = todayDopamineLogs.some(
                  (l) => l.activityTitle === activity.title
                );
                const isJustLogged = justLogged === activity.title;

                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleLog(activity.title, activity.icon)}
                    className={`w-full flex items-center gap-3 rounded-xl p-3 transition-all text-right ${
                      isJustLogged
                        ? 'bg-sage/20 border border-sage/30'
                        : alreadyLogged
                          ? 'bg-sage/5 border border-sage/10'
                          : 'bg-cream/50 hover:bg-cream border border-transparent'
                    }`}
                  >
                    <span className="text-xl">{activity.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-medium text-text">{activity.title}</h3>
                        {alreadyLogged && !isJustLogged && (
                          <Check size={12} className="text-sage" />
                        )}
                      </div>
                      <p className="text-[10px] text-text-light">{activity.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      {isJustLogged ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-7 h-7 rounded-full bg-sage flex items-center justify-center"
                        >
                          <Check size={14} className="text-white" />
                        </motion.div>
                      ) : (
                        <span className="text-[9px] text-sand bg-sand/10 px-2 py-0.5 rounded-full">
                          {activity.duration}
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Custom activity */}
            {showCustom ? (
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCustomLog()}
                  placeholder="פעילות בריאה משלך..."
                  className="flex-1 bg-cream/50 border border-cream-dark rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-sage"
                  autoFocus
                />
                <button
                  onClick={handleCustomLog}
                  className="bg-sage text-white px-3 rounded-xl hover:bg-sage-dark transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCustom(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-sage/30 text-sage text-xs hover:bg-sage/5 transition-colors mb-4"
              >
                <Plus size={14} />
                הוסף פעילות משלך
              </button>
            )}

            {/* Today's log */}
            {todayDopamineLogs.length > 0 && (
              <div className="border-t border-cream-dark pt-3">
                <h3 className="text-xs text-text-light font-semibold mb-2">
                  מה עשית היום ({todayDopamineLogs.length})
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {todayDopamineLogs.map((log) => (
                    <span
                      key={log.id}
                      className="flex items-center gap-1 bg-sage/10 text-sage text-[10px] px-2 py-1 rounded-full"
                    >
                      <span>{log.activityIcon}</span>
                      <span>{log.activityTitle}</span>
                      <span className="text-sage/50">
                        {format(new Date(log.date), 'HH:mm')}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}
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
