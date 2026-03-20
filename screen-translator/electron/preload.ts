import { contextBridge, ipcRenderer, clipboard } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Capture
  regionSelected: (region: { x: number; y: number; width: number; height: number }) =>
    ipcRenderer.invoke('region-selected', region),

  showResult: (data: {
    x: number;
    y: number;
    originalText: string;
    translatedText: string;
    sourceLang?: string;
    confidence?: number;
  }) => ipcRenderer.send('show-result', data),

  cancelOverlay: () => ipcRenderer.send('overlay-cancel'),
  closeResult: () => ipcRenderer.send('close-result'),

  onResultData: (callback: (data: {
    originalText: string;
    translatedText: string;
    sourceLang?: string;
    confidence?: number;
  }) => void) => {
    ipcRenderer.on('result-data', (_event, data) => callback(data));
  },

  // Clipboard
  copyToClipboard: (text: string) => {
    clipboard.writeText(text);
  },

  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: Record<string, unknown>) => ipcRenderer.invoke('save-settings', settings),
  getTargetLang: () => ipcRenderer.invoke('get-target-lang'),
  onSettingsData: (callback: (data: Record<string, unknown>) => void) => {
    ipcRenderer.on('settings-data', (_event, data) => callback(data));
  },

  // History
  getHistory: () => ipcRenderer.invoke('get-history'),
  addHistoryEntry: (entry: {
    originalText: string;
    translatedText: string;
    sourceLang: string;
    targetLang: string;
    confidence: number;
  }) => ipcRenderer.invoke('add-history-entry', entry),
  clearHistory: () => ipcRenderer.invoke('clear-history'),
  deleteHistoryEntry: (id: string) => ipcRenderer.invoke('delete-history-entry', id),

  // Permissions
  checkScreenPermission: () => ipcRenderer.invoke('check-screen-permission'),
  openPrivacySettings: () => ipcRenderer.send('open-privacy-settings'),

  // Window
  closeWindow: () => ipcRenderer.send('close-window'),
  openHistory: () => ipcRenderer.send('open-history'),
});
