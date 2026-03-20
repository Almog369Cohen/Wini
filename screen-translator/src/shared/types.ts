export interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OcrResult {
  text: string;
  confidence: number;
  detectedLang?: string;
}

export interface TranslationResult {
  translatedText: string;
  sourceLang?: string;
  targetLang: string;
}

export interface AppSettings {
  targetLang: string;
  shortcut: string;
  onboardingDone: boolean;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  confidence: number;
}

export interface ElectronAPI {
  // Capture
  regionSelected: (region: Region) => Promise<{ imageDataUrl?: string; error?: string }>;
  showResult: (data: {
    x: number;
    y: number;
    originalText: string;
    translatedText: string;
    sourceLang?: string;
    confidence?: number;
  }) => void;
  cancelOverlay: () => void;
  closeResult: () => void;
  onResultData: (callback: (data: {
    originalText: string;
    translatedText: string;
    sourceLang?: string;
    confidence?: number;
  }) => void) => void;

  // Clipboard
  copyToClipboard: (text: string) => void;

  // Settings
  getSettings: () => Promise<AppSettings>;
  saveSettings: (settings: Partial<AppSettings>) => Promise<AppSettings>;
  getTargetLang: () => Promise<string>;
  onSettingsData: (callback: (data: AppSettings) => void) => void;

  // History
  getHistory: () => Promise<HistoryEntry[]>;
  addHistoryEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => Promise<HistoryEntry>;
  clearHistory: () => Promise<void>;
  deleteHistoryEntry: (id: string) => Promise<void>;

  // Permissions
  checkScreenPermission: () => Promise<string>;
  openPrivacySettings: () => void;

  // Window
  closeWindow: () => void;
  openHistory: () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
