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
  // ─── International Languages ──────────────────────────────────────────────
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
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
  // ─── 22 Official Indian Languages (Eighth Schedule) ───────────────────────
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', flag: '🇮🇳' },
  { code: 'sa', name: 'Sanskrit', flag: '🇮🇳' },
  { code: 'ne', name: 'Nepali', flag: '🇮🇳' },
  { code: 'ks', name: 'Kashmiri', flag: '🇮🇳' },
  { code: 'sd', name: 'Sindhi', flag: '🇮🇳' },
  { code: 'kok', name: 'Konkani', flag: '🇮🇳' },
  { code: 'mai', name: 'Maithili', flag: '🇮🇳' },
  { code: 'doi', name: 'Dogri', flag: '🇮🇳' },
  { code: 'mni', name: 'Manipuri', flag: '🇮🇳' },
  { code: 'sat', name: 'Santali', flag: '🇮🇳' },
  { code: 'bo', name: 'Bodo', flag: '🇮🇳' },
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
