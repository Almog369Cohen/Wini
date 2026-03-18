import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { Habit, HabitType, HabitCategory } from '../../types';
import HabitCard from './HabitCard';
import AddHabit from './AddHabit';
import ConfirmDialog from '../ui/ConfirmDialog';

interface HabitListProps {
  habits: Habit[];
  addHabit: (data: {
    name: string;
    type: HabitType;
    category: HabitCategory;
    dailyCost?: number;
    triggers?: string[];
    reasons?: string[];
  }) => Habit;
  checkIn: (id: string) => void;
  relapse: (id: string, note?: string, trigger?: string) => void;
  deleteHabit: (id: string) => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export default function HabitList({
  habits,
  addHabit,
  checkIn,
  relapse,
  deleteHabit,
  showToast,
}: HabitListProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Habit | null>(null);

  const quitHabits = habits.filter((h) => h.type === 'quit' && h.isActive);
  const buildHabits = habits.filter((h) => h.type === 'build' && h.isActive);

  const handleDelete = (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (habit) setDeleteTarget(habit);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteHabit(deleteTarget.id);
      showToast(`"${deleteTarget.name}" נמחק`);
      setDeleteTarget(null);
    }
  };

  return (
    <motion.div
      key="habits"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 pt-6 max-w-lg mx-auto"
    >
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-text">ההרגלים שלי</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-sage text-white w-9 h-9 rounded-full flex items-center justify-center shadow-sm hover:bg-sage-dark transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🌱</div>
          <p className="text-text-light text-sm">
            עוד אין הרגלים. לחץ על + כדי להוסיף את הראשון!
          </p>
        </div>
      ) : (
        <>
          {quitHabits.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-semibold text-coral uppercase tracking-wider mb-3">
                גמילה ({quitHabits.length})
              </h2>
              <div className="space-y-3">
                {quitHabits.map((h) => (
                  <HabitCard
                    key={h.id}
                    habit={h}
                    onCheckIn={checkIn}
                    onRelapse={relapse}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {buildHabits.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-semibold text-sage uppercase tracking-wider mb-3">
                בנייה ({buildHabits.length})
              </h2>
              <div className="space-y-3">
                {buildHabits.map((h) => (
                  <HabitCard
                    key={h.id}
                    habit={h}
                    onCheckIn={checkIn}
                    onRelapse={relapse}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {showAdd && <AddHabit onAdd={addHabit} onClose={() => setShowAdd(false)} />}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="מחיקת הרגל"
        message={`בטוח שאתה רוצה למחוק את "${deleteTarget?.name}"? כל ההיסטוריה תימחק.`}
        confirmText="מחק"
        cancelText="ביטול"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </motion.div>
  );
}
