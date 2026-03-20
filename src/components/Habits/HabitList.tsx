import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronLeft, BookOpen, ChevronDown } from 'lucide-react';
import type { Habit, HabitType, HabitCategory } from '../../types';
import HabitCard from './HabitCard';
import AddHabit from './AddHabit';
import ConfirmDialog from '../ui/ConfirmDialog';
import { HABIT_TEMPLATES, HABIT_TOOLS, HABIT_CATEGORIES, HABIT_BARRIERS, GOAL_TEMPLATES } from '../../data/habitTemplates';
import type { HabitTemplate } from '../../data/habitTemplates';

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
  const [activeTab, setActiveTab] = useState<'my' | 'discover' | 'toolbox'>('my');
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Habit | null>(null);
  const [templateFilter, setTemplateFilter] = useState<HabitType | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [toolboxSection, setToolboxSection] = useState<'goals' | 'barriers' | 'tools' | null>('goals');

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

  const handleAddFromTemplate = (template: HabitTemplate) => {
    const habit = addHabit({
      name: template.name,
      type: template.type,
      category: template.category,
      dailyCost: template.dailyCost,
      triggers: template.commonTriggers,
      reasons: template.suggestedReasons,
    });
    showToast(`"${habit.name}" נוסף בהצלחה!`);
    setActiveTab('my');
  };

  const isTemplateAdded = (template: HabitTemplate) => {
    return habits.some(h => h.name === template.name && h.type === template.type && h.isActive);
  };

  // Filter templates
  const filteredTemplates = HABIT_TEMPLATES.filter(t => {
    if (templateFilter !== 'all' && t.type !== templateFilter) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    return true;
  });

  const availableCategories = [...new Set(
    HABIT_TEMPLATES
      .filter(t => templateFilter === 'all' || t.type === templateFilter)
      .map(t => t.category)
  )];

  const filteredTools = HABIT_TOOLS.filter(t => {
    if (templateFilter === 'all') return true;
    return t.forType === 'both' || t.forType === templateFilter;
  });

  const filteredBarriers = HABIT_BARRIERS.filter(b => {
    if (templateFilter === 'all') return true;
    return b.forType === 'both' || b.forType === templateFilter;
  });

  const tabs = [
    { id: 'my' as const, label: 'ההרגלים שלי', emoji: '📋' },
    { id: 'discover' as const, label: 'גלה הרגלים', emoji: '💡' },
    { id: 'toolbox' as const, label: 'ארגז כלים', emoji: '🧰' },
  ];

  // ===== RENDER HELPERS =====

  const renderTypeFilter = () => (
    <div className="flex gap-2 mb-3">
      {([['all', 'הכל', '✨'], ['quit', 'גמילה', '🚫'], ['build', 'בנייה', '🌱']] as const).map(([val, label, em]) => (
        <button
          key={val}
          onClick={() => { setTemplateFilter(val); setCategoryFilter('all'); }}
          className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1 ${
            templateFilter === val
              ? val === 'quit' ? 'bg-coral text-white' : val === 'build' ? 'bg-sage text-white' : 'bg-text text-white'
              : 'bg-card border border-cream-dark text-text-light'
          }`}
        >
          <span>{em}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );

  const renderTemplateCard = (template: HabitTemplate) => {
    const isAdded = isTemplateAdded(template);
    const isExpanded = expandedTemplate === template.id;
    return (
      <motion.div
        key={template.id}
        layout
        className={`bg-card rounded-xl shadow-sm overflow-hidden border ${
          isAdded ? 'border-sage/30' : 'border-transparent'
        }`}
      >
        <button
          onClick={() => setExpandedTemplate(isExpanded ? null : template.id)}
          className="w-full p-3 flex items-center gap-3 text-right"
        >
          <span className="text-2xl">{template.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-text">{template.name}</h3>
              {isAdded && (
                <span className="text-[10px] bg-sage/15 text-sage px-2 py-0.5 rounded-full">נוסף</span>
              )}
            </div>
            <p className="text-[11px] text-text-light line-clamp-1">{template.description}</p>
          </div>
          <div className="flex items-center gap-2">
            {template.dailyCost && (
              <span className="text-[10px] text-coral font-medium">{template.dailyCost}₪/יום</span>
            )}
            <ChevronLeft size={16} className={`text-text-light transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 space-y-3 border-t border-cream-dark pt-3">
                {template.methodology && (
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={12} className="text-sage" />
                    <span className="text-[10px] text-sage font-medium">{template.methodology}</span>
                  </div>
                )}
                {template.tips.length > 0 && (
                  <div>
                    <p className="text-[10px] text-text-light font-medium mb-1">💡 טיפים</p>
                    <div className="space-y-1">
                      {template.tips.map((tip, i) => (
                        <p key={i} className="text-[11px] text-text-light pr-3">• {tip}</p>
                      ))}
                    </div>
                  </div>
                )}
                {template.tinyVersion && (
                  <div className="bg-sage/10 rounded-lg p-2">
                    <p className="text-[10px] text-sage font-medium mb-0.5">⏱️ גרסת 2 דקות</p>
                    <p className="text-[11px] text-sage-dark">{template.tinyVersion}</p>
                  </div>
                )}
                {template.commonTriggers.length > 0 && (
                  <div>
                    <p className="text-[10px] text-text-light font-medium mb-1">⚠️ טריגרים נפוצים</p>
                    <div className="flex flex-wrap gap-1">
                      {template.commonTriggers.map((trigger, i) => (
                        <span key={i} className="text-[10px] bg-sand/15 text-sand px-2 py-0.5 rounded-full">{trigger}</span>
                      ))}
                    </div>
                  </div>
                )}
                {template.replacementBehavior && (
                  <div>
                    <p className="text-[10px] text-text-light font-medium mb-0.5">🔄 תחליף</p>
                    <p className="text-[11px] text-text-light">{template.replacementBehavior}</p>
                  </div>
                )}
                {template.suggestedReasons.length > 0 && (
                  <div>
                    <p className="text-[10px] text-text-light font-medium mb-1">🎯 סיבות</p>
                    <div className="flex flex-wrap gap-1">
                      {template.suggestedReasons.map((reason, i) => (
                        <span key={i} className="text-[10px] bg-sage/10 text-sage px-2 py-0.5 rounded-full">{reason}</span>
                      ))}
                    </div>
                  </div>
                )}
                {!isAdded && (
                  <button
                    onClick={() => handleAddFromTemplate(template)}
                    className={`w-full py-2.5 rounded-xl text-white text-sm font-medium transition-all ${
                      template.type === 'quit' ? 'bg-coral hover:bg-coral-light' : 'bg-sage hover:bg-sage-dark'
                    }`}
                  >
                    {template.type === 'quit' ? '🚫 התחל גמילה' : '🌱 התחל לבנות'}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <motion.div
      key="habits"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 pt-6 max-w-lg mx-auto pb-24"
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-text">הרגלים</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-sage text-white w-9 h-9 rounded-full flex items-center justify-center shadow-sm hover:bg-sage-dark transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-cream-dark rounded-xl p-1 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
              activeTab === tab.id
                ? 'bg-card text-text shadow-sm'
                : 'text-text-light'
            }`}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ===== MY HABITS TAB ===== */}
      {activeTab === 'my' && (
        <>
          {habits.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🌱</div>
              <p className="text-text-light text-sm mb-4">
                עוד אין הרגלים. גלה הרגלים חדשים או הוסף ידנית
              </p>
              <button
                onClick={() => setActiveTab('discover')}
                className="bg-sage text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-sage-dark transition-colors"
              >
                גלה הרגלים
              </button>
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
                      <HabitCard key={h.id} habit={h} onCheckIn={checkIn} onRelapse={relapse} onDelete={handleDelete} />
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
                      <HabitCard key={h.id} habit={h} onCheckIn={checkIn} onRelapse={relapse} onDelete={handleDelete} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ===== DISCOVER TAB ===== */}
      {activeTab === 'discover' && (
        <>
          {renderTypeFilter()}

          {/* Category filter chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-hide">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] transition-all ${
                categoryFilter === 'all' ? 'bg-text text-white' : 'bg-card border border-cream-dark text-text-light'
              }`}
            >
              הכל ({HABIT_TEMPLATES.filter(t => templateFilter === 'all' || t.type === templateFilter).length})
            </button>
            {availableCategories.map(cat => {
              const config = HABIT_CATEGORIES[cat];
              if (!config) return null;
              const count = HABIT_TEMPLATES.filter(t =>
                t.category === cat && (templateFilter === 'all' || t.type === templateFilter)
              ).length;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] transition-all flex items-center gap-1 ${
                    categoryFilter === cat ? 'bg-text text-white' : 'bg-card border border-cream-dark text-text-light'
                  }`}
                >
                  <span>{config.emoji}</span>
                  <span>{config.label}</span>
                  <span className="opacity-60">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            {filteredTemplates.map(renderTemplateCard)}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8">
              <p className="text-text-light text-sm">אין תבניות בקטגוריה הזו</p>
            </div>
          )}
        </>
      )}

      {/* ===== TOOLBOX TAB (Goals + Barriers + Tools unified) ===== */}
      {activeTab === 'toolbox' && (
        <>
          <div className="bg-sage/10 rounded-xl p-3 mb-4 text-center">
            <p className="text-xs text-sage-dark leading-relaxed">
              יעדים, חסמים וכלים מבוססי מחקר שיעזרו לך להצליח
            </p>
          </div>

          {/* Collapsible sections */}
          <div className="space-y-3">

            {/* ---- GOALS SECTION ---- */}
            <div className="bg-card rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setToolboxSection(toolboxSection === 'goals' ? null : 'goals')}
                className="w-full p-3.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  <div className="text-right">
                    <h3 className="text-sm font-bold text-text">יעדים ומטרות</h3>
                    <p className="text-[10px] text-text-light">חבר את ההרגלים שלך למטרות חיים</p>
                  </div>
                </div>
                <ChevronDown size={18} className={`text-text-light transition-transform ${toolboxSection === 'goals' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {toolboxSection === 'goals' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 space-y-2 border-t border-cream-dark pt-3">
                      {GOAL_TEMPLATES.map(goal => {
                        const isExpanded = expandedItem === `goal-${goal.id}`;
                        const connectedHabits = goal.connectedHabitIds
                          .map(id => HABIT_TEMPLATES.find(t => t.id === id))
                          .filter(Boolean) as HabitTemplate[];
                        const activeCount = connectedHabits.filter(t => isTemplateAdded(t)).length;

                        return (
                          <div key={goal.id} className="bg-cream/50 rounded-lg overflow-hidden">
                            <button
                              onClick={() => setExpandedItem(isExpanded ? null : `goal-${goal.id}`)}
                              className="w-full p-3 flex items-center gap-2.5 text-right"
                            >
                              <span className="text-xl">{goal.emoji}</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-text">{goal.name}</h4>
                                <p className="text-[10px] text-text-light">{goal.description}</p>
                              </div>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                {activeCount > 0 && (
                                  <span className="text-[9px] text-sage font-medium bg-sage/10 px-1.5 py-0.5 rounded-full">
                                    {activeCount}/{connectedHabits.length}
                                  </span>
                                )}
                                <ChevronLeft size={14} className={`text-text-light transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                              </div>
                            </button>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-3 pb-3 space-y-3 border-t border-cream-dark/50 pt-2.5">
                                    {/* Value badge */}
                                    <span className="text-[10px] bg-sage/10 text-sage px-2 py-0.5 rounded-full">{goal.value}</span>

                                    {/* Milestones */}
                                    <div>
                                      <p className="text-[10px] text-text-light font-medium mb-1.5">🏆 אבני דרך</p>
                                      <div className="pr-2">
                                        {goal.milestones.map((m, i) => (
                                          <div key={i} className="flex items-center gap-2.5 mb-1.5 last:mb-0">
                                            <div className="relative">
                                              <div
                                                className="w-2.5 h-2.5 rounded-full border-2 flex-shrink-0"
                                                style={{ borderColor: '#5b8a72', backgroundColor: i === 0 ? '#5b8a72' : 'transparent' }}
                                              />
                                              {i < goal.milestones.length - 1 && (
                                                <div className="absolute top-2.5 right-[3.5px] w-0.5 h-4 bg-sage/20" />
                                              )}
                                            </div>
                                            <div className="flex-1 flex items-center justify-between">
                                              <p className="text-[11px] text-text">{m.label}</p>
                                              <span className="text-[9px] text-text-light">{m.timeframe}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* WOOP */}
                                    <div className="bg-sage/8 rounded-lg p-2.5">
                                      <p className="text-[10px] text-sage font-semibold mb-1.5">🎯 תרגיל WOOP</p>
                                      <div className="space-y-1.5">
                                        <div>
                                          <span className="text-[9px] text-sage font-bold">W - משאלה: </span>
                                          <span className="text-[10px] text-text-light">{goal.woopPrompt.wish}</span>
                                        </div>
                                        <div>
                                          <span className="text-[9px] text-sage font-bold">O - תוצאה: </span>
                                          <span className="text-[10px] text-text-light">{goal.woopPrompt.outcome}</span>
                                        </div>
                                        <div>
                                          <span className="text-[9px] text-sage font-bold">O - מכשול: </span>
                                          <span className="text-[10px] text-text-light">{goal.woopPrompt.obstaclePrompt}</span>
                                        </div>
                                        <div>
                                          <span className="text-[9px] text-sage font-bold">P - תכנית: </span>
                                          <span className="text-[10px] text-text-light">{goal.woopPrompt.planPrompt}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Connected habits */}
                                    <div>
                                      <p className="text-[10px] text-text-light font-medium mb-1">🌱 הרגלים שמקדמים</p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {connectedHabits.map(t => {
                                          const added = isTemplateAdded(t);
                                          return (
                                            <button
                                              key={t.id}
                                              onClick={() => { if (!added) handleAddFromTemplate(t); }}
                                              className={`text-[10px] px-2 py-1 rounded-full flex items-center gap-1 transition-all ${
                                                added
                                                  ? 'bg-sage/15 text-sage'
                                                  : 'bg-card border border-sage/30 text-sage hover:bg-sage/10'
                                              }`}
                                            >
                                              <span>{t.emoji}</span>
                                              <span>{t.name}</span>
                                              {added ? <span>✓</span> : <Plus size={9} />}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    {/* Connected barriers */}
                                    {goal.connectedBarrierIds.length > 0 && (
                                      <div>
                                        <p className="text-[10px] text-text-light font-medium mb-1">🚧 חסמים אפשריים</p>
                                        <div className="flex flex-wrap gap-1">
                                          {goal.connectedBarrierIds.map(bId => {
                                            const b = HABIT_BARRIERS.find(b => b.id === bId);
                                            if (!b) return null;
                                            return (
                                              <button
                                                key={bId}
                                                onClick={() => {
                                                  setToolboxSection('barriers');
                                                  setExpandedItem(`barrier-${bId}`);
                                                }}
                                                className="text-[10px] bg-coral/10 text-coral px-2 py-0.5 rounded-full flex items-center gap-1"
                                              >
                                                <span>{b.emoji}</span>
                                                <span>{b.name}</span>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ---- BARRIERS SECTION ---- */}
            <div className="bg-card rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setToolboxSection(toolboxSection === 'barriers' ? null : 'barriers')}
                className="w-full p-3.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🚧</span>
                  <div className="text-right">
                    <h3 className="text-sm font-bold text-text">חסמים ופתרונות</h3>
                    <p className="text-[10px] text-text-light">מה עוצר אותך? זהה את החסם ועקוף אותו</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-text-light bg-cream-dark px-2 py-0.5 rounded-full">{HABIT_BARRIERS.length}</span>
                  <ChevronDown size={18} className={`text-text-light transition-transform ${toolboxSection === 'barriers' ? 'rotate-180' : ''}`} />
                </div>
              </button>

              <AnimatePresence>
                {toolboxSection === 'barriers' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 border-t border-cream-dark pt-3">
                      {renderTypeFilter()}

                      <div className="space-y-2">
                        {filteredBarriers.map(barrier => {
                          const isExpanded = expandedItem === `barrier-${barrier.id}`;
                          return (
                            <div key={barrier.id} className="bg-cream/50 rounded-lg overflow-hidden">
                              <button
                                onClick={() => setExpandedItem(isExpanded ? null : `barrier-${barrier.id}`)}
                                className="w-full p-2.5 flex items-center gap-2.5 text-right"
                              >
                                <span className="text-xl">{barrier.emoji}</span>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-semibold text-text">{barrier.name}</h4>
                                  <p className="text-[10px] text-text-light line-clamp-1">{barrier.description}</p>
                                </div>
                                <ChevronLeft size={14} className={`text-text-light transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                              </button>

                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-2.5 pb-2.5 space-y-2.5 border-t border-cream-dark/50 pt-2.5">
                                      <div className="flex items-center gap-1.5">
                                        <BookOpen size={11} className="text-sage" />
                                        <span className="text-[9px] text-sage font-medium">{barrier.methodology}</span>
                                      </div>

                                      <div>
                                        <p className="text-[10px] text-text-light font-medium mb-1">🔍 סימנים</p>
                                        <div className="flex flex-wrap gap-1">
                                          {barrier.signs.map((sign, i) => (
                                            <span key={i} className="text-[10px] bg-coral/10 text-coral px-2 py-0.5 rounded-full">{sign}</span>
                                          ))}
                                        </div>
                                      </div>

                                      <div>
                                        <p className="text-[10px] text-text-light font-medium mb-1">💡 פתרונות</p>
                                        <div className="space-y-1">
                                          {barrier.solutions.map((sol, i) => (
                                            <div key={i} className="flex items-start gap-1.5">
                                              <span className="text-sage text-[10px] mt-0.5">✓</span>
                                              <p className="text-[11px] text-text leading-relaxed">{sol}</p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {barrier.exercise && (
                                        <div className="bg-sage/8 rounded-lg p-2.5">
                                          <p className="text-[10px] text-sage font-semibold mb-1.5">🏋️ {barrier.exercise.name}</p>
                                          <div className="space-y-1">
                                            {barrier.exercise.steps.map((step, i) => (
                                              <div key={i} className="flex items-start gap-1.5">
                                                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ backgroundColor: '#5b8a72' }}>
                                                  {i + 1}
                                                </span>
                                                <p className="text-[10px] text-text leading-relaxed">{step}</p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {barrier.connectedHabits && barrier.connectedHabits.length > 0 && (
                                        <div>
                                          <p className="text-[10px] text-text-light font-medium mb-1">🌱 הרגלים שיעזרו</p>
                                          <div className="flex flex-wrap gap-1">
                                            {barrier.connectedHabits.map(hId => {
                                              const t = HABIT_TEMPLATES.find(t => t.id === hId);
                                              if (!t) return null;
                                              const added = isTemplateAdded(t);
                                              return (
                                                <button
                                                  key={hId}
                                                  onClick={() => { if (!added) handleAddFromTemplate(t); }}
                                                  className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                                    added ? 'bg-sage/15 text-sage' : 'bg-card border border-sage/30 text-sage'
                                                  }`}
                                                >
                                                  <span>{t.emoji}</span>
                                                  <span>{t.name}</span>
                                                  {added ? <span>✓</span> : <Plus size={9} />}
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ---- TOOLS SECTION ---- */}
            <div className="bg-card rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setToolboxSection(toolboxSection === 'tools' ? null : 'tools')}
                className="w-full p-3.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔧</span>
                  <div className="text-right">
                    <h3 className="text-sm font-bold text-text">שיטות וטכניקות</h3>
                    <p className="text-[10px] text-text-light">כלים מעשיים מהספרים המובילים</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-text-light bg-cream-dark px-2 py-0.5 rounded-full">{HABIT_TOOLS.length}</span>
                  <ChevronDown size={18} className={`text-text-light transition-transform ${toolboxSection === 'tools' ? 'rotate-180' : ''}`} />
                </div>
              </button>

              <AnimatePresence>
                {toolboxSection === 'tools' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 border-t border-cream-dark pt-3">
                      {renderTypeFilter()}

                      <div className="space-y-2">
                        {filteredTools.map(tool => {
                          const isExpanded = expandedItem === `tool-${tool.id}`;
                          return (
                            <div key={tool.id} className="bg-cream/50 rounded-lg overflow-hidden">
                              <button
                                onClick={() => setExpandedItem(isExpanded ? null : `tool-${tool.id}`)}
                                className="w-full p-2.5 flex items-center gap-2.5 text-right"
                              >
                                <span className="text-xl">{tool.emoji}</span>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-semibold text-text">{tool.name}</h4>
                                  <p className="text-[10px] text-text-light line-clamp-1">{tool.description}</p>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <span className="text-[8px] bg-sage/10 text-sage px-1.5 py-0.5 rounded-full">{tool.methodology}</span>
                                  <ChevronLeft size={14} className={`text-text-light transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                </div>
                              </button>

                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-2.5 pb-2.5 border-t border-cream-dark/50 pt-2.5">
                                      <p className="text-[11px] text-text-light mb-2.5 leading-relaxed">{tool.description}</p>
                                      <div className="space-y-1.5">
                                        {tool.steps.map((step, i) => (
                                          <div key={i} className="flex items-start gap-2">
                                            <span
                                              className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0 mt-0.5"
                                              style={{ backgroundColor: tool.forType === 'quit' ? '#c97b63' : tool.forType === 'build' ? '#5b8a72' : '#6b7280' }}
                                            >
                                              {i + 1}
                                            </span>
                                            <p className="text-[11px] text-text leading-relaxed">{step}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
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
