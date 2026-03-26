import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { WhatsAppConfig, WhatsAppTemplate, WhatsAppMessage } from '../types/whatsapp';
import { DEFAULT_WHATSAPP_TEMPLATES, getGreenApiUrl, formatPhoneForWhatsApp } from '../types/whatsapp';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const DEFAULT_CONFIG: WhatsAppConfig = {
  idInstance: '',
  apiTokenInstance: '',
  phoneNumber: '',
  isConnected: false,
};

function initTemplates(templates: WhatsAppTemplate[]): WhatsAppTemplate[] {
  if (templates.length > 0) return templates;
  const now = new Date().toISOString();
  return DEFAULT_WHATSAPP_TEMPLATES.map(t => ({
    ...t,
    id: generateId(),
    createdAt: now,
  }));
}

export function useWhatsApp() {
  const [rawTemplates, setTemplates] = useLocalStorage<WhatsAppTemplate[]>('dj-wa-templates', []);
  const [messages, setMessages] = useLocalStorage<WhatsAppMessage[]>('dj-wa-messages', []);
  const [config, setConfig] = useLocalStorage<WhatsAppConfig>('dj-wa-config', DEFAULT_CONFIG);

  const templates = initTemplates(rawTemplates);

  // Persist initialized templates if they were just created
  if (rawTemplates.length === 0 && templates.length > 0) {
    setTemplates(templates);
  }

  // ===== CONFIG =====
  const updateConfig = useCallback((updates: Partial<WhatsAppConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, [setConfig]);

  // ===== TEMPLATES CRUD =====
  const addTemplate = useCallback((data: Omit<WhatsAppTemplate, 'id' | 'createdAt'>): WhatsAppTemplate => {
    const template: WhatsAppTemplate = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setTemplates(prev => [template, ...prev]);
    return template;
  }, [setTemplates]);

  const updateTemplate = useCallback((id: string, updates: Partial<WhatsAppTemplate>) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, [setTemplates]);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  }, [setTemplates]);

  // ===== VARIABLE REPLACEMENT =====
  const replaceVariables = useCallback((message: string, variables: Record<string, string>): string => {
    let result = message;
    for (const [key, value] of Object.entries(variables)) {
      const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(pattern, value);
    }
    return result;
  }, []);

  // ===== SEND MESSAGE =====
  const sendMessage = useCallback(async (
    phone: string,
    messageText: string,
    leadId?: string,
    leadName?: string,
    automationId?: string,
  ): Promise<WhatsAppMessage> => {
    const chatId = formatPhoneForWhatsApp(phone);
    const now = new Date().toISOString();

    const msg: WhatsAppMessage = {
      id: generateId(),
      chatId,
      direction: 'outgoing',
      type: 'text',
      content: messageText,
      status: 'sent',
      leadId,
      leadName,
      automationId,
      timestamp: now,
    };

    // Call GREEN-API if configured
    if (config.idInstance && config.apiTokenInstance) {
      try {
        const url = getGreenApiUrl(config.idInstance, 'sendMessage', config.apiTokenInstance);
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatId, message: messageText }),
        });

        if (!response.ok) {
          msg.status = 'failed';
        }
      } catch {
        msg.status = 'failed';
      }
    }

    setMessages(prev => [msg, ...prev]);
    return msg;
  }, [config, setMessages]);

  // ===== SEND FILE =====
  const sendFile = useCallback(async (
    phone: string,
    fileUrl: string,
    fileName: string,
    caption?: string,
    leadId?: string,
    leadName?: string,
  ): Promise<WhatsAppMessage> => {
    const chatId = formatPhoneForWhatsApp(phone);
    const now = new Date().toISOString();

    const msg: WhatsAppMessage = {
      id: generateId(),
      chatId,
      direction: 'outgoing',
      type: 'file',
      content: caption || fileName,
      fileName,
      fileUrl,
      status: 'sent',
      leadId,
      leadName,
      timestamp: now,
    };

    if (config.idInstance && config.apiTokenInstance) {
      try {
        const url = getGreenApiUrl(config.idInstance, 'sendFileByUrl', config.apiTokenInstance);
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatId,
            urlFile: fileUrl,
            fileName,
            caption: caption || '',
          }),
        });

        if (!response.ok) {
          msg.status = 'failed';
        }
      } catch {
        msg.status = 'failed';
      }
    }

    setMessages(prev => [msg, ...prev]);
    return msg;
  }, [config, setMessages]);

  // ===== CLEAR LOG =====
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  return {
    // Data
    templates,
    messages,
    config,
    // Config
    updateConfig,
    // Templates CRUD
    addTemplate,
    updateTemplate,
    deleteTemplate,
    // Messaging
    sendMessage,
    sendFile,
    replaceVariables,
    clearMessages,
  };
}
