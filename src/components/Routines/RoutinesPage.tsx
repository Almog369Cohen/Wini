import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Flame, Trash2, Edit3, ChevronLeft, X, Lightbulb, Sunrise, Moon, AlertTriangle, Zap, Sparkles, Heart, Brain, Dumbbell, Users, TrendingUp } from 'lucide-react';
import type { Routine, RoutineStep, RoutineType } from '../../types';
import type { useRoutines } from '../../hooks/useRoutines';

type RoutinesState = ReturnType<typeof useRoutines>;

interface RoutinesPageProps extends RoutinesState {
  showToast: (msg: string, type?: 'success' | 'error') => void;
  onNavigate: (page: 'sos') => void;
}

const TYPE_CONFIG: Record<RoutineType, { label: string; emoji: string; color: string; bg: string; border: string; Icon: typeof Sunrise }> = {
  morning: { label: 'בוקר', emoji: '🌅', color: '#059669', bg: '#d1fae5', border: '#6ee7b7', Icon: Sunrise },
  night: { label: 'לילה', emoji: '🌙', color: '#7c3aed', bg: '#ede9fe', border: '#c4b5fd', Icon: Moon },
  crisis: { label: 'חירום', emoji: '🆘', color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', Icon: AlertTriangle },
  motivation: { label: 'מוטיבציה', emoji: '🔥', color: '#ea580c', bg: '#ffedd5', border: '#fdba74', Icon: Zap },
  energy: { label: 'אנרגיה', emoji: '⚡', color: '#d97706', bg: '#fef3c7', border: '#fcd34d', Icon: Zap },
  calm: { label: 'הרגעה', emoji: '🌊', color: '#0284c7', bg: '#e0f2fe', border: '#7dd3fc', Icon: Heart },
  focus: { label: 'פוקוס', emoji: '🎯', color: '#4f46e5', bg: '#e0e7ff', border: '#a5b4fc', Icon: Brain },
  social: { label: 'חברתי', emoji: '🤝', color: '#db2777', bg: '#fce7f3', border: '#f9a8d4', Icon: Users },
  growth: { label: 'צמיחה', emoji: '🌱', color: '#16a34a', bg: '#dcfce7', border: '#86efac', Icon: TrendingUp },
  body: { label: 'גוף', emoji: '💪', color: '#9333ea', bg: '#f3e8ff', border: '#c084fc', Icon: Dumbbell },
  custom: { label: 'מותאם אישית', emoji: '✨', color: '#0891b2', bg: '#cffafe', border: '#67e8f9', Icon: Sparkles },
};

export default function RoutinesPage({
  routines,
  templates,
  addFromTemplate,
  addRoutine,
  updateRoutine,
  deleteRoutine,
  toggleStep,
  getTodayCompletion,
  getCompletionStreak,
  addReflection,
  reflections,
  showToast,
  onNavigate: _onNavigate,
}: RoutinesPageProps) {
  const [activeTab, setActiveTab] = useState<'my' | 'templates' | 'reflect'>('my');
  const [expandedRoutine, setExpandedRoutine] = useState<string | null>(null);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showReflectForm, setShowReflectForm] = useState(false);
  const [reflectWorks, setReflectWorks] = useState('');
  const [reflectChange, setReflectChange] = useState('');
  const [reflectIdea, setReflectIdea] = useState('');

  const [templateFilter, setTemplateFilter] = useState<RoutineType | 'all'>('all');

  // Custom routine form
  const [customName, setCustomName] = useState('');
  const [customType, setCustomType] = useState<RoutineType>('custom');
  const [customEmoji, setCustomEmoji] = useState('✨');
  const [customSteps, setCustomSteps] = useState<{ title: string; emoji: string; duration: string }[]>([
    { title: '', emoji: '✅', duration: '' },
  ]);

  const filteredTemplates = templateFilter === 'all'
    ? templates
    : templates.filter(t => t.type === templateFilter);

  const tabs = [
    { id: 'my' as const, label: 'השגרות שלי', emoji: '📋' },
    { id: 'templates' as const, label: 'תבניות', emoji: '💡' },
    { id: 'reflect' as const, label: 'חשיבה מחדש', emoji: '🔄' },
  ];

  const handleAddFromTemplate = (templateId: string) => {
    const r = addFromTemplate(templateId);
    if (r) {
      showToast(`"${r.name}" נוספה בהצלחה!`);
      setActiveTab('my');
    }
  };

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    const steps: RoutineStep[] = customSteps
      .filter(s => s.title.trim())
      .map(s => ({
        id: crypto.randomUUID(),
        title: s.title,
        emoji: s.emoji,
        duration: s.duration || undefined,
      }));
    if (steps.length === 0) return;
    const r = addRoutine(customName, customType, customEmoji, steps);
    showToast(`"${r.name}" נוצרה!`);
    setShowAddCustom(false);
    setCustomName('');
    setCustomSteps([{ title: '', emoji: '✅', duration: '' }]);
  };

  const handleSaveEdit = () => {
    if (!editingRoutine) return;
    updateRoutine(editingRoutine.id, {
      name: editingRoutine.name,
      emoji: editingRoutine.emoji,
      steps: editingRoutine.steps,
    });
    showToast('השגרה עודכנה');
    setEditingRoutine(null);
  };

  const handleDelete = (id: string) => {
    deleteRoutine(id);
    showToast('השגרה נמחקה');
    setConfirmDelete(null);
    setExpandedRoutine(null);
  };

  const handleReflect = () => {
    if (!reflectWorks.trim() && !reflectChange.trim()) return;
    addReflection(reflectWorks, reflectChange, reflectIdea || undefined);
    showToast('התובנה נשמרה 🙏');
    setShowReflectForm(false);
    setReflectWorks('');
    setReflectChange('');
    setReflectIdea('');
  };

  return (
    <motion.div
      key="routines"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 pt-6 pb-4 max-w-lg mx-auto"
      dir="rtl"
    >
      <h1 className="text-2xl font-bold text-text text-center mb-4">השגרות שלי</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 bg-cream-dark/50 p-1 rounded-xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-card shadow-sm text-text'
                : 'text-text-light'
            }`}
          >
            <span className="ml-1">{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* MY ROUTINES TAB */}
        {activeTab === 'my' && (
          <motion.div
            key="my"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {routines.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">📋</div>
                <h2 className="text-lg font-semibold text-text mb-2">עדיין אין שגרות</h2>
                <p className="text-sm text-text-light mb-5">
                  בחר תבנית מוכנה או צור שגרה משלך
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setActiveTab('templates')}
                    className="bg-sage text-white px-5 py-2.5 rounded-xl text-sm font-medium"
                  >
                    💡 בחר תבנית
                  </button>
                  <button
                    onClick={() => setShowAddCustom(true)}
                    className="bg-card border border-sage/30 text-sage px-5 py-2.5 rounded-xl text-sm font-medium"
                  >
                    ✏️ צור חדשה
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {routines.map(routine => {
                  const config = TYPE_CONFIG[routine.type];
                  const todayCompletion = getTodayCompletion(routine.id);
                  const completedCount = todayCompletion?.completedSteps.length ?? 0;
                  const totalSteps = routine.steps.length;
                  const progress = totalSteps > 0 ? completedCount / totalSteps : 0;
                  const isExpanded = expandedRoutine === routine.id;
                  const streak = getCompletionStreak(routine.id);

                  return (
                    <motion.div
                      key={routine.id}
                      layout
                      className="bg-card rounded-2xl shadow-sm overflow-hidden"
                    >
                      {/* Header */}
                      <button
                        onClick={() => setExpandedRoutine(isExpanded ? null : routine.id)}
                        className="w-full p-4 flex items-center gap-3 text-right"
                      >
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                          style={{ backgroundColor: config.bg, border: `2px solid ${config.border}` }}
                        >
                          {routine.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-semibold text-text text-sm truncate">{routine.name}</h3>
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                              style={{ backgroundColor: config.bg, color: config.color }}
                            >
                              {config.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-cream-dark rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: config.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress * 100}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                            <span className="text-[10px] text-text-light flex-shrink-0">
                              {completedCount}/{totalSteps}
                            </span>
                            {streak > 0 && (
                              <span className="flex items-center gap-0.5 text-[10px] text-text-light">
                                <Flame size={10} className="text-orange-500" />
                                {streak}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronLeft
                          size={18}
                          className={`text-text-light transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        />
                      </button>

                      {/* Expanded Steps */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 border-t border-cream-dark/50 pt-3">
                              <div className="space-y-2">
                                {routine.steps.map((step, i) => {
                                  const isCompleted = todayCompletion?.completedSteps.includes(step.id) ?? false;
                                  return (
                                    <motion.button
                                      key={step.id}
                                      initial={{ opacity: 0, x: 10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: i * 0.03 }}
                                      onClick={() => toggleStep(routine.id, step.id)}
                                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-right ${
                                        isCompleted
                                          ? 'bg-sage/10 border border-sage/20'
                                          : 'bg-cream/50 border border-transparent active:bg-cream-dark/50'
                                      }`}
                                    >
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                                          isCompleted
                                            ? 'bg-sage text-white'
                                            : 'border-2 border-cream-dark'
                                        }`}
                                      >
                                        {isCompleted && <Check size={14} />}
                                      </div>
                                      <span className="text-base flex-shrink-0">{step.emoji}</span>
                                      <span
                                        className={`text-sm flex-1 ${
                                          isCompleted ? 'text-text-light line-through' : 'text-text'
                                        }`}
                                      >
                                        {step.title}
                                      </span>
                                      {step.duration && (
                                        <span className="text-[10px] text-text-light flex-shrink-0">
                                          {step.duration}
                                        </span>
                                      )}
                                    </motion.button>
                                  );
                                })}
                              </div>

                              {/* Completion message */}
                              {progress === 1 && (
                                <motion.div
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="mt-3 text-center py-3 bg-sage/10 rounded-xl"
                                >
                                  <span className="text-2xl">🎉</span>
                                  <p className="text-sm font-semibold text-sage mt-1">סיימת את כל השלבים!</p>
                                </motion.div>
                              )}

                              {/* Actions */}
                              <div className="flex gap-2 mt-3">
                                <button
                                  onClick={() => setEditingRoutine({ ...routine })}
                                  className="flex items-center gap-1 text-xs text-text-light bg-cream-dark/50 px-3 py-1.5 rounded-lg"
                                >
                                  <Edit3 size={12} />
                                  עריכה
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(routine.id)}
                                  className="flex items-center gap-1 text-xs text-coral bg-coral/10 px-3 py-1.5 rounded-lg"
                                >
                                  <Trash2 size={12} />
                                  מחיקה
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}

                {/* Add button */}
                <button
                  onClick={() => setShowAddCustom(true)}
                  className="w-full border-2 border-dashed border-cream-dark rounded-2xl p-4 flex items-center justify-center gap-2 text-text-light hover:text-sage hover:border-sage/30 transition-colors"
                >
                  <Plus size={18} />
                  <span className="text-sm font-medium">הוסף שגרה חדשה</span>
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <motion.div
            key="templates"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-3"
          >
            <p className="text-sm text-text-light text-center mb-2">
              {templates.length} תבניות מוכנות - בחר והתאם אליך
            </p>

            {/* Category filter */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1">
              <button
                onClick={() => setTemplateFilter('all')}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  templateFilter === 'all' ? 'bg-sage text-white' : 'bg-cream-dark/50 text-text-light'
                }`}
              >
                הכל ({templates.length})
              </button>
              {(Object.keys(TYPE_CONFIG) as RoutineType[]).filter(t => t !== 'custom').map(type => {
                const cfg = TYPE_CONFIG[type];
                const count = templates.filter(t => t.type === type).length;
                if (count === 0) return null;
                return (
                  <button
                    key={type}
                    onClick={() => setTemplateFilter(type)}
                    className="flex-shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                    style={{
                      backgroundColor: templateFilter === type ? cfg.color : cfg.bg,
                      color: templateFilter === type ? '#fff' : cfg.color,
                    }}
                  >
                    {cfg.emoji} {cfg.label} ({count})
                  </button>
                );
              })}
            </div>

            {filteredTemplates.map(template => {
              const config = TYPE_CONFIG[template.type];
              const alreadyAdded = routines.some(r => r.name === template.name);
              return (
                <div
                  key={template.id}
                  className="bg-card rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: config.bg, border: `2px solid ${config.border}` }}
                    >
                      {template.emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text mb-0.5">{template.name}</h3>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: config.bg, color: config.color }}
                      >
                        {config.label}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    {template.steps.map(step => (
                      <div key={step.id} className="flex items-center gap-2 text-sm text-text-light">
                        <span>{step.emoji}</span>
                        <span>{step.title}</span>
                        {step.duration && (
                          <span className="text-[10px] mr-auto text-text-light/70">{step.duration}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleAddFromTemplate(template.id)}
                    disabled={alreadyAdded}
                    className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                      alreadyAdded
                        ? 'bg-cream-dark text-text-light cursor-not-allowed'
                        : 'text-white active:scale-95'
                    }`}
                    style={!alreadyAdded ? { backgroundColor: config.color } : undefined}
                  >
                    {alreadyAdded ? '✅ כבר נוספה' : '➕ הוסף לשגרות שלי'}
                  </button>
                </div>
              );
            })}

            <button
              onClick={() => { setShowAddCustom(true); setActiveTab('my'); }}
              className="w-full bg-sage/10 border border-sage/20 rounded-2xl p-4 flex items-center justify-center gap-2 text-sage font-medium text-sm"
            >
              <Sparkles size={16} />
              או צור שגרה מותאמת אישית
            </button>
          </motion.div>
        )}

        {/* REFLECT TAB */}
        {activeTab === 'reflect' && (
          <motion.div
            key="reflect"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center mb-5">
              <div className="text-4xl mb-3">🔄</div>
              <h2 className="text-lg font-semibold text-text mb-1">חשיבה מחדש</h2>
              <p className="text-sm text-text-light">
                החיים משתנים - גם השגרות שלך צריכות להשתנות.
                <br />
                מה עובד? מה כבר לא משרת אותך?
              </p>
            </div>

            {!showReflectForm ? (
              <button
                onClick={() => setShowReflectForm(true)}
                className="w-full bg-sage text-white py-3 rounded-xl font-medium text-sm mb-5"
              >
                📝 בוא נחשוב ביחד
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-4 shadow-sm mb-5 space-y-4"
              >
                <div>
                  <label className="text-sm font-medium text-text mb-1 block">
                    ✅ מה עובד לי טוב בשגרות?
                  </label>
                  <textarea
                    value={reflectWorks}
                    onChange={e => setReflectWorks(e.target.value)}
                    placeholder="למשל: ההליכה בבוקר נותנת לי אנרגיה..."
                    className="w-full bg-cream/50 rounded-xl p-3 text-sm text-text border border-cream-dark focus:border-sage focus:outline-none resize-none h-20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-text mb-1 block">
                    🔄 מה כבר לא משרת אותי?
                  </label>
                  <textarea
                    value={reflectChange}
                    onChange={e => setReflectChange(e.target.value)}
                    placeholder="למשל: המדיטציה ב-6 בבוקר לא ריאלית..."
                    className="w-full bg-cream/50 rounded-xl p-3 text-sm text-text border border-cream-dark focus:border-sage focus:outline-none resize-none h-20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-text mb-1 block">
                    💡 רעיון חדש שרוצה לנסות (אופציונלי)
                  </label>
                  <textarea
                    value={reflectIdea}
                    onChange={e => setReflectIdea(e.target.value)}
                    placeholder="למשל: אולי לנסות לרוץ במקום ללכת..."
                    className="w-full bg-cream/50 rounded-xl p-3 text-sm text-text border border-cream-dark focus:border-sage focus:outline-none resize-none h-16"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleReflect}
                    className="flex-1 bg-sage text-white py-2.5 rounded-xl text-sm font-medium"
                  >
                    שמור תובנה
                  </button>
                  <button
                    onClick={() => setShowReflectForm(false)}
                    className="px-4 py-2.5 rounded-xl text-sm text-text-light bg-cream-dark/50"
                  >
                    ביטול
                  </button>
                </div>
              </motion.div>
            )}

            {/* Past reflections */}
            {reflections.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-text mb-3">
                  <Lightbulb size={14} className="inline ml-1" />
                  התובנות שלי
                </h3>
                <div className="space-y-3">
                  {[...reflections].reverse().slice(0, 10).map(r => (
                    <div key={r.id} className="bg-card rounded-xl p-3 shadow-sm">
                      <span className="text-[10px] text-text-light">
                        {new Date(r.date).toLocaleDateString('he-IL')}
                      </span>
                      {r.whatWorks && (
                        <p className="text-sm text-text mt-1">
                          <span className="text-sage font-medium">✅ עובד: </span>
                          {r.whatWorks}
                        </p>
                      )}
                      {r.whatToChange && (
                        <p className="text-sm text-text mt-1">
                          <span className="text-coral font-medium">🔄 לשנות: </span>
                          {r.whatToChange}
                        </p>
                      )}
                      {r.newIdea && (
                        <p className="text-sm text-text mt-1">
                          <span className="text-sand font-medium">💡 רעיון: </span>
                          {r.newIdea}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prompt questions */}
            <div className="mt-5 bg-sage/5 border border-sage/10 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-sage mb-3">❓ שאלות לחשיבה</h3>
              <div className="space-y-2 text-sm text-text-light">
                <p>• האם יש שלב בשגרה שאני דולג עליו תמיד?</p>
                <p>• האם השגרה מרגישה כמו חובה או כמו בחירה?</p>
                <p>• מה עוזר לי באמת ברגעים הקשים?</p>
                <p>• האם יש דבר חדש שרציתי לנסות אבל פחדתי?</p>
                <p>• מה הייתי אומר לחבר שעובר את אותו דבר?</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADD CUSTOM MODAL */}
      <AnimatePresence>
        {showAddCustom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[90] flex items-end justify-center"
            onClick={() => setShowAddCustom(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-card rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto"
              dir="rtl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-text">שגרה חדשה</h2>
                <button onClick={() => setShowAddCustom(false)} className="p-1">
                  <X size={20} className="text-text-light" />
                </button>
              </div>

              {/* Name */}
              <input
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                placeholder="שם השגרה..."
                className="w-full bg-cream/50 rounded-xl p-3 text-sm text-text border border-cream-dark focus:border-sage focus:outline-none mb-3"
              />

              {/* Type selector */}
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                {(Object.keys(TYPE_CONFIG) as RoutineType[]).map(type => {
                  const cfg = TYPE_CONFIG[type];
                  return (
                    <button
                      key={type}
                      onClick={() => { setCustomType(type); setCustomEmoji(cfg.emoji); }}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border-2 ${
                        customType === type ? 'border-current' : 'border-transparent'
                      }`}
                      style={{
                        backgroundColor: cfg.bg,
                        color: cfg.color,
                        borderColor: customType === type ? cfg.color : 'transparent',
                      }}
                    >
                      {cfg.emoji} {cfg.label}
                    </button>
                  );
                })}
              </div>

              {/* Steps */}
              <label className="text-sm font-medium text-text mb-2 block">שלבים:</label>
              <div className="space-y-2 mb-3">
                {customSteps.map((step, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      value={step.emoji}
                      onChange={e => {
                        const next = [...customSteps];
                        next[i].emoji = e.target.value;
                        setCustomSteps(next);
                      }}
                      className="w-10 text-center bg-cream/50 rounded-lg p-2 text-sm border border-cream-dark focus:border-sage focus:outline-none"
                    />
                    <input
                      value={step.title}
                      onChange={e => {
                        const next = [...customSteps];
                        next[i].title = e.target.value;
                        setCustomSteps(next);
                      }}
                      placeholder={`שלב ${i + 1}...`}
                      className="flex-1 bg-cream/50 rounded-lg p-2 text-sm text-text border border-cream-dark focus:border-sage focus:outline-none"
                    />
                    <input
                      value={step.duration}
                      onChange={e => {
                        const next = [...customSteps];
                        next[i].duration = e.target.value;
                        setCustomSteps(next);
                      }}
                      placeholder="זמן"
                      className="w-16 bg-cream/50 rounded-lg p-2 text-xs text-text-light border border-cream-dark focus:border-sage focus:outline-none"
                    />
                    {customSteps.length > 1 && (
                      <button
                        onClick={() => setCustomSteps(customSteps.filter((_, j) => j !== i))}
                        className="text-coral"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setCustomSteps([...customSteps, { title: '', emoji: '✅', duration: '' }])}
                className="text-sage text-xs font-medium mb-4 flex items-center gap-1"
              >
                <Plus size={14} /> הוסף שלב
              </button>

              <button
                onClick={handleAddCustom}
                disabled={!customName.trim() || !customSteps.some(s => s.title.trim())}
                className="w-full bg-sage text-white py-3 rounded-xl font-semibold disabled:opacity-40"
              >
                צור שגרה
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingRoutine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[90] flex items-end justify-center"
            onClick={() => setEditingRoutine(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-card rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto"
              dir="rtl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-text">עריכת שגרה</h2>
                <button onClick={() => setEditingRoutine(null)} className="p-1">
                  <X size={20} className="text-text-light" />
                </button>
              </div>

              <input
                value={editingRoutine.name}
                onChange={e => setEditingRoutine({ ...editingRoutine, name: e.target.value })}
                className="w-full bg-cream/50 rounded-xl p-3 text-sm text-text border border-cream-dark focus:border-sage focus:outline-none mb-3"
              />

              <label className="text-sm font-medium text-text mb-2 block">שלבים:</label>
              <div className="space-y-2 mb-3">
                {editingRoutine.steps.map((step, i) => (
                  <div key={step.id} className="flex gap-2 items-center">
                    <input
                      value={step.emoji}
                      onChange={e => {
                        const steps = [...editingRoutine.steps];
                        steps[i] = { ...steps[i], emoji: e.target.value };
                        setEditingRoutine({ ...editingRoutine, steps });
                      }}
                      className="w-10 text-center bg-cream/50 rounded-lg p-2 text-sm border border-cream-dark focus:border-sage focus:outline-none"
                    />
                    <input
                      value={step.title}
                      onChange={e => {
                        const steps = [...editingRoutine.steps];
                        steps[i] = { ...steps[i], title: e.target.value };
                        setEditingRoutine({ ...editingRoutine, steps });
                      }}
                      className="flex-1 bg-cream/50 rounded-lg p-2 text-sm text-text border border-cream-dark focus:border-sage focus:outline-none"
                    />
                    <input
                      value={step.duration || ''}
                      onChange={e => {
                        const steps = [...editingRoutine.steps];
                        steps[i] = { ...steps[i], duration: e.target.value };
                        setEditingRoutine({ ...editingRoutine, steps });
                      }}
                      placeholder="זמן"
                      className="w-16 bg-cream/50 rounded-lg p-2 text-xs text-text-light border border-cream-dark focus:border-sage focus:outline-none"
                    />
                    {editingRoutine.steps.length > 1 && (
                      <button
                        onClick={() => {
                          setEditingRoutine({
                            ...editingRoutine,
                            steps: editingRoutine.steps.filter((_, j) => j !== i),
                          });
                        }}
                        className="text-coral"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  setEditingRoutine({
                    ...editingRoutine,
                    steps: [
                      ...editingRoutine.steps,
                      { id: crypto.randomUUID(), title: '', emoji: '✅', duration: '' },
                    ],
                  })
                }
                className="text-sage text-xs font-medium mb-4 flex items-center gap-1"
              >
                <Plus size={14} /> הוסף שלב
              </button>

              <button
                onClick={handleSaveEdit}
                className="w-full bg-sage text-white py-3 rounded-xl font-semibold"
              >
                שמור שינויים
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[95] flex items-center justify-center p-6"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="bg-card rounded-2xl p-5 max-w-sm w-full text-center"
              dir="rtl"
            >
              <div className="text-3xl mb-3">🗑️</div>
              <h3 className="font-bold text-text mb-2">למחוק את השגרה?</h3>
              <p className="text-sm text-text-light mb-4">הפעולה לא ניתנת לביטול</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 bg-coral text-white py-2.5 rounded-xl text-sm font-medium"
                >
                  מחק
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 bg-cream-dark text-text py-2.5 rounded-xl text-sm font-medium"
                >
                  ביטול
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
