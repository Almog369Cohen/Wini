import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Send, Clock, Settings, Plus, Trash2, Edit3, X, Check,
  Search, FileText, AlertCircle, CheckCheck, ChevronDown,
} from 'lucide-react';
import { useWhatsApp } from '../../../hooks/useWhatsApp';
import { useCRM } from '../../../hooks/useCRM';
import type { WhatsAppTemplate } from '../../../types/whatsapp';

type Tab = 'templates' | 'send' | 'log' | 'settings';

const CATEGORY_EMOJI: Record<string, string> = {
  welcome: '👋',
  reminder: '🔔',
  contract: '📝',
  confirmation: '📅',
  followup: '🔄',
  custom: '✏️',
};

const CATEGORY_LABELS: Record<string, string> = {
  welcome: 'ברוכים הבאים',
  reminder: 'תזכורת',
  contract: 'חוזה',
  confirmation: 'אישור',
  followup: 'מעקב',
  custom: 'מותאם',
};

const STATUS_ICONS: Record<string, { icon: typeof Check; color: string; label: string }> = {
  sent: { icon: Check, color: '#9ca3af', label: 'נשלח' },
  delivered: { icon: CheckCheck, color: '#9ca3af', label: 'נמסר' },
  read: { icon: CheckCheck, color: '#059cc0', label: 'נקרא' },
  failed: { icon: AlertCircle, color: '#ef4444', label: 'נכשל' },
};

export default function WhatsAppHub() {
  const [activeTab, setActiveTab] = useState<Tab>('templates');

  const tabs: { key: Tab; label: string; icon: typeof MessageSquare }[] = [
    { key: 'templates', label: 'תבניות', icon: FileText },
    { key: 'send', label: 'שליחה', icon: Send },
    { key: 'log', label: 'היסטוריה', icon: Clock },
    { key: 'settings', label: 'הגדרות', icon: Settings },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 pb-24"
    >
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-text flex items-center gap-2">
          <span className="text-2xl">💬</span>
          WhatsApp Hub
        </h1>
        <p className="text-xs text-text-light">ניהול הודעות, תבניות ושליחה</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-card rounded-2xl p-1 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-[#25D366] text-white'
                : 'text-text-light hover:text-text'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'templates' && <TemplatesTab key="templates" />}
        {activeTab === 'send' && <SendTab key="send" />}
        {activeTab === 'log' && <LogTab key="log" />}
        {activeTab === 'settings' && <SettingsTab key="settings" />}
      </AnimatePresence>
    </motion.div>
  );
}

// ============ TEMPLATES TAB ============
function TemplatesTab() {
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useWhatsApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<WhatsAppTemplate['category']>('custom');
  const [formMessage, setFormMessage] = useState('');

  const resetForm = () => {
    setFormName('');
    setFormCategory('custom');
    setFormMessage('');
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formName.trim() || !formMessage.trim()) return;
    const variables = Array.from(formMessage.matchAll(/\{\{(\w+)\}\}/g)).map(m => `{{${m[1]}}}`);

    if (editingId) {
      updateTemplate(editingId, {
        name: formName,
        category: formCategory,
        message: formMessage,
        variables,
        emoji: CATEGORY_EMOJI[formCategory] || '✏️',
      });
    } else {
      addTemplate({
        name: formName,
        category: formCategory,
        message: formMessage,
        variables,
        emoji: CATEGORY_EMOJI[formCategory] || '✏️',
      });
    }
    resetForm();
  };

  const startEdit = (template: WhatsAppTemplate) => {
    setEditingId(template.id);
    setFormName(template.name);
    setFormCategory(template.category);
    setFormMessage(template.message);
    setShowAddForm(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-text">תבניות הודעות ({templates.length})</h2>
        <button
          onClick={() => { resetForm(); setShowAddForm(true); }}
          className="flex items-center gap-1.5 bg-[#25D366] text-white px-3 py-1.5 rounded-xl text-xs font-medium"
        >
          <Plus size={14} />
          תבנית חדשה
        </button>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card rounded-2xl p-4 border border-[#25D366]/20 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-text">
                {editingId ? 'עריכת תבנית' : 'תבנית חדשה'}
              </h3>
              <button onClick={resetForm} className="text-text-light">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={formName}
                onChange={e => setFormName(e.target.value)}
                placeholder="שם התבנית"
                className="w-full px-3 py-2 bg-cream rounded-xl text-sm text-text outline-none focus:ring-2 focus:ring-[#25D366]/30"
              />

              <div className="relative">
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value as WhatsAppTemplate['category'])}
                  className="w-full px-3 py-2 bg-cream rounded-xl text-sm text-text outline-none appearance-none"
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {CATEGORY_EMOJI[key]} {label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
              </div>

              <textarea
                value={formMessage}
                onChange={e => setFormMessage(e.target.value)}
                placeholder={'תוכן ההודעה...\nהשתמשו ב-{{name}} למשתנים'}
                rows={4}
                className="w-full px-3 py-2 bg-cream rounded-xl text-sm text-text outline-none resize-none focus:ring-2 focus:ring-[#25D366]/30"
                dir="rtl"
              />

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-[#25D366] text-white py-2 rounded-xl text-sm font-medium"
                >
                  {editingId ? 'עדכון' : 'שמירה'}
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-cream rounded-xl text-sm text-text-light"
                >
                  ביטול
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Template List */}
      <div className="space-y-2">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card rounded-2xl p-3"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl mt-0.5">{template.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-text">{template.name}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cream text-text-light">
                    {CATEGORY_LABELS[template.category] || template.category}
                  </span>
                </div>
                <p className="text-xs text-text-light line-clamp-2 whitespace-pre-wrap">
                  {template.message}
                </p>
                {template.variables.length > 0 && (
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {template.variables.map(v => (
                      <span key={v} className="text-[10px] px-1.5 py-0.5 rounded bg-[#25D366]/10 text-[#25D366]">
                        {v}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => startEdit(template)}
                  className="p-1.5 rounded-lg hover:bg-cream text-text-light"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ============ SEND TAB ============
function SendTab() {
  const { templates, sendMessage, replaceVariables } = useWhatsApp();
  const { leads, contacts } = useCRM();
  const [selectedRecipient, setSelectedRecipient] = useState<{ name: string; phone: string } | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRecipientList, setShowRecipientList] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<'success' | 'error' | null>(null);

  const allRecipients = [
    ...leads.map(l => ({ name: l.name, phone: l.phone, type: 'lead' as const })),
    ...contacts.map(c => ({ name: c.name, phone: c.phone, type: 'contact' as const })),
  ];

  const filteredRecipients = allRecipients.filter(r =>
    !searchQuery || r.name.includes(searchQuery) || r.phone.includes(searchQuery)
  );

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  const messageToSend = selectedTemplate
    ? replaceVariables(selectedTemplate.message, { name: selectedRecipient?.name || '' })
    : customMessage;

  const handleSend = async () => {
    if (!selectedRecipient || !messageToSend.trim()) return;
    setIsSending(true);
    setSendResult(null);
    try {
      const msg = await sendMessage(
        selectedRecipient.phone,
        messageToSend,
        undefined,
        selectedRecipient.name,
      );
      setSendResult(msg.status === 'failed' ? 'error' : 'success');
      if (msg.status !== 'failed') {
        setCustomMessage('');
        setSelectedTemplateId('');
      }
    } catch {
      setSendResult('error');
    }
    setIsSending(false);
    setTimeout(() => setSendResult(null), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      {/* Recipient Selection */}
      <div className="bg-card rounded-2xl p-4">
        <h3 className="text-sm font-bold text-text mb-3">נמען</h3>

        {selectedRecipient ? (
          <div className="flex items-center justify-between bg-cream rounded-xl px-3 py-2">
            <div>
              <p className="text-sm font-medium text-text">{selectedRecipient.name}</p>
              <p className="text-xs text-text-light">{selectedRecipient.phone}</p>
            </div>
            <button
              onClick={() => setSelectedRecipient(null)}
              className="text-text-light"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative">
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setShowRecipientList(true); }}
                onFocus={() => setShowRecipientList(true)}
                placeholder="חיפוש ליד או איש קשר..."
                className="w-full pr-9 pl-3 py-2 bg-cream rounded-xl text-sm text-text outline-none"
              />
            </div>

            <AnimatePresence>
              {showRecipientList && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="max-h-40 overflow-y-auto rounded-xl bg-cream"
                >
                  {filteredRecipients.length === 0 ? (
                    <p className="text-xs text-text-light text-center py-3">לא נמצאו תוצאות</p>
                  ) : (
                    filteredRecipients.map((r, i) => (
                      <button
                        key={`${r.type}-${r.phone}-${i}`}
                        onClick={() => {
                          setSelectedRecipient({ name: r.name, phone: r.phone });
                          setShowRecipientList(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-card/50 transition-colors text-right"
                      >
                        <div className="w-7 h-7 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center text-xs font-bold">
                          {r.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-text">{r.name}</p>
                          <p className="text-[10px] text-text-light">{r.phone}</p>
                        </div>
                        <span className="mr-auto text-[10px] text-text-light">
                          {r.type === 'lead' ? 'ליד' : 'איש קשר'}
                        </span>
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Template or Custom */}
      <div className="bg-card rounded-2xl p-4">
        <h3 className="text-sm font-bold text-text mb-3">הודעה</h3>

        <div className="relative mb-3">
          <select
            value={selectedTemplateId}
            onChange={e => {
              setSelectedTemplateId(e.target.value);
              setCustomMessage('');
            }}
            className="w-full px-3 py-2 bg-cream rounded-xl text-sm text-text outline-none appearance-none"
          >
            <option value="">הודעה חופשית...</option>
            {templates.map(t => (
              <option key={t.id} value={t.id}>
                {t.emoji} {t.name}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
        </div>

        {selectedTemplate ? (
          <div className="bg-cream rounded-xl p-3">
            <p className="text-xs text-text-light mb-1">תצוגה מקדימה:</p>
            <p className="text-sm text-text whitespace-pre-wrap">
              {replaceVariables(selectedTemplate.message, { name: selectedRecipient?.name || '{{name}}' })}
            </p>
          </div>
        ) : (
          <textarea
            value={customMessage}
            onChange={e => setCustomMessage(e.target.value)}
            placeholder="כתבו את ההודעה כאן..."
            rows={4}
            className="w-full px-3 py-2 bg-cream rounded-xl text-sm text-text outline-none resize-none"
            dir="rtl"
          />
        )}
      </div>

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={!selectedRecipient || !messageToSend.trim() || isSending}
        className={`w-full py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
          !selectedRecipient || !messageToSend.trim()
            ? 'bg-gray-200 text-gray-400'
            : isSending
              ? 'bg-[#25D366]/60 text-white'
              : 'bg-[#25D366] text-white'
        }`}
      >
        <Send size={16} />
        {isSending ? 'שולח...' : 'שלח הודעה'}
      </button>

      {/* Result feedback */}
      <AnimatePresence>
        {sendResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`text-center text-sm font-medium py-2 rounded-xl ${
              sendResult === 'success'
                ? 'bg-[#03b28c]/10 text-[#03b28c]'
                : 'bg-red-50 text-red-500'
            }`}
          >
            {sendResult === 'success' ? 'ההודעה נשלחה בהצלחה!' : 'שגיאה בשליחה, נסו שוב'}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============ LOG TAB ============
function LogTab() {
  const { messages, clearMessages } = useWhatsApp();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-text">היסטוריית הודעות ({messages.length})</h2>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="text-xs text-red-400 flex items-center gap-1"
          >
            <Trash2 size={12} />
            נקה הכל
          </button>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="bg-card rounded-2xl p-8 text-center">
          <span className="text-3xl mb-2 block">📭</span>
          <p className="text-sm text-text-light">אין הודעות עדיין</p>
          <p className="text-xs text-text-light mt-1">שלחו הודעה ראשונה מלשונית "שליחה"</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg, index) => {
            const statusInfo = STATUS_ICONS[msg.status];
            const StatusIcon = statusInfo.icon;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-card rounded-2xl p-3"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    msg.direction === 'outgoing' ? 'bg-[#25D366]/10 text-[#25D366]' : 'bg-[#059cc0]/10 text-[#059cc0]'
                  }`}>
                    {msg.type === 'file' ? '📎' : msg.direction === 'outgoing' ? '↗' : '↙'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-medium text-text">
                        {msg.leadName || msg.chatId}
                      </p>
                      <div className="flex items-center gap-0.5" style={{ color: statusInfo.color }}>
                        <StatusIcon size={12} />
                        <span className="text-[10px]">{statusInfo.label}</span>
                      </div>
                    </div>
                    <p className="text-xs text-text-light line-clamp-2 whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-[10px] text-text-light/60 mt-1">
                      {new Date(msg.timestamp).toLocaleString('he-IL')}
                      {msg.automationId && ' • אוטומציה'}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

// ============ SETTINGS TAB ============
function SettingsTab() {
  const { config, updateConfig } = useWhatsApp();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="bg-card rounded-2xl p-4">
        <h3 className="text-sm font-bold text-text mb-1 flex items-center gap-2">
          <Settings size={16} className="text-[#25D366]" />
          הגדרות GREEN-API
        </h3>
        <p className="text-xs text-text-light mb-4">
          חברו את חשבון הוואטסאפ שלכם דרך GREEN-API לשליחת הודעות אוטומטיות
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-text-light mb-1 block">idInstance</label>
            <input
              type="text"
              value={config.idInstance}
              onChange={e => updateConfig({ idInstance: e.target.value })}
              placeholder="1234567890"
              className="w-full px-3 py-2 bg-cream rounded-xl text-sm text-text outline-none focus:ring-2 focus:ring-[#25D366]/30"
              dir="ltr"
            />
          </div>

          <div>
            <label className="text-xs text-text-light mb-1 block">apiTokenInstance</label>
            <input
              type="password"
              value={config.apiTokenInstance}
              onChange={e => updateConfig({ apiTokenInstance: e.target.value })}
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-3 py-2 bg-cream rounded-xl text-sm text-text outline-none focus:ring-2 focus:ring-[#25D366]/30"
              dir="ltr"
            />
          </div>

          <div>
            <label className="text-xs text-text-light mb-1 block">מספר טלפון מחובר</label>
            <input
              type="text"
              value={config.phoneNumber}
              onChange={e => updateConfig({ phoneNumber: e.target.value })}
              placeholder="050-1234567"
              className="w-full px-3 py-2 bg-cream rounded-xl text-sm text-text outline-none focus:ring-2 focus:ring-[#25D366]/30"
              dir="ltr"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full py-2.5 bg-[#25D366] text-white rounded-xl text-sm font-medium"
          >
            {saved ? 'נשמר!' : 'שמור הגדרות'}
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-card rounded-2xl p-4">
        <h3 className="text-sm font-bold text-text mb-2">סטטוס חיבור</h3>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            config.idInstance && config.apiTokenInstance ? 'bg-[#03b28c]' : 'bg-gray-300'
          }`} />
          <span className="text-sm text-text">
            {config.idInstance && config.apiTokenInstance
              ? 'מוגדר - מוכן לשליחה'
              : 'לא מוגדר - הזינו פרטי חיבור'}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="bg-cream rounded-2xl p-4">
        <h3 className="text-sm font-bold text-text mb-2">איך מתחברים?</h3>
        <ol className="text-xs text-text-light space-y-1.5 list-decimal list-inside">
          <li>היכנסו ל-green-api.com והירשמו</li>
          <li>צרו Instance חדש וחברו את הוואטסאפ (QR Code)</li>
          <li>העתיקו את ה-idInstance ו-apiTokenInstance</li>
          <li>הדביקו כאן ושמרו</li>
        </ol>
      </div>
    </motion.div>
  );
}
