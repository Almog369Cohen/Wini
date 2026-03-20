import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
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

  copyToClipboard: (text: string) => {
    const { clipboard } = require('electron');
    clipboard.writeText(text);
  },
});
