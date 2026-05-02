/**
 * Google Translate Service
 * Provides real-time translation of content into 20+ languages.
 * Uses Google Cloud Translation API v3 (Advanced).
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface TranslationResult {
  translatedText: string;
  detectedSourceLanguage?: string;
}

// ─── Supported Languages ───────────────────────────────────────────────────────

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
] as const;

/**
 * Translates text to the specified target language using Google Cloud Translation API.
 */
export async function translateText(
  text: string,
  targetLanguage: string
): Promise<TranslationResult> {
  if (!text || !targetLanguage) {
    return { translatedText: text };
  }

  // Don't translate if target is English (source language)
  if (targetLanguage === 'en') {
    return { translatedText: text };
  }

  try {
    const { TranslationServiceClient } = await import('@google-cloud/translate');
    const translationClient = new TranslationServiceClient();

    const projectId = process.env.GOOGLE_CLOUD_PROJECT;
    const [response] = await translationClient.translateText({
      parent: `projects/${projectId}/locations/global`,
      contents: [text],
      targetLanguageCode: targetLanguage,
      mimeType: 'text/plain',
    });

    return {
      translatedText: response.translations?.[0]?.translatedText || text,
      detectedSourceLanguage: response.translations?.[0]?.detectedLanguageCode || undefined,
    };
  } catch (error) {
    console.error('[TRANSLATE] Translation failed:', error);
    // Graceful fallback — return original text
    return { translatedText: text };
  }
}

/**
 * Checks if a language code is supported by ELECTRA.
 */
export function isLanguageSupported(languageCode: string): boolean {
  return SUPPORTED_LANGUAGES.some((lang) => lang.code === languageCode);
}
