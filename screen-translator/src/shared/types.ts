export interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OcrResult {
  text: string;
  confidence: number;
}

export interface TranslationResult {
  translatedText: string;
  sourceLang?: string;
  targetLang: string;
}

export interface AppSettings {
  targetLang: string;
  shortcut: string;
}

export interface ElectronAPI {
  // Capture
  regionSelected: (region: Region) => Promise<{ imageDataUrl?: string; error?: string }>;
  showResult: (data: {
    x: number;
    y: number;
    originalText: string;
    translatedText: string;
  }) => void;
  cancelOverlay: () => void;
  closeResult: () => void;
  onResultData: (callback: (data: { originalText: string; translatedText: string }) => void) => void;

  // Clipboard
  copyToClipboard: (text: string) => void;

  // Settings
  getSettings: () => Promise<AppSettings>;
  saveSettings: (settings: Partial<AppSettings>) => Promise<AppSettings>;
  getTargetLang: () => Promise<string>;
  onSettingsData: (callback: (data: AppSettings) => void) => void;

  // Permissions
  checkScreenPermission: () => Promise<string>;
  openPrivacySettings: () => void;

  // Window
  closeWindow: () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
