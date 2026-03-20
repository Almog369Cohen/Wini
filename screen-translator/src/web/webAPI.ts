/**
 * Browser polyfill for Electron APIs.
 * Uses getDisplayMedia for screen capture, localStorage for persistence.
 */

import type { ElectronAPI, AppSettings, HistoryEntry } from '../shared/types';

const SETTINGS_KEY = 'screen-translator-settings';
const HISTORY_KEY = 'screen-translator-history';

const defaultSettings: AppSettings = {
  targetLang: 'en',
  shortcut: 'CommandOrControl+Shift+T',
  onboardingDone: false,
};

function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

function persistSettings(s: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

function getHistoryEntries(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistHistory(entries: HistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

// Event bus for web mode communication
type Listener = (...args: unknown[]) => void;
const listeners: Record<string, Listener[]> = {};

export function webEmit(event: string, ...args: unknown[]) {
  (listeners[event] || []).forEach((fn) => fn(...args));
}

function webOn(event: string, fn: Listener) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(fn);
}

/**
 * Capture a region of the screen using getDisplayMedia.
 * Returns the full screenshot as a data URL — cropping happens in the caller.
 */
async function captureScreenWeb(): Promise<string | null> {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: 'monitor' } as MediaTrackConstraints,
    });

    const track = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);
    const bitmap = await imageCapture.grabFrame();
    track.stop();

    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0);

    return canvas.toDataURL('image/png');
  } catch (err) {
    console.error('Screen capture failed:', err);
    return null;
  }
}

/**
 * Crop a data URL image to a specific region.
 */
function cropImage(
  dataUrl: string,
  region: { x: number; y: number; width: number; height: number },
  scaleFactor: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = region.width * scaleFactor;
      canvas.height = region.height * scaleFactor;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(
        img,
        region.x * scaleFactor,
        region.y * scaleFactor,
        region.width * scaleFactor,
        region.height * scaleFactor,
        0,
        0,
        canvas.width,
        canvas.height
      );
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

// Store full screenshot for region cropping
let lastScreenshot: string | null = null;

export function getLastScreenshot() {
  return lastScreenshot;
}

export const webElectronAPI: ElectronAPI = {
  regionSelected: async (region) => {
    if (!lastScreenshot) {
      return { error: 'No screenshot available' };
    }
    try {
      const scaleFactor = window.devicePixelRatio || 1;
      const cropped = await cropImage(lastScreenshot, region, scaleFactor);
      return { imageDataUrl: cropped };
    } catch {
      return { error: 'Failed to crop region' };
    }
  },

  showResult: (data) => {
    webEmit('show-result', data);
  },

  cancelOverlay: () => {
    webEmit('cancel-overlay');
  },

  closeResult: () => {
    webEmit('close-result');
  },

  onResultData: (callback) => {
    webOn('result-data', callback as Listener);
  },

  copyToClipboard: (text) => {
    navigator.clipboard.writeText(text).catch(console.error);
  },

  getSettings: async () => getSettings(),

  saveSettings: async (partial) => {
    const current = getSettings();
    const updated = { ...current, ...partial };
    persistSettings(updated);
    return updated;
  },

  getTargetLang: async () => getSettings().targetLang,

  onSettingsData: (callback) => {
    webOn('settings-data', callback as Listener);
  },

  getHistory: async () => getHistoryEntries(),

  addHistoryEntry: async (entry) => {
    const newEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...entry,
    };
    const entries = getHistoryEntries();
    entries.unshift(newEntry);
    if (entries.length > 200) entries.length = 200;
    persistHistory(entries);
    return newEntry;
  },

  clearHistory: async () => {
    persistHistory([]);
  },

  deleteHistoryEntry: async (id) => {
    const entries = getHistoryEntries().filter((e) => e.id !== id);
    persistHistory(entries);
  },

  checkScreenPermission: async () => 'granted',

  openPrivacySettings: () => {
    // no-op in browser
  },

  closeWindow: () => {
    webEmit('close-window');
  },

  openHistory: () => {
    webEmit('open-history');
  },
};

export async function startWebCapture(): Promise<string | null> {
  lastScreenshot = await captureScreenWeb();
  return lastScreenshot;
}

export function installWebAPI() {
  if (!window.electronAPI) {
    window.electronAPI = webElectronAPI;
  }
}
