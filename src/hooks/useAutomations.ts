import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Automation, AutomationLog } from '../types/automation';
import { AUTOMATION_TEMPLATES } from '../types/automation';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function initAutomations(automations: Automation[]): Automation[] {
  if (automations.length > 0) return automations;
  const now = new Date().toISOString();
  return AUTOMATION_TEMPLATES.map(t => ({
    ...t,
    id: generateId(),
    runCount: 0,
    createdAt: now,
    updatedAt: now,
  }));
}

export function useAutomations() {
  const [rawAutomations, setAutomations] = useLocalStorage<Automation[]>('dj-automations', []);
  const [logs, setLogs] = useLocalStorage<AutomationLog[]>('dj-automation-logs', []);

  const automations = initAutomations(rawAutomations);

  // Persist initialized automations
  if (rawAutomations.length === 0 && automations.length > 0) {
    setAutomations(automations);
  }

  // ===== ADD AUTOMATION =====
  const addAutomation = useCallback((
    data: Omit<Automation, 'id' | 'createdAt' | 'updatedAt' | 'runCount' | 'lastRunAt'>
  ): Automation => {
    const now = new Date().toISOString();
    const automation: Automation = {
      ...data,
      id: generateId(),
      runCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    setAutomations(prev => [automation, ...prev]);
    return automation;
  }, [setAutomations]);

  // ===== ADD FROM TEMPLATE =====
  const addFromTemplate = useCallback((templateIndex: number): Automation | null => {
    const template = AUTOMATION_TEMPLATES[templateIndex];
    if (!template) return null;
    const now = new Date().toISOString();
    const automation: Automation = {
      ...template,
      id: generateId(),
      runCount: 0,
      isTemplate: false,
      createdAt: now,
      updatedAt: now,
    };
    setAutomations(prev => [automation, ...prev]);
    return automation;
  }, [setAutomations]);

  // ===== TOGGLE =====
  const toggleAutomation = useCallback((id: string) => {
    setAutomations(prev => prev.map(a =>
      a.id === id ? { ...a, isActive: !a.isActive, updatedAt: new Date().toISOString() } : a
    ));
  }, [setAutomations]);

  // ===== UPDATE =====
  const updateAutomation = useCallback((id: string, updates: Partial<Automation>) => {
    setAutomations(prev => prev.map(a =>
      a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
    ));
  }, [setAutomations]);

  // ===== DELETE =====
  const deleteAutomation = useCallback((id: string) => {
    setAutomations(prev => prev.filter(a => a.id !== id));
  }, [setAutomations]);

  // ===== LOG =====
  const addLog = useCallback((log: Omit<AutomationLog, 'id' | 'timestamp'>): AutomationLog => {
    const entry: AutomationLog = {
      ...log,
      id: generateId(),
      timestamp: new Date().toISOString(),
    };
    setLogs(prev => [entry, ...prev].slice(0, 200)); // Keep last 200 logs
    // Update run count
    setAutomations(prev => prev.map(a =>
      a.id === log.automationId
        ? { ...a, runCount: a.runCount + 1, lastRunAt: new Date().toISOString() }
        : a
    ));
    return entry;
  }, [setLogs, setAutomations]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, [setLogs]);

  return {
    automations,
    logs,
    addAutomation,
    addFromTemplate,
    toggleAutomation,
    updateAutomation,
    deleteAutomation,
    addLog,
    clearLogs,
  };
}
