import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Edit3, X, Eye, ChevronDown, ChevronUp, FileText,
  ArrowUp, ArrowDown, ToggleLeft, ToggleRight, Inbox, Copy,
} from 'lucide-react';
import { useForms } from '../../../hooks/useForms';
import { FORM_TEMPLATES } from '../../../types/forms';
import type { Form, FormField, FieldType } from '../../../types/forms';

const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: 'טקסט',
  phone: 'טלפון',
  email: 'אימייל',
  date: 'תאריך',
  select: 'בחירה',
  textarea: 'טקסט ארוך',
  checkbox: 'תיבת סימון',
  number: 'מספר',
  file: 'קובץ',
};

const FIELD_TYPE_EMOJI: Record<FieldType, string> = {
  text: '📝',
  phone: '📱',
  email: '📧',
  date: '📅',
  select: '📋',
  textarea: '📄',
  checkbox: '☑️',
  number: '#️⃣',
  file: '📎',
};

const CATEGORY_COLORS: Record<string, string> = {
  wedding: '#E1306C',
  course: '#8b5cf6',
  rental: '#059cc0',
  podcast: '#f59e0b',
  mailing: '#03b28c',
  custom: '#6b7280',
};

type View = 'list' | 'editor' | 'submissions' | 'preview';

export default function FormsPage() {
  const {
    forms, addFromTemplate, updateForm, deleteForm, toggleForm,
    addField, updateField, removeField, reorderFields,
    getSubmissionsForForm,
  } = useForms();
  const [view, setView] = useState<View>('list');
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const selectedForm = forms.find(f => f.id === selectedFormId);

  const openEditor = (formId: string) => {
    setSelectedFormId(formId);
    setView('editor');
  };

  const openSubmissions = (formId: string) => {
    setSelectedFormId(formId);
    setView('submissions');
  };

  const openPreview = (formId: string) => {
    setSelectedFormId(formId);
    setView('preview');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 pb-24"
    >
      <AnimatePresence mode="wait">
        {view === 'list' && (
          <FormsList
            key="list"
            forms={forms}
            onEdit={openEditor}
            onSubmissions={openSubmissions}
            onPreview={openPreview}
            onToggle={toggleForm}
            onDelete={deleteForm}
            onShowTemplates={() => setShowTemplates(true)}
            getSubmissionCount={(id) => getSubmissionsForForm(id).length}
          />
        )}
        {view === 'editor' && selectedForm && (
          <FormEditor
            key="editor"
            form={selectedForm}
            onBack={() => setView('list')}
            onUpdateForm={(updates) => updateForm(selectedForm.id, updates)}
            onAddField={(field) => addField(selectedForm.id, field)}
            onUpdateField={(fieldId, updates) => updateField(selectedForm.id, fieldId, updates)}
            onRemoveField={(fieldId) => removeField(selectedForm.id, fieldId)}
            onReorder={(from, to) => reorderFields(selectedForm.id, from, to)}
          />
        )}
        {view === 'submissions' && selectedForm && (
          <FormSubmissions
            key="submissions"
            form={selectedForm}
            submissions={getSubmissionsForForm(selectedForm.id)}
            onBack={() => setView('list')}
          />
        )}
        {view === 'preview' && selectedForm && (
          <FormPreview
            key="preview"
            form={selectedForm}
            onBack={() => setView('list')}
          />
        )}
      </AnimatePresence>

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
                  <h3 className="text-sm font-bold text-text">בחרו תבנית טופס</h3>
                  <button onClick={() => setShowTemplates(false)} className="text-text-light">
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="p-4 overflow-y-auto max-h-[65vh] space-y-2">
                {FORM_TEMPLATES.map((template, index) => {
                  const catColor = CATEGORY_COLORS[template.category] || '#6b7280';
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
                          <p className="text-[10px] text-text-light mt-1">
                            {template.fields.length} שדות
                          </p>
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

// ============ FORMS LIST ============
function FormsList({
  forms,
  onEdit,
  onSubmissions,
  onPreview,
  onToggle,
  onDelete,
  onShowTemplates,
  getSubmissionCount,
}: {
  forms: Form[];
  onEdit: (id: string) => void;
  onSubmissions: (id: string) => void;
  onPreview: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onShowTemplates: () => void;
  getSubmissionCount: (id: string) => number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-text flex items-center gap-2">
            <span className="text-2xl">📝</span>
            טפסים
          </h1>
          <p className="text-xs text-text-light">{forms.length} טפסים</p>
        </div>
        <button
          onClick={onShowTemplates}
          className="flex items-center gap-1.5 bg-[#f59e0b] text-white px-3 py-2 rounded-xl text-sm font-medium"
        >
          <Plus size={16} />
          צור מתבנית
        </button>
      </div>

      {/* Forms Grid */}
      {forms.length === 0 ? (
        <div className="bg-card rounded-2xl p-8 text-center">
          <span className="text-3xl mb-2 block">📝</span>
          <p className="text-sm text-text-light">אין טפסים עדיין</p>
          <p className="text-xs text-text-light mt-1">לחצו "צור מתבנית" להתחיל</p>
        </div>
      ) : (
        <div className="space-y-2">
          {forms.map((form, index) => {
            const catColor = CATEGORY_COLORS[form.category] || '#6b7280';
            const subCount = getSubmissionCount(form.id);
            return (
              <motion.div
                key={form.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`bg-card rounded-2xl p-3 border-r-4 transition-opacity ${
                  form.isActive ? '' : 'opacity-60'
                }`}
                style={{ borderRightColor: form.isActive ? catColor : '#d1d5db' }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{form.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-text">{form.name}</p>
                      {form.isActive && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#03b28c]/10 text-[#03b28c]">
                          פעיל
                        </span>
                      )}
                    </div>
                    {form.description && (
                      <p className="text-xs text-text-light line-clamp-1">{form.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-text-light">
                        {form.fields.length} שדות
                      </span>
                      <span className="text-[10px] text-text-light flex items-center gap-0.5">
                        <Inbox size={9} /> {subCount} תשובות
                      </span>
                    </div>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => onToggle(form.id)}
                    className="flex-shrink-0"
                  >
                    {form.isActive ? (
                      <ToggleRight size={24} className="text-[#03b28c]" />
                    ) : (
                      <ToggleLeft size={24} className="text-gray-300" />
                    )}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-1.5 mt-2 pt-2 border-t border-cream">
                  <button
                    onClick={() => onEdit(form.id)}
                    className="flex items-center gap-1 text-[10px] text-[#059cc0] bg-[#059cc0]/10 px-2.5 py-1 rounded-lg"
                  >
                    <Edit3 size={10} />
                    עריכה
                  </button>
                  <button
                    onClick={() => onPreview(form.id)}
                    className="flex items-center gap-1 text-[10px] text-[#8b5cf6] bg-[#8b5cf6]/10 px-2.5 py-1 rounded-lg"
                  >
                    <Eye size={10} />
                    תצוגה מקדימה
                  </button>
                  <button
                    onClick={() => onSubmissions(form.id)}
                    className="flex items-center gap-1 text-[10px] text-[#03b28c] bg-[#03b28c]/10 px-2.5 py-1 rounded-lg"
                  >
                    <Inbox size={10} />
                    תשובות ({subCount})
                  </button>
                  <button
                    onClick={() => onDelete(form.id)}
                    className="flex items-center gap-1 text-[10px] text-red-400 bg-red-50 px-2.5 py-1 rounded-lg mr-auto"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

// ============ FORM EDITOR ============
function FormEditor({
  form,
  onBack,
  onUpdateForm,
  onAddField,
  onUpdateField,
  onRemoveField,
  onReorder,
}: {
  form: Form;
  onBack: () => void;
  onUpdateForm: (updates: Partial<Form>) => void;
  onAddField: (field: Omit<FormField, 'id' | 'order'>) => void;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onRemoveField: (fieldId: string) => void;
  onReorder: (from: number, to: number) => void;
}) {
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldType, setNewFieldType] = useState<FieldType>('text');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldOptions, setNewFieldOptions] = useState('');

  const sortedFields = [...form.fields].sort((a, b) => a.order - b.order);

  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;
    const field: Omit<FormField, 'id' | 'order'> = {
      type: newFieldType,
      label: newFieldLabel,
      required: newFieldRequired,
    };
    if (newFieldType === 'select' && newFieldOptions.trim()) {
      field.options = newFieldOptions.split(',').map(o => o.trim()).filter(Boolean);
    }
    onAddField(field);
    setNewFieldLabel('');
    setNewFieldOptions('');
    setNewFieldRequired(false);
    setShowAddField(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-text-light text-sm">
            חזרה &larr;
          </button>
        </div>
      </div>

      {/* Form Details */}
      <div className="bg-card rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">{form.emoji}</span>
          <h2 className="text-sm font-bold text-text">הגדרות טופס</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-text-light mb-1 block">שם הטופס</label>
            <input
              type="text"
              value={form.name}
              onChange={e => onUpdateForm({ name: e.target.value })}
              className="w-full px-3 py-2 bg-cream rounded-xl text-sm text-text outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-text-light mb-1 block">תיאור</label>
            <input
              type="text"
              value={form.description || ''}
              onChange={e => onUpdateForm({ description: e.target.value })}
              className="w-full px-3 py-2 bg-cream rounded-xl text-sm text-text outline-none"
            />
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="bg-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-text">שדות ({sortedFields.length})</h2>
          <button
            onClick={() => setShowAddField(true)}
            className="flex items-center gap-1 text-xs text-[#059cc0] bg-[#059cc0]/10 px-2.5 py-1 rounded-lg"
          >
            <Plus size={12} />
            הוסף שדה
          </button>
        </div>

        {/* Add Field Form */}
        <AnimatePresence>
          {showAddField && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-cream rounded-xl p-3 mb-3 overflow-hidden"
            >
              <div className="space-y-2">
                <input
                  type="text"
                  value={newFieldLabel}
                  onChange={e => setNewFieldLabel(e.target.value)}
                  placeholder="שם השדה"
                  className="w-full px-3 py-2 bg-card rounded-xl text-sm text-text outline-none"
                />
                <div className="relative">
                  <select
                    value={newFieldType}
                    onChange={e => setNewFieldType(e.target.value as FieldType)}
                    className="w-full px-3 py-2 bg-card rounded-xl text-sm text-text outline-none appearance-none"
                  >
                    {Object.entries(FIELD_TYPE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {FIELD_TYPE_EMOJI[key as FieldType]} {label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
                </div>

                {newFieldType === 'select' && (
                  <input
                    type="text"
                    value={newFieldOptions}
                    onChange={e => setNewFieldOptions(e.target.value)}
                    placeholder="אפשרויות (מופרדות בפסיק)"
                    className="w-full px-3 py-2 bg-card rounded-xl text-sm text-text outline-none"
                  />
                )}

                <label className="flex items-center gap-2 text-xs text-text">
                  <input
                    type="checkbox"
                    checked={newFieldRequired}
                    onChange={e => setNewFieldRequired(e.target.checked)}
                    className="rounded"
                  />
                  שדה חובה
                </label>

                <div className="flex gap-2">
                  <button
                    onClick={handleAddField}
                    className="flex-1 bg-[#059cc0] text-white py-2 rounded-xl text-xs font-medium"
                  >
                    הוסף
                  </button>
                  <button
                    onClick={() => setShowAddField(false)}
                    className="px-4 py-2 bg-card rounded-xl text-xs text-text-light"
                  >
                    ביטול
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Field List */}
        <div className="space-y-1.5">
          {sortedFields.map((field, index) => {
            const isEditing = editingFieldId === field.id;
            return (
              <motion.div
                key={field.id}
                layout
                className="bg-cream rounded-xl p-2.5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{FIELD_TYPE_EMOJI[field.type]}</span>
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <input
                        type="text"
                        value={field.label}
                        onChange={e => onUpdateField(field.id, { label: e.target.value })}
                        className="w-full px-2 py-1 bg-card rounded-lg text-xs text-text outline-none"
                        autoFocus
                        onBlur={() => setEditingFieldId(null)}
                        onKeyDown={e => { if (e.key === 'Enter') setEditingFieldId(null); }}
                      />
                    ) : (
                      <p className="text-xs font-medium text-text">
                        {field.label}
                        {field.required && <span className="text-red-400 mr-1">*</span>}
                      </p>
                    )}
                    <p className="text-[10px] text-text-light">{FIELD_TYPE_LABELS[field.type]}</p>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {index > 0 && (
                      <button
                        onClick={() => onReorder(index, index - 1)}
                        className="p-1 text-text-light hover:text-text"
                      >
                        <ArrowUp size={12} />
                      </button>
                    )}
                    {index < sortedFields.length - 1 && (
                      <button
                        onClick={() => onReorder(index, index + 1)}
                        className="p-1 text-text-light hover:text-text"
                      >
                        <ArrowDown size={12} />
                      </button>
                    )}
                    <button
                      onClick={() => setEditingFieldId(field.id)}
                      className="p-1 text-text-light hover:text-[#059cc0]"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={() => onRemoveField(field.id)}
                      className="p-1 text-text-light hover:text-red-400"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ============ FORM SUBMISSIONS ============
function FormSubmissions({
  form,
  submissions,
  onBack,
}: {
  form: Form;
  submissions: import('../../../types/forms').FormSubmission[];
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-text-light text-sm">
            חזרה &larr;
          </button>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-4">
        <h2 className="text-sm font-bold text-text mb-1 flex items-center gap-2">
          <span>{form.emoji}</span>
          תשובות - {form.name}
        </h2>
        <p className="text-xs text-text-light">{submissions.length} תשובות</p>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-card rounded-2xl p-8 text-center">
          <span className="text-3xl mb-2 block">📭</span>
          <p className="text-sm text-text-light">אין תשובות עדיין</p>
          <p className="text-xs text-text-light mt-1">תשובות יופיעו כאן כשהטופס ימולא</p>
        </div>
      ) : (
        <div className="space-y-2">
          {submissions.map((sub, index) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-card rounded-2xl p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-text-light">
                  {new Date(sub.createdAt).toLocaleString('he-IL')}
                </span>
                {sub.source && (
                  <span className="text-[10px] text-text-light bg-cream px-1.5 py-0.5 rounded">
                    {sub.source}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {Object.entries(sub.data).map(([key, value]) => {
                  const field = form.fields.find(f => f.id === key);
                  return (
                    <div key={key} className="flex items-start gap-2">
                      <span className="text-[10px] text-text-light w-24 flex-shrink-0">
                        {field?.label || key}:
                      </span>
                      <span className="text-xs text-text">{String(value)}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ============ FORM PREVIEW ============
function FormPreview({
  form,
  onBack,
}: {
  form: Form;
  onBack: () => void;
}) {
  const sortedFields = [...form.fields].sort((a, b) => a.order - b.order);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-text-light text-sm">
            חזרה &larr;
          </button>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8b5cf6]/10 text-[#8b5cf6]">
            תצוגה מקדימה
          </span>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 max-w-md mx-auto">
        <div className="text-center mb-6">
          <span className="text-3xl mb-2 block">{form.emoji}</span>
          <h2 className="text-lg font-bold text-text">{form.name}</h2>
          {form.description && (
            <p className="text-xs text-text-light mt-1">{form.description}</p>
          )}
        </div>

        <div className="space-y-4">
          {sortedFields.map(field => (
            <div key={field.id}>
              <label className="text-xs font-medium text-text mb-1 block">
                {field.label}
                {field.required && <span className="text-red-400 mr-1">*</span>}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  placeholder={field.placeholder || ''}
                  rows={3}
                  className="w-full px-3 py-2 bg-cream rounded-xl text-sm text-text outline-none resize-none"
                  dir="rtl"
                  disabled
                />
              ) : field.type === 'select' ? (
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 bg-cream rounded-xl text-sm text-text outline-none appearance-none"
                    disabled
                  >
                    <option value="">בחרו...</option>
                    {field.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
                </div>
              ) : field.type === 'checkbox' ? (
                <label className="flex items-center gap-2 text-sm text-text">
                  <input type="checkbox" className="rounded" disabled />
                  {field.label}
                </label>
              ) : (
                <input
                  type={field.type === 'phone' ? 'tel' : field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                  placeholder={field.placeholder || ''}
                  className="w-full px-3 py-2 bg-cream rounded-xl text-sm text-text outline-none"
                  dir={field.type === 'phone' || field.type === 'email' ? 'ltr' : 'rtl'}
                  disabled
                />
              )}
            </div>
          ))}
        </div>

        <button
          className="w-full mt-6 py-3 bg-[#059cc0] text-white rounded-2xl text-sm font-bold opacity-50 cursor-not-allowed"
          disabled
        >
          שליחה
        </button>
      </div>
    </motion.div>
  );
}
