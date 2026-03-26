import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Plus, Trash2, Clock, Play, X, ChevronDown, ChevronUp,
  CheckCircle, XCircle, AlertTriangle,
} from 'lucide-react';
import { useAutomations } from '../../../hooks/useAutomations';
import { AUTOMATION_TEMPLATES } from '../../../types/automation';
import type { TriggerType } from '../../../types/automation';

const TRIGGER_LABELS: Record<TriggerType, string> = {
  lead_created: 'ליד חדש נוצר',
  status_changed: 'שינוי סטטוס',
  form_submitted: 'טופס הוגש',
  calcom_booking: 'פגישה נקבעה (Cal.com)',
  instagram_comment: 'תגובה באינסטגרם',
  scheduled: 'מתוזמן',
  manual: 'ידני',
};

const TRIGGER_EMOJI: Record<TriggerType, string> = {
  lead_created: '🆕',
  status_changed: '🔄',
  form_submitted: '📋',
  calcom_booking: '📅',
  instagram_comment: '📸',
  scheduled: '⏰',
  manual: '👆',
};

const CATEGORY_COLORS: Record<string, string> = {
  leads: '#059cc0',
  whatsapp: '#25D366',
  instagram: '#E1306C',
  scheduling: '#8b5cf6',
  custom: '#f59e0b',
};

const LOG_STATUS_CONFIG = {
  success: { icon: CheckCircle, color: '#03b28c', label: 'הצלחה' },
  failed: { icon: XCircle, color: '#ef4444', label: 'נכשל' },
  skipped: { icon: AlertTriangle, color: '#f59e0b', label: 'דולג' },
};

export default function AutomationsPage() {
  const {
    automations, logs,
    addFromTemplate, toggleAutomation, deleteAutomation, clearLogs,
  } = useAutomations();
  const [showTemplates, setShowTemplates] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const activeCount = automations.filter(a => a.isActive).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 pb-24"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-text flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            אוטומציות
          </h1>
          <p className="text-xs text-text-light">
            {activeCount} פעילות מתוך {automations.length}
          </p>
        </div>
        <button
          onClick={() => setShowTemplates(true)}
          className="flex items-center gap-1.5 bg-[#8b5cf6] text-white px-3 py-2 rounded-xl text-sm font-medium"
        >
          <Plus size={16} />
          הוסף מתבנית
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-card rounded-2xl p-3 text-center">
          <p className="text-lg font-bold text-[#059cc0]">{automations.length}</p>
          <p className="text-[10px] text-text-light">סה״כ</p>
        </div>
        <div className="bg-card rounded-2xl p-3 text-center">
          <p className="text-lg font-bold text-[#03b28c]">{activeCount}</p>
          <p className="text-[10px] text-text-light">פעילות</p>
        </div>
        <div className="bg-card rounded-2xl p-3 text-center">
          <p className="text-lg font-bold text-[#8b5cf6]">
            {automations.reduce((sum, a) => sum + a.runCount, 0)}
          </p>
          <p className="text-[10px] text-text-light">הרצות</p>
        </div>
      </div>

      {/* Automations List */}
      <div className="space-y-2 mb-6">
        {automations.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center">
            <span className="text-3xl mb-2 block">⚡</span>
            <p className="text-sm text-text-light">אין אוטומציות עדיין</p>
            <p className="text-xs text-text-light mt-1">לחצו "הוסף מתבנית" להתחיל</p>
          </div>
        ) : (
          automations.map((automation, index) => {
            const categoryColor = CATEGORY_COLORS[automation.category] || '#9ca3af';
            const isExpanded = expandedId === automation.id;

            return (
              <motion.div
                key={automation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`bg-card rounded-2xl overflow-hidden border-r-4 transition-colors ${
                  automation.isActive ? '' : 'opacity-70'
                }`}
                style={{ borderRightColor: automation.isActive ? categoryColor : '#d1d5db' }}
              >
                <div className="p-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{automation.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-medium text-text">{automation.name}</p>
                      </div>
                      <p className="text-xs text-text-light line-clamp-1">{automation.description}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cream text-text-light flex items-center gap-0.5">
                          {TRIGGER_EMOJI[automation.trigger.type]} {TRIGGER_LABELS[automation.trigger.type]}
                        </span>
                        {automation.runCount > 0 && (
                          <span className="text-[10px] text-text-light flex items-center gap-0.5">
                            <Play size={9} /> {automation.runCount} הרצות
                          </span>
                        )}
                        {automation.lastRunAt && (
                          <span className="text-[10px] text-text-light flex items-center gap-0.5">
                            <Clock size={9} /> {new Date(automation.lastRunAt).toLocaleDateString('he-IL')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      onClick={() => toggleAutomation(automation.id)}
                      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                        automation.isActive ? 'bg-[#03b28c]' : 'bg-gray-300'
                      }`}
                    >
                      <motion.div
                        animate={{ x: automation.isActive ? -20 : 0 }}
                        className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow"
                      />
                    </button>
                  </div>

                  {/* Expand/Collapse */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : automation.id)}
                    className="flex items-center gap-1 text-[10px] text-text-light mt-2 w-full justify-center"
                  >
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {isExpanded ? 'הסתר פרטים' : 'הצג פרטים'}
                  </button>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-cream overflow-hidden"
                    >
                      <div className="p-3 space-y-2">
                        <div>
                          <p className="text-[10px] text-text-light mb-1">פעולות ({automation.actions.length}):</p>
                          <div className="space-y-1">
                            {automation.actions.map((action, i) => (
                              <div key={action.id} className="flex items-center gap-2 text-xs text-text bg-cream rounded-lg px-2.5 py-1.5">
                                <span className="text-text-light">{i + 1}.</span>
                                <span>{action.type.replace(/_/g, ' ')}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => deleteAutomation(automation.id)}
                            className="flex items-center gap-1 text-xs text-red-400 bg-red-50 px-3 py-1.5 rounded-lg"
                          >
                            <Trash2 size={12} />
                            מחק
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Logs Section */}
      <div className="bg-card rounded-2xl p-4">
        <button
          onClick={() => setShowLogs(!showLogs)}
          className="flex items-center justify-between w-full"
        >
          <h2 className="text-sm font-bold text-text flex items-center gap-2">
            <Clock size={14} className="text-[#8b5cf6]" />
            לוג הרצות ({logs.length})
          </h2>
          {showLogs ? <ChevronUp size={16} className="text-text-light" /> : <ChevronDown size={16} className="text-text-light" />}
        </button>

        <AnimatePresence>
          {showLogs && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {logs.length > 0 && (
                <button
                  onClick={clearLogs}
                  className="text-xs text-red-400 flex items-center gap-1 mt-2"
                >
                  <Trash2 size={12} />
                  נקה לוג
                </button>
              )}

              <div className="mt-3 space-y-2">
                {logs.length === 0 ? (
                  <p className="text-xs text-text-light text-center py-4">אין הרצות בלוג</p>
                ) : (
                  logs.slice(0, 20).map(log => {
                    const statusConfig = LOG_STATUS_CONFIG[log.status];
                    const StatusIcon = statusConfig.icon;
                    return (
                      <div key={log.id} className="flex items-start gap-2 bg-cream rounded-xl p-2.5">
                        <StatusIcon size={14} style={{ color: statusConfig.color }} className="mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-text">{log.automationName}</p>
                          <p className="text-[10px] text-text-light">{log.triggeredBy}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px]" style={{ color: statusConfig.color }}>
                              {statusConfig.label}
                            </span>
                            <span className="text-[10px] text-text-light">
                              {new Date(log.timestamp).toLocaleString('he-IL')}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Template Picker Modal */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            onClick={() => setShowTemplates(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-card w-full max-w-lg rounded-t-3xl max-h-[80vh] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-cream">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-text">בחרו תבנית אוטומציה</h3>
                  <button onClick={() => setShowTemplates(false)} className="text-text-light">
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="p-4 overflow-y-auto max-h-[65vh] space-y-2">
                {AUTOMATION_TEMPLATES.map((template, index) => {
                  const catColor = CATEGORY_COLORS[template.category] || '#9ca3af';
                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        addFromTemplate(index);
                        setShowTemplates(false);
                      }}
                      className="w-full bg-cream rounded-2xl p-3 text-right hover:shadow-md transition-shadow border-r-4"
                      style={{ borderRightColor: catColor }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{template.emoji}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-text">{template.name}</p>
                          <p className="text-xs text-text-light mt-0.5">{template.description}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-card text-text-light">
                              {TRIGGER_EMOJI[template.trigger.type]} {TRIGGER_LABELS[template.trigger.type]}
                            </span>
                            <span className="text-[10px] text-text-light">
                              {template.actions.length} פעולות
                            </span>
                          </div>
                        </div>
                        <Plus size={16} className="text-text-light mt-1" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
