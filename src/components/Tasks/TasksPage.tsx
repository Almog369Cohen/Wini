import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Check,
  Trash2,
  Repeat,
} from 'lucide-react';
import type { Task } from '../../hooks/useTasks';
import { TASK_CATEGORIES } from '../../hooks/useTasks';

interface TasksPageProps {
  tasks: Task[];
  completedCount: number;
  totalCount: number;
  addTask: (title: string, category: Task['category'], recurring: boolean) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  showToast: (text: string) => void;
}

export default function TasksPage({
  tasks,
  completedCount,
  totalCount,
  addTask,
  toggleTask,
  deleteTask,
  showToast,
}: TasksPageProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Task['category']>('general');
  const [newRecurring, setNewRecurring] = useState(false);

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addTask(newTitle.trim(), newCategory, newRecurring);
    setNewTitle('');
    setNewCategory('general');
    setNewRecurring(false);
    setShowAdd(false);
    showToast('משימה נוספה!');
  };

  return (
    <motion.div
      key="tasks"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 pt-4 pb-24 max-w-lg mx-auto"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-text">משימות</h1>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAdd(true)}
          className="w-9 h-9 rounded-full bg-sage flex items-center justify-center text-white shadow-sm"
        >
          <Plus size={20} />
        </motion.button>
      </div>

      {/* Progress */}
      {totalCount > 0 && (
        <div className="bg-card rounded-2xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-light">התקדמות היום</span>
            <span className="text-xs font-bold text-sage">{completedCount}/{totalCount}</span>
          </div>
          <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-sage rounded-full"
            />
          </div>
          {completedCount === totalCount && totalCount > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-sage text-center mt-2 font-medium"
            >
              🎉 סיימת את כל המשימות!
            </motion.p>
          )}
        </div>
      )}

      {/* Active tasks */}
      {activeTasks.length === 0 && completedTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-sm text-text-light">אין משימות עדיין</p>
          <p className="text-xs text-text-light/60 mt-1">לחץ + כדי להוסיף משימה ראשונה</p>
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-4">
            <AnimatePresence>
              {activeTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Completed tasks */}
          {completedTasks.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-text-light mb-2">
                הושלמו ({completedTasks.length})
              </p>
              <div className="space-y-2 opacity-60">
                <AnimatePresence>
                  {completedTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add task modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/30"
            onClick={() => setShowAdd(false)}
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
              <h3 className="text-lg font-bold text-text text-center mb-4">משימה חדשה</h3>

              <div className="space-y-3">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="מה צריך לעשות?"
                  className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-light/50 outline-none focus:border-sage"
                  dir="rtl"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />

                {/* Category select */}
                <div className="flex gap-2 flex-wrap">
                  {(Object.entries(TASK_CATEGORIES) as [Task['category'], { label: string; emoji: string }][]).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setNewCategory(key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        newCategory === key
                          ? 'bg-sage text-white'
                          : 'bg-cream text-text-light'
                      }`}
                    >
                      <span>{config.emoji}</span>
                      <span>{config.label}</span>
                    </button>
                  ))}
                </div>

                {/* Recurring toggle */}
                <button
                  onClick={() => setNewRecurring(!newRecurring)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors ${
                    newRecurring
                      ? 'bg-sage/10 text-sage border border-sage/20'
                      : 'bg-cream text-text-light border border-cream-dark'
                  }`}
                >
                  <Repeat size={14} />
                  <span>חוזרת כל יום</span>
                </button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAdd}
                  disabled={!newTitle.trim()}
                  className="w-full py-3 rounded-xl bg-sage text-white font-semibold text-sm disabled:opacity-40"
                >
                  הוסף משימה
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TaskItem({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const config = TASK_CATEGORIES[task.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="bg-card rounded-xl shadow-sm flex items-center gap-3 px-4 py-3"
    >
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={() => onToggle(task.id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
          task.completed
            ? 'bg-sage border-sage'
            : 'border-cream-dark hover:border-sage'
        }`}
      >
        {task.completed && <Check size={12} className="text-white" />}
      </motion.button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm ${task.completed ? 'line-through text-text-light' : 'text-text'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-text-light/60">{config.emoji} {config.label}</span>
          {task.recurring && (
            <span className="text-[10px] text-sage/60 flex items-center gap-0.5">
              <Repeat size={8} /> יומי
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="text-text-light/30 hover:text-coral transition-colors flex-shrink-0"
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  );
}
