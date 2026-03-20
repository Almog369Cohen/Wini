import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellOff,
  Clock,
  Plus,
  Trash2,
  Droplets,
  UtensilsCrossed,
  Target,
  Sparkles,
} from 'lucide-react';
import type { useNotifications } from '../../hooks/useNotifications';

type NotificationsState = ReturnType<typeof useNotifications>;

interface RemindersPageProps extends NotificationsState {
  showToast: (text: string) => void;
}

const CATEGORY_CONFIG = {
  meal: { label: 'ארוחות', emoji: '🍽️', color: 'text-orange-500', bg: 'bg-orange-50', Icon: UtensilsCrossed },
  water: { label: 'שתייה', emoji: '💧', color: 'text-blue-500', bg: 'bg-blue-50', Icon: Droplets },
  habit: { label: 'הרגלים', emoji: '🎯', color: 'text-sage', bg: 'bg-sage/10', Icon: Target },
  custom: { label: 'מותאם', emoji: '✨', color: 'text-sand', bg: 'bg-sand/10', Icon: Sparkles },
};

export default function RemindersPage({
  permission,
  enabled,
  reminders,
  isSupported,
  requestPermission,
  toggleEnabled,
  toggleReminder,
  updateReminderTime,
  addCustomReminder,
  removeReminder,
  showToast,
}: RemindersPageProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('12:00');

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      showToast('🔔 התראות הופעלו!');
    } else {
      showToast('ההתראות נחסמו. אפשר להפעיל בהגדרות הדפדפן');
    }
  };

  const handleAddCustom = () => {
    if (!newTitle.trim()) return;
    addCustomReminder(`✨ ${newTitle}`, newTitle, newTime);
    setNewTitle('');
    setNewTime('12:00');
    setShowAddForm(false);
    showToast('תזכורת נוספה!');
  };

  const mealReminders = reminders.filter(r => r.category === 'meal');
  const waterReminders = reminders.filter(r => r.category === 'water');
  const customReminders = reminders.filter(r => r.category === 'custom' || r.category === 'habit');

  return (
    <motion.div
      key="reminders"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 pt-4 pb-24 max-w-lg mx-auto"
      dir="rtl"
    >
      <h1 className="text-2xl font-bold text-text mb-5">תזכורות</h1>

      {/* Enable notifications card */}
      {!isSupported ? (
        <div className="bg-coral/10 border border-coral/20 rounded-2xl p-4 mb-4">
          <p className="text-sm text-coral text-center">הדפדפן שלך לא תומך בהתראות</p>
        </div>
      ) : permission !== 'granted' ? (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleEnableNotifications}
          className="w-full bg-sage text-white rounded-2xl p-4 mb-4 flex items-center gap-3 shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bell size={20} />
          </div>
          <div className="text-right flex-1">
            <p className="font-semibold text-sm">הפעל התראות</p>
            <p className="text-xs text-white/80">כדי לקבל תזכורות לארוחות, שתייה ועוד</p>
          </div>
        </motion.button>
      ) : (
        <div className="bg-card rounded-2xl shadow-sm p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {enabled ? (
              <Bell size={18} className="text-sage" />
            ) : (
              <BellOff size={18} className="text-text-light" />
            )}
            <span className="text-sm font-medium text-text">
              {enabled ? 'התראות פעילות' : 'התראות מושהות'}
            </span>
          </div>
          <button
            onClick={() => toggleEnabled(!enabled)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              enabled ? 'bg-sage' : 'bg-cream-dark'
            }`}
          >
            <motion.div
              animate={{ x: enabled ? -20 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
            />
          </button>
        </div>
      )}

      {/* Meal reminders */}
      <ReminderSection
        title="ארוחות"
        emoji="🍽️"
        reminders={mealReminders}
        onToggle={toggleReminder}
        onTimeChange={updateReminderTime}
      />

      {/* Water reminders */}
      <ReminderSection
        title="שתייה"
        emoji="💧"
        reminders={waterReminders}
        onToggle={toggleReminder}
        onTimeChange={updateReminderTime}
      />

      {/* Custom reminders */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-base">✨</span>
            <h2 className="text-sm font-semibold text-text">תזכורות מותאמות</h2>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAddForm(true)}
            className="w-7 h-7 rounded-full bg-sage/10 flex items-center justify-center text-sage"
          >
            <Plus size={16} />
          </motion.button>
        </div>

        <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
          {customReminders.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-xs text-text-light">אין תזכורות מותאמות</p>
              <p className="text-[10px] text-text-light/60 mt-1">לחץ + כדי להוסיף</p>
            </div>
          ) : (
            <div className="divide-y divide-cream-dark/50">
              {customReminders.map((r) => (
                <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                  <button
                    onClick={() => toggleReminder(r.id, !r.enabled)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      r.enabled ? 'bg-sage border-sage' : 'border-cream-dark'
                    }`}
                  >
                    {r.enabled && <div className="w-2 h-2 rounded-full bg-white" />}
                  </button>
                  <div className="flex-1">
                    <p className="text-sm text-text">{r.title.replace(/^[✨🎯] /, '')}</p>
                  </div>
                  <input
                    type="time"
                    value={r.time}
                    onChange={(e) => updateReminderTime(r.id, e.target.value)}
                    className="text-xs bg-cream rounded-lg px-2 py-1 text-text-light w-20"
                  />
                  <button
                    onClick={() => removeReminder(r.id)}
                    className="text-coral/50 hover:text-coral"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add custom reminder modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/30"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-card rounded-t-3xl p-6 pb-10 safe-area-bottom"
              dir="rtl"
            >
              <div className="w-10 h-1 bg-cream-dark rounded-full mx-auto mb-4" />
              <h3 className="text-lg font-bold text-text text-center mb-4">תזכורת חדשה</h3>

              <div className="space-y-3">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="למה להזכיר? (למשל: לקחת ויטמינים)"
                  className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-light/50 outline-none focus:border-sage"
                  dir="rtl"
                />

                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-text-light" />
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="flex-1 bg-cream border border-cream-dark rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-sage"
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddCustom}
                  disabled={!newTitle.trim()}
                  className="w-full py-3 rounded-xl bg-sage text-white font-semibold text-sm disabled:opacity-40"
                >
                  הוסף תזכורת
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Reusable section component
function ReminderSection({
  title,
  emoji,
  reminders,
  onToggle,
  onTimeChange,
}: {
  title: string;
  emoji: string;
  reminders: { id: string; title: string; time: string; enabled: boolean }[];
  onToggle: (id: string, enabled: boolean) => void;
  onTimeChange: (id: string, time: string) => void;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{emoji}</span>
        <h2 className="text-sm font-semibold text-text">{title}</h2>
      </div>

      <div className="bg-card rounded-2xl shadow-sm overflow-hidden divide-y divide-cream-dark/50">
        {reminders.map((r) => (
          <div key={r.id} className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => onToggle(r.id, !r.enabled)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                r.enabled ? 'bg-sage border-sage' : 'border-cream-dark'
              }`}
            >
              {r.enabled && <div className="w-2 h-2 rounded-full bg-white" />}
            </button>
            <p className={`flex-1 text-sm ${r.enabled ? 'text-text' : 'text-text-light'}`}>
              {r.title}
            </p>
            <input
              type="time"
              value={r.time}
              onChange={(e) => onTimeChange(r.id, e.target.value)}
              className="text-xs bg-cream rounded-lg px-2 py-1 text-text-light w-20"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
