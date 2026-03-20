import type { TranslationResult } from '../../shared/types';

/**
 * Translation Service abstraction.
 * Start with a mock/free translation approach.
 * Can be swapped to Google Cloud Translation, DeepL, or OpenAI later.
 */

// For MVP: use free MyMemory Translation API (no key needed, 5000 chars/day)
const MYMEMORY_API = 'https://api.mymemory.translated.net/get';

export async function translateText(
  text: string,
  targetLang: string,
  sourceLang?: string
): Promise<TranslationResult> {
  // Auto-detect source language if not provided
  const langPair = sourceLang
    ? `${sourceLang}|${targetLang}`
    : `autodetect|${targetLang}`;

  try {
    const params = new URLSearchParams({
      q: text,
      langpair: langPair,
    });

    const response = await fetch(`${MYMEMORY_API}?${params}`);

    if (!response.ok) {
      throw new Error(`Translation API returned ${response.status}`);
    }

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return {
        translatedText: data.responseData.translatedText,
        sourceLang: sourceLang || 'auto',
        targetLang,
      };
    }

    throw new Error(data.responseDetails || 'Translation failed');
  } catch (error) {
    console.error('Translation failed:', error);

    // Fallback: return original text with error note
    return {
      translatedText: `[Translation unavailable] ${text}`,
      sourceLang: sourceLang || 'unknown',
      targetLang,
    };
  }
}
