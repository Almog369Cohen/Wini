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

export interface ElectronAPI {
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
  copyToClipboard: (text: string) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
