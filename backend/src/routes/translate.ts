/**
 * Translate Route — POST /api/translate
 * Translates text content using Google Cloud Translation API.
 */

import { Router, Request, Response } from 'express';
import { translateText, isLanguageSupported, SUPPORTED_LANGUAGES } from '../services/translate';
import { sanitizeInput } from '../middleware/sanitize';

export const translateRouter = Router();

/**
 * POST /api/translate
 * Translates text to the specified target language.
 */
translateRouter.post('/translate', async (req: Request, res: Response) => {
  const { text, targetLanguage } = req.body;

  if (!text || typeof text !== 'string') {
    res.status(400).json({ error: 'Text is required and must be a string.' });
    return;
  }

  if (!targetLanguage || typeof targetLanguage !== 'string') {
    res.status(400).json({ error: 'Target language code is required.' });
    return;
  }

  if (!isLanguageSupported(targetLanguage)) {
    res.status(400).json({
      error: `Language '${targetLanguage}' is not supported.`,
      supportedLanguages: SUPPORTED_LANGUAGES.map((l) => l.code),
    });
    return;
  }

  try {
    const sanitizedText = sanitizeInput(text);
    const result = await translateText(sanitizedText, targetLanguage);

    res.json({
      translatedText: result.translatedText,
      sourceLanguage: result.detectedSourceLanguage || 'en',
      targetLanguage,
    });
  } catch (error) {
    console.error('[TRANSLATE] Route error:', error);
    res.status(500).json({ error: 'Translation service unavailable.' });
  }
});

/**
 * GET /api/languages
 * Returns the list of supported languages.
 */
translateRouter.get('/languages', (_req: Request, res: Response) => {
  res.json({ languages: SUPPORTED_LANGUAGES });
});
