/**
 * Text-to-Speech Route — POST /api/tts
 * Converts text to speech audio using Google Cloud TTS.
 */

import { Router, Request, Response } from 'express';
import { synthesizeSpeech } from '../services/tts';
import { sanitizeInput } from '../middleware/sanitize';
import { ttsRateLimiter } from '../middleware/rateLimit';

export const ttsRouter = Router();

/**
 * POST /api/tts
 * Generates audio from text content.
 * Returns base64-encoded MP3 audio.
 */
ttsRouter.post('/tts', ttsRateLimiter, async (req: Request, res: Response) => {
  const { text, language } = req.body;

  if (!text || typeof text !== 'string') {
    res.status(400).json({ error: 'Text is required and must be a string.' });
    return;
  }

  if (text.length > 5000) {
    res.status(400).json({ error: 'Text exceeds maximum length of 5000 characters.' });
    return;
  }

  const languageCode = language || 'en-US';

  try {
    const sanitizedText = sanitizeInput(text);
    const result = await synthesizeSpeech(sanitizedText, languageCode);

    res.json({
      audioContent: result.audioContent,
      language: languageCode,
      format: 'mp3',
    });
  } catch (error) {
    console.error('[TTS] Route error:', error);
    res.status(500).json({ error: 'Text-to-speech service unavailable.' });
  }
});
