import type { TranslationResult } from '../../shared/types';

/**
 * Translation Service with auto language detection.
 * Uses MyMemory Translation API (free, no key needed, 5000 chars/day).
 * Abstracted so it can be swapped to Google Cloud Translation, DeepL, etc.
 */

const MYMEMORY_API = 'https://api.mymemory.translated.net/get';

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

export async function translateText(
  text: string,
  targetLang: string,
  sourceLang?: string
): Promise<TranslationResult> {
  // If source = target, no translation needed
  if (sourceLang && sourceLang === targetLang) {
    return {
      translatedText: text,
      sourceLang,
      targetLang,
    };
  }

  // Use autodetect if no source language provided
  const langPair = sourceLang && sourceLang !== 'auto'
    ? `${sourceLang}|${targetLang}`
    : `autodetect|${targetLang}`;

  try {
    const params = new URLSearchParams({
      q: text.substring(0, 5000), // API limit
      langpair: langPair,
    });

    const response = await fetch(`${MYMEMORY_API}?${params}`);

    if (!response.ok) {
      throw new Error(`Translation API returned ${response.status}`);
    }

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      // Extract detected language from response
      const detectedSource = data.responseData?.match?.source || sourceLang || 'auto';

      return {
        translatedText: data.responseData.translatedText,
        sourceLang: detectedSource,
        targetLang,
      };
    }

    throw new Error(data.responseDetails || 'Translation failed');
  } catch (error) {
    console.error('Translation failed:', error);

    return {
      translatedText: `[Translation unavailable] ${text}`,
      sourceLang: sourceLang || 'unknown',
      targetLang,
    };
  }
}
