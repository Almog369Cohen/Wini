import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Form, FormField, FormSubmission } from '../types/forms';
import { FORM_TEMPLATES } from '../types/forms';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function initForms(forms: Form[]): Form[] {
  if (forms.length > 0) return forms;
  const now = new Date().toISOString();
  return FORM_TEMPLATES.map(t => ({
    ...t,
    id: generateId(),
    submissionCount: 0,
    createdAt: now,
    updatedAt: now,
  }));
}

export function useForms() {
  const [rawForms, setForms] = useLocalStorage<Form[]>('dj-forms', []);
  const [submissions, setSubmissions] = useLocalStorage<FormSubmission[]>('dj-form-submissions', []);

  const forms = initForms(rawForms);

  // Persist initialized forms
  if (rawForms.length === 0 && forms.length > 0) {
    setForms(forms);
  }

  // ===== FORMS CRUD =====
  const addForm = useCallback((data: Omit<Form, 'id' | 'createdAt' | 'updatedAt' | 'submissionCount'>): Form => {
    const now = new Date().toISOString();
    const form: Form = {
      ...data,
      id: generateId(),
      submissionCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    setForms(prev => [form, ...prev]);
    return form;
  }, [setForms]);

  const addFromTemplate = useCallback((templateIndex: number): Form | null => {
    const template = FORM_TEMPLATES[templateIndex];
    if (!template) return null;
    const now = new Date().toISOString();
    const form: Form = {
      ...template,
      id: generateId(),
      submissionCount: 0,
      isTemplate: false,
      createdAt: now,
      updatedAt: now,
    };
    setForms(prev => [form, ...prev]);
    return form;
  }, [setForms]);

  const updateForm = useCallback((id: string, updates: Partial<Form>) => {
    setForms(prev => prev.map(f =>
      f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f
    ));
  }, [setForms]);

  const deleteForm = useCallback((id: string) => {
    setForms(prev => prev.filter(f => f.id !== id));
  }, [setForms]);

  const toggleForm = useCallback((id: string) => {
    setForms(prev => prev.map(f =>
      f.id === id ? { ...f, isActive: !f.isActive, updatedAt: new Date().toISOString() } : f
    ));
  }, [setForms]);

  // ===== FIELDS =====
  const addField = useCallback((formId: string, field: Omit<FormField, 'id' | 'order'>) => {
    setForms(prev => prev.map(f => {
      if (f.id !== formId) return f;
      const newField: FormField = {
        ...field,
        id: generateId(),
        order: f.fields.length,
      };
      return { ...f, fields: [...f.fields, newField], updatedAt: new Date().toISOString() };
    }));
  }, [setForms]);

  const updateField = useCallback((formId: string, fieldId: string, updates: Partial<FormField>) => {
    setForms(prev => prev.map(f => {
      if (f.id !== formId) return f;
      return {
        ...f,
        fields: f.fields.map(field => field.id === fieldId ? { ...field, ...updates } : field),
        updatedAt: new Date().toISOString(),
      };
    }));
  }, [setForms]);

  const removeField = useCallback((formId: string, fieldId: string) => {
    setForms(prev => prev.map(f => {
      if (f.id !== formId) return f;
      const fields = f.fields
        .filter(field => field.id !== fieldId)
        .map((field, i) => ({ ...field, order: i }));
      return { ...f, fields, updatedAt: new Date().toISOString() };
    }));
  }, [setForms]);

  const reorderFields = useCallback((formId: string, fromIndex: number, toIndex: number) => {
    setForms(prev => prev.map(f => {
      if (f.id !== formId) return f;
      const fields = [...f.fields];
      const [moved] = fields.splice(fromIndex, 1);
      fields.splice(toIndex, 0, moved);
      return {
        ...f,
        fields: fields.map((field, i) => ({ ...field, order: i })),
        updatedAt: new Date().toISOString(),
      };
    }));
  }, [setForms]);

  // ===== SUBMISSIONS =====
  const addSubmission = useCallback((formId: string, data: Record<string, unknown>, source?: string): FormSubmission => {
    const form = forms.find(f => f.id === formId);
    const submission: FormSubmission = {
      id: generateId(),
      formId,
      formName: form?.name || '',
      data,
      source,
      createdAt: new Date().toISOString(),
    };
    setSubmissions(prev => [submission, ...prev]);
    // Update submission count
    setForms(prev => prev.map(f =>
      f.id === formId ? { ...f, submissionCount: f.submissionCount + 1 } : f
    ));
    return submission;
  }, [forms, setSubmissions, setForms]);

  const getSubmissionsForForm = useCallback((formId: string): FormSubmission[] => {
    return submissions.filter(s => s.formId === formId);
  }, [submissions]);

  return {
    forms,
    submissions,
    // Forms CRUD
    addForm,
    addFromTemplate,
    updateForm,
    deleteForm,
    toggleForm,
    // Fields
    addField,
    updateField,
    removeField,
    reorderFields,
    // Submissions
    addSubmission,
    getSubmissionsForForm,
  };
}
