import type { TranslationResult } from '../../shared/types';

/**
 * Translation Service with auto language detection.
 * Uses MyMemory Translation API (free, no key needed, 5000 chars/day).
 * Falls back to LibreTranslate API if MyMemory fails.
 */

const MYMEMORY_API = 'https://api.mymemory.translated.net/get';
const LIBRE_API = 'https://libretranslate.com/translate';

// Language name map for display
export const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  he: 'Hebrew',
  ar: 'Arabic',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
  auto: 'Auto-detect',
};

async function translateWithMyMemory(
  text: string,
  targetLang: string,
  sourceLang?: string
): Promise<TranslationResult> {
  const langPair = sourceLang && sourceLang !== 'auto'
    ? `${sourceLang}|${targetLang}`
    : `autodetect|${targetLang}`;

  const params = new URLSearchParams({
    q: text.substring(0, 5000),
    langpair: langPair,
  });

  const response = await fetch(`${MYMEMORY_API}?${params}`);

  if (!response.ok) {
    throw new Error(`MyMemory API returned ${response.status}`);
  }

  const data = await response.json();

  // MyMemory returns 429-like messages in responseDetails when quota exceeded
  if (data.responseStatus === 429 ||
      (data.responseDetails && /quota|limit/i.test(data.responseDetails))) {
    throw new Error('QUOTA_EXCEEDED');
  }

  if (data.responseStatus === 200 && data.responseData?.translatedText) {
    const detectedSource = data.responseData?.match?.source || sourceLang || 'auto';
    return {
      translatedText: data.responseData.translatedText,
      sourceLang: detectedSource,
      targetLang,
    };
  }

  throw new Error(data.responseDetails || 'Translation failed');
}

async function translateWithLibre(
  text: string,
  targetLang: string,
  sourceLang?: string
): Promise<TranslationResult> {
  const response = await fetch(LIBRE_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text.substring(0, 5000),
      source: sourceLang && sourceLang !== 'auto' ? sourceLang : 'auto',
      target: targetLang,
    }),
  });

  if (!response.ok) {
    throw new Error(`LibreTranslate API returned ${response.status}`);
  }

  const data = await response.json();
  return {
    translatedText: data.translatedText,
    sourceLang: data.detectedLanguage?.language || sourceLang || 'auto',
    targetLang,
  };
}

export async function translateText(
  text: string,
  targetLang: string,
  sourceLang?: string
): Promise<TranslationResult> {
  // If source = target, no translation needed
  if (sourceLang && sourceLang === targetLang) {
    return { translatedText: text, sourceLang, targetLang };
  }

  // Try MyMemory first, fall back to LibreTranslate
  try {
    return await translateWithMyMemory(text, targetLang, sourceLang);
  } catch (primaryError) {
    console.warn('MyMemory failed, trying LibreTranslate:', primaryError);

    try {
      return await translateWithLibre(text, targetLang, sourceLang);
    } catch (fallbackError) {
      console.error('All translation APIs failed:', fallbackError);
      return {
        translatedText: `[Translation unavailable] ${text}`,
        sourceLang: sourceLang || 'unknown',
        targetLang,
      };
    }
  }
}
