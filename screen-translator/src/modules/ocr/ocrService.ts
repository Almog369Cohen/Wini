import type { OcrResult } from '../../shared/types';
import { preprocessImage } from './imagePreprocess';

/**
 * OCR Service with preprocessing and auto language detection.
 * Uses Tesseract.js with multiple language support.
 */

type TesseractWorker = Awaited<ReturnType<typeof import('tesseract.js')['createWorker']>>;

let tesseractWorker: TesseractWorker | null = null;
let currentLangs = 'eng';

// Tesseract language codes for common languages
const LANG_MAP: Record<string, string> = {
  en: 'eng',
  he: 'heb',
  ar: 'ara',
  es: 'spa',
  fr: 'fra',
  de: 'deu',
  it: 'ita',
  pt: 'por',
  ru: 'rus',
  ja: 'jpn',
  ko: 'kor',
  zh: 'chi_sim',
};

async function createWorker(langs: string) {
  const Tesseract = await import('tesseract.js');
  const worker = await Tesseract.createWorker(langs);
  return worker;
}

async function getWorker(langs: string = 'eng') {
  if (!tesseractWorker || currentLangs !== langs) {
    if (tesseractWorker) {
      await tesseractWorker.terminate();
    }
    tesseractWorker = await createWorker(langs);
    currentLangs = langs;
  }
  return tesseractWorker;
}

/**
 * Detect the most likely language from OCR script analysis.
 * Uses character ranges to guess the script.
 */
function detectScriptLang(text: string): string {
  const charCounts: Record<string, number> = {
    latin: 0,
    hebrew: 0,
    arabic: 0,
    cjk: 0,
    cyrillic: 0,
    hangul: 0,
    hiragana: 0,
  };

  for (const char of text) {
    const code = char.codePointAt(0)!;
    if (code >= 0x0041 && code <= 0x024F) charCounts.latin++;
    else if (code >= 0x0590 && code <= 0x05FF) charCounts.hebrew++;
    else if (code >= 0x0600 && code <= 0x06FF) charCounts.arabic++;
    else if (code >= 0x4E00 && code <= 0x9FFF) charCounts.cjk++;
    else if (code >= 0x0400 && code <= 0x04FF) charCounts.cyrillic++;
    else if (code >= 0xAC00 && code <= 0xD7AF) charCounts.hangul++;
    else if (code >= 0x3040 && code <= 0x30FF) charCounts.hiragana++;
  }

  const scriptToLang: Record<string, string> = {
    latin: 'en',
    hebrew: 'he',
    arabic: 'ar',
    cjk: 'zh',
    cyrillic: 'ru',
    hangul: 'ko',
    hiragana: 'ja',
  };

  let maxScript = 'latin';
  let maxCount = 0;
  for (const [script, count] of Object.entries(charCounts)) {
    if (count > maxCount) {
      maxCount = count;
      maxScript = script;
    }
  }

  return scriptToLang[maxScript] || 'en';
}

export async function extractText(
  imageDataUrl: string,
  preprocess: boolean = true
): Promise<OcrResult> {
  try {
    // Preprocess image for better accuracy
    const processedImage = preprocess
      ? await preprocessImage(imageDataUrl)
      : imageDataUrl;

    // First pass: use multi-language detection
    const worker = await getWorker('eng+heb+ara+spa+fra+deu+rus');
    const result = await worker.recognize(processedImage);

    const text = result.data.text.trim();

    // Detect source language from the recognized text
    const detectedLang = detectScriptLang(text);

    return {
      text,
      confidence: result.data.confidence,
      detectedLang,
    };
  } catch (error) {
    console.error('OCR failed:', error);
    return {
      text: '',
      confidence: 0,
      detectedLang: undefined,
    };
  }
}

export async function terminateOcr(): Promise<void> {
  if (tesseractWorker) {
    await tesseractWorker.terminate();
    tesseractWorker = null;
  }
}

export { LANG_MAP };
