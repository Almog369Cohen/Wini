import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Phone, Mail, Calendar, ChevronDown, X, GripVertical, ArrowRight } from 'lucide-react';
import type { Lead, LeadStatus, EventType, LeadSource } from '../../../types/crm';
import { LEAD_STATUS_INFO, EVENT_TYPE_INFO, LEAD_SOURCE_INFO } from '../../../types/crm';

interface LeadPipelineProps {
  leads: Lead[];
  leadsByPipelineStatus: Record<LeadStatus, Lead[]>;
  onAddLead: (data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'followUpCount' | 'tags'>) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onUpdateLead: (id: string, updates: Partial<Lead>) => void;
  onDeleteLead: (id: string) => void;
  onSendWhatsApp?: (lead: Lead) => void;
  showToast: (msg: string) => void;
}

type ViewMode = 'kanban' | 'list';

export default function LeadPipeline({
  leads,
  leadsByPipelineStatus,
  onAddLead,
  onUpdateStatus,
  onUpdateLead,
  onDeleteLead,
  onSendWhatsApp,
  showToast,
}: LeadPipelineProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'all'>('all');

  const filteredLeads = leads.filter(l => {
    const matchesSearch = !searchQuery || l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.phone.includes(searchQuery);
    const matchesFilter = filterStatus === 'all' || l.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const pipelineStatuses: LeadStatus[] = ['new', 'no_answer', 'call_scheduled', 'quote_sent', 'contract_sent', 'signed'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 pb-24"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-text">ניהול לידים</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 bg-[#059cc0] text-white px-3 py-2 rounded-xl text-sm font-medium"
        >
          <Plus size={16} />
          ליד חדש
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="חיפוש לפי שם או טלפון..."
            className="w-full pr-9 pl-3 py-2 bg-card rounded-xl text-sm text-text border border-transparent focus:border-[#059cc0]/30 outline-none"
          />
        </div>
        <div className="flex bg-card rounded-xl overflow-hidden">
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-2 text-xs font-medium transition-colors ${viewMode === 'kanban' ? 'bg-[#059cc0] text-white' : 'text-text-light'}`}
          >
            Kanban
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 text-xs font-medium transition-colors ${viewMode === 'list' ? 'bg-[#059cc0] text-white' : 'text-text-light'}`}
          >
            רשימה
          </button>
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-hide">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filterStatus === 'all' ? 'bg-[#059cc0] text-white' : 'bg-card text-text-light'}`}
        >
          הכל ({leads.length})
        </button>
        {pipelineStatuses.map(status => {
          const count = leadsByPipelineStatus[status]?.length || 0;
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filterStatus === status ? 'text-white' : 'bg-card text-text-light'}`}
              style={filterStatus === status ? { backgroundColor: LEAD_STATUS_INFO[status].color } : undefined}
            >
              {LEAD_STATUS_INFO[status].emoji} {LEAD_STATUS_INFO[status].label} ({count})
            </button>
          );
        })}
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-max">
            {pipelineStatuses.map(status => (
              <div key={status} className="w-64 shrink-0">
                {/* Column Header */}
                <div
                  className="flex items-center gap-2 p-2.5 rounded-t-xl mb-2"
                  style={{ backgroundColor: LEAD_STATUS_INFO[status].color + '15' }}
                >
                  <span className="text-sm">{LEAD_STATUS_INFO[status].emoji}</span>
                  <span className="text-xs font-bold" style={{ color: LEAD_STATUS_INFO[status].color }}>
                    {LEAD_STATUS_INFO[status].label}
                  </span>
                  <span className="text-[10px] bg-white/80 rounded-full px-1.5 py-0.5 font-bold" style={{ color: LEAD_STATUS_INFO[status].color }}>
                    {leadsByPipelineStatus[status]?.length || 0}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-2">
                  {(leadsByPipelineStatus[status] || []).map(lead => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onClick={() => setSelectedLead(lead)}
                      onStatusChange={(newStatus) => {
                        onUpdateStatus(lead.id, newStatus);
                        showToast(`${lead.name} → ${LEAD_STATUS_INFO[newStatus].label}`);
                      }}
                      pipelineStatuses={pipelineStatuses}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-2">📋</p>
              <p className="text-sm text-text-light">אין לידים {filterStatus !== 'all' ? `בסטטוס "${LEAD_STATUS_INFO[filterStatus].label}"` : ''}</p>
            </div>
          ) : (
            filteredLeads.map(lead => (
              <motion.div
                key={lead.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => setSelectedLead(lead)}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: LEAD_STATUS_INFO[lead.status].color }}
                >
                  {lead.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">{lead.name}</p>
                  <div className="flex items-center gap-2 text-[10px] text-text-light">
                    {lead.eventType && <span>{EVENT_TYPE_INFO[lead.eventType]?.emoji} {EVENT_TYPE_INFO[lead.eventType]?.label}</span>}
                    <span>•</span>
                    <span>{LEAD_SOURCE_INFO[lead.source]?.emoji} {LEAD_SOURCE_INFO[lead.source]?.label}</span>
                  </div>
                </div>
                <div className="text-left">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: LEAD_STATUS_INFO[lead.status].color + '15',
                      color: LEAD_STATUS_INFO[lead.status].color,
                    }}
                  >
                    {LEAD_STATUS_INFO[lead.status].label}
                  </span>
                  {lead.amount && lead.amount > 0 && (
                    <p className="text-[10px] text-text-light mt-1 text-center">₪{lead.amount.toLocaleString()}</p>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Add Lead Modal */}
      <AnimatePresence>
        {showAddForm && (
          <AddLeadModal
            onClose={() => setShowAddForm(false)}
            onAdd={(data) => {
              onAddLead(data);
              setShowAddForm(false);
              showToast(`"${data.name}" נוסף בהצלחה`);
            }}
          />
        )}
      </AnimatePresence>

      {/* Lead Detail Modal */}
      <AnimatePresence>
        {selectedLead && (
          <LeadDetailModal
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onUpdate={(updates) => {
              onUpdateLead(selectedLead.id, updates);
              setSelectedLead({ ...selectedLead, ...updates });
              showToast('עודכן בהצלחה');
            }}
            onStatusChange={(status) => {
              onUpdateStatus(selectedLead.id, status);
              setSelectedLead({ ...selectedLead, status });
              showToast(`סטטוס → ${LEAD_STATUS_INFO[status].label}`);
            }}
            onDelete={() => {
              onDeleteLead(selectedLead.id);
              setSelectedLead(null);
              showToast('ליד נמחק');
            }}
            onSendWhatsApp={onSendWhatsApp ? () => onSendWhatsApp(selectedLead) : undefined}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Lead Card for Kanban
function LeadCard({ lead, onClick, onStatusChange, pipelineStatuses }: {
  lead: Lead;
  onClick: () => void;
  onStatusChange: (status: LeadStatus) => void;
  pipelineStatuses: LeadStatus[];
}) {
  const [showActions, setShowActions] = useState(false);
  const currentIndex = pipelineStatuses.indexOf(lead.status);
  const nextStatus = currentIndex < pipelineStatuses.length - 1 ? pipelineStatuses[currentIndex + 1] : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-xl p-3 cursor-pointer hover:shadow-md transition-shadow border border-transparent hover:border-[#059cc0]/10"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-text truncate">{lead.name}</p>
          <p className="text-[10px] text-text-light">{lead.phone}</p>
        </div>
        {lead.eventType && (
          <span className="text-xs">{EVENT_TYPE_INFO[lead.eventType]?.emoji}</span>
        )}
      </div>

      {lead.eventDate && (
        <div className="flex items-center gap-1 text-[10px] text-text-light mb-2">
          <Calendar size={10} />
          {new Date(lead.eventDate).toLocaleDateString('he-IL')}
        </div>
      )}

      {lead.amount && lead.amount > 0 && (
        <p className="text-xs font-bold text-[#03b28c] mb-2">₪{lead.amount.toLocaleString()}</p>
      )}

      <div className="flex items-center gap-1.5 text-[10px] text-text-light">
        <span>{LEAD_SOURCE_INFO[lead.source]?.emoji}</span>
        <span>{LEAD_SOURCE_INFO[lead.source]?.label}</span>
        <span className="mr-auto text-[9px]">{new Date(lead.updatedAt).toLocaleDateString('he-IL')}</span>
      </div>

      {/* Quick advance button */}
      {nextStatus && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange(nextStatus);
          }}
          className="mt-2 w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-medium transition-colors hover:opacity-80"
          style={{
            backgroundColor: LEAD_STATUS_INFO[nextStatus].color + '15',
            color: LEAD_STATUS_INFO[nextStatus].color,
          }}
        >
          <ArrowRight size={10} />
          {LEAD_STATUS_INFO[nextStatus].label}
        </button>
      )}
    </motion.div>
  );
}

// Add Lead Modal
function AddLeadModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'followUpCount' | 'tags'>) => void;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState<EventType | ''>('');
  const [eventDate, setEventDate] = useState('');
  const [source, setSource] = useState<LeadSource>('organic');
  const [notes, setNotes] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) return;
    onAdd({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      status: 'new',
      eventType: eventType || undefined,
      eventDate: eventDate || undefined,
      source,
      notes: notes.trim() || undefined,
      amount: amount ? Number(amount) : undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-card rounded-t-2xl sm:rounded-2xl p-5 max-w-md w-full max-h-[85vh] overflow-y-auto shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text">ליד חדש</h2>
          <button onClick={onClose} className="p-1 text-text-light"><X size={20} /></button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-text-light mb-1 block">שם מלא *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="שם הליד"
              className="w-full px-3 py-2 bg-cream rounded-xl text-sm text-text outline-none focus:ring-2 focus:ring-[#059cc0]/30" />
          </div>
          <div>
            <label className="text-xs text-text-light mb-1 block">טלפון *</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="050-1234567"
              className="w-full px-3 py-2 bg-cream rounded-xl text-sm text-text outline-none focus:ring-2 focus:ring-[#059cc0]/30" dir="ltr" />
          </div>
          <div>
            <label className="text-xs text-text-light mb-1 block">אימייל</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com"
              className="w-full px-3 py-2 bg-cream rounded-xl text-sm text-text outline-none focus:ring-2 focus:ring-[#059cc0]/30" dir="ltr" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-light mb-1 block">סוג אירוע</label>
              <select value={eventType} onChange={e => setEventType(e.target.value as EventType)}
                className="w-full px-3 py-2 bg-cream rounded-xl text-sm text-text outline-none">
                <option value="">בחר...</option>
                {Object.entries(EVENT_TYPE_INFO).map(([key, info]) => (
                  <option key={key} value={key}>{info.emoji} {info.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-text-light mb-1 block">מקור</label>
              <select value={source} onChange={e => setSource(e.target.value as LeadSource)}
                className="w-full px-3 py-2 bg-cream rounded-xl text-sm text-text outline-none">
                {Object.entries(LEAD_SOURCE_INFO).map(([key, info]) => (
                  <option key={key} value={key}>{info.emoji} {info.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-light mb-1 block">תאריך אירוע</label>
              <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)}
                className="w-full px-3 py-2 bg-cream rounded-xl text-sm text-text outline-none" />
            </div>
            <div>
              <label className="text-xs text-text-light mb-1 block">סכום (₪)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0"
                className="w-full px-3 py-2 bg-cream rounded-xl text-sm text-text outline-none" dir="ltr" />
            </div>
          </div>
          <div>
            <label className="text-xs text-text-light mb-1 block">הערות</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="הערות, בקשות מיוחדות..."
              className="w-full px-3 py-2 bg-cream rounded-xl text-sm text-text outline-none resize-none h-20" />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!name.trim() || !phone.trim()}
          className="w-full mt-4 py-3 bg-[#059cc0] text-white rounded-xl text-sm font-bold disabled:opacity-40 transition-opacity"
        >
          הוסף ליד
        </button>
      </motion.div>
    </motion.div>
  );
}

// Lead Detail Modal
function LeadDetailModal({ lead, onClose, onUpdate, onStatusChange, onDelete, onSendWhatsApp }: {
  lead: Lead;
  onClose: () => void;
  onUpdate: (updates: Partial<Lead>) => void;
  onStatusChange: (status: LeadStatus) => void;
  onDelete: () => void;
  onSendWhatsApp?: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(lead.name);
  const [editPhone, setEditPhone] = useState(lead.phone);
  const [editEmail, setEditEmail] = useState(lead.email || '');
  const [editNotes, setEditNotes] = useState(lead.notes || '');
  const [editAmount, setEditAmount] = useState(lead.amount?.toString() || '');
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-card rounded-t-2xl sm:rounded-2xl p-5 max-w-md w-full max-h-[85vh] overflow-y-auto shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
              style={{ backgroundColor: LEAD_STATUS_INFO[lead.status].color }}
            >
              {lead.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">{lead.name}</h2>
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
                style={{
                  backgroundColor: LEAD_STATUS_INFO[lead.status].color + '15',
                  color: LEAD_STATUS_INFO[lead.status].color,
                }}
              >
                {LEAD_STATUS_INFO[lead.status].label}
                <ChevronDown size={12} />
              </button>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-text-light"><X size={20} /></button>
        </div>

        {/* Status Menu */}
        <AnimatePresence>
          {showStatusMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(LEAD_STATUS_INFO) as LeadStatus[]).map(status => (
                  <button
                    key={status}
                    onClick={() => {
                      onStatusChange(status);
                      setShowStatusMenu(false);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${lead.status === status ? 'text-white' : ''}`}
                    style={{
                      backgroundColor: lead.status === status ? LEAD_STATUS_INFO[status].color : LEAD_STATUS_INFO[status].color + '15',
                      color: lead.status === status ? 'white' : LEAD_STATUS_INFO[status].color,
                    }}
                  >
                    {LEAD_STATUS_INFO[status].emoji} {LEAD_STATUS_INFO[status].label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3 p-2.5 bg-cream rounded-xl">
            <Phone size={16} className="text-text-light" />
            <a href={`tel:${lead.phone}`} className="text-sm text-text font-medium" dir="ltr">{lead.phone}</a>
          </div>
          {lead.email && (
            <div className="flex items-center gap-3 p-2.5 bg-cream rounded-xl">
              <Mail size={16} className="text-text-light" />
              <a href={`mailto:${lead.email}`} className="text-sm text-text" dir="ltr">{lead.email}</a>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {lead.eventType && (
            <div className="flex justify-between text-sm">
              <span className="text-text-light">סוג אירוע</span>
              <span className="text-text font-medium">{EVENT_TYPE_INFO[lead.eventType]?.emoji} {EVENT_TYPE_INFO[lead.eventType]?.label}</span>
            </div>
          )}
          {lead.eventDate && (
            <div className="flex justify-between text-sm">
              <span className="text-text-light">תאריך אירוע</span>
              <span className="text-text font-medium">{new Date(lead.eventDate).toLocaleDateString('he-IL')}</span>
            </div>
          )}
          {lead.amount !== undefined && lead.amount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-text-light">סכום</span>
              <span className="text-text font-bold text-[#03b28c]">₪{lead.amount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-text-light">מקור</span>
            <span className="text-text">{LEAD_SOURCE_INFO[lead.source]?.emoji} {LEAD_SOURCE_INFO[lead.source]?.label}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-light">נכנס</span>
            <span className="text-text">{new Date(lead.createdAt).toLocaleDateString('he-IL')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-light">עדכון אחרון</span>
            <span className="text-text">{new Date(lead.updatedAt).toLocaleDateString('he-IL')}</span>
          </div>
        </div>

        {/* Notes */}
        {lead.notes && (
          <div className="mb-4 p-3 bg-cream rounded-xl">
            <p className="text-xs text-text-light mb-1">הערות</p>
            <p className="text-sm text-text">{lead.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          {onSendWhatsApp && (
            <button
              onClick={onSendWhatsApp}
              className="w-full py-2.5 bg-[#25D366] text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"
            >
              💬 שלח WhatsApp
            </button>
          )}
          <button
            onClick={() => setEditing(!editing)}
            className="w-full py-2.5 bg-cream text-text rounded-xl text-sm font-medium"
          >
            {editing ? 'ביטול עריכה' : '✏️ ערוך פרטים'}
          </button>

          {editing && (
            <div className="space-y-2 p-3 bg-cream rounded-xl">
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                className="w-full px-3 py-2 bg-card rounded-lg text-sm" placeholder="שם" />
              <input type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)}
                className="w-full px-3 py-2 bg-card rounded-lg text-sm" placeholder="טלפון" dir="ltr" />
              <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)}
                className="w-full px-3 py-2 bg-card rounded-lg text-sm" placeholder="אימייל" dir="ltr" />
              <input type="number" value={editAmount} onChange={e => setEditAmount(e.target.value)}
                className="w-full px-3 py-2 bg-card rounded-lg text-sm" placeholder="סכום" dir="ltr" />
              <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)}
                className="w-full px-3 py-2 bg-card rounded-lg text-sm resize-none h-16" placeholder="הערות" />
              <button
                onClick={() => {
                  onUpdate({
                    name: editName,
                    phone: editPhone,
                    email: editEmail || undefined,
                    notes: editNotes || undefined,
                    amount: editAmount ? Number(editAmount) : undefined,
                  });
                  setEditing(false);
                }}
                className="w-full py-2 bg-[#059cc0] text-white rounded-lg text-sm font-medium"
              >
                שמור שינויים
              </button>
            </div>
          )}

          <button
            onClick={onDelete}
            className="w-full py-2.5 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
          >
            🗑️ מחק ליד
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
