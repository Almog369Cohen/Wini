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
  }) => ipcRenderer.send('show-result', data),

  cancelOverlay: () => ipcRenderer.send('overlay-cancel'),
  closeResult: () => ipcRenderer.send('close-result'),

  onResultData: (callback: (data: { originalText: string; translatedText: string }) => void) => {
    ipcRenderer.on('result-data', (_event, data) => callback(data));
  },

  // Clipboard
  copyToClipboard: (text: string) => {
    clipboard.writeText(text);
  },

  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: Record<string, string>) => ipcRenderer.invoke('save-settings', settings),
  getTargetLang: () => ipcRenderer.invoke('get-target-lang'),
  onSettingsData: (callback: (data: Record<string, string>) => void) => {
    ipcRenderer.on('settings-data', (_event, data) => callback(data));
  },

  // Permissions
  checkScreenPermission: () => ipcRenderer.invoke('check-screen-permission'),
  openPrivacySettings: () => ipcRenderer.send('open-privacy-settings'),

  // Window
  closeWindow: () => ipcRenderer.send('close-window'),
});
