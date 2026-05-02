/**
 * Google Text-to-Speech Service
 * Converts AI responses to natural-sounding audio for accessibility.
 * Uses Neural2 voices for high-quality output.
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface TTSResult {
  audioContent: string; // base64-encoded MP3
  duration?: number;
}

// ─── Voice Mapping ─────────────────────────────────────────────────────────────

const VOICE_MAP: Record<string, string> = {
  'en': 'en-US-Neural2-D',
  'en-US': 'en-US-Neural2-D',
  'en-GB': 'en-GB-Neural2-B',
  'es': 'es-ES-Neural2-B',
  'fr': 'fr-FR-Neural2-B',
  'de': 'de-DE-Neural2-B',
  'hi': 'hi-IN-Neural2-B',
  'zh': 'cmn-CN-Neural2-B',
  'ja': 'ja-JP-Neural2-B',
  'ko': 'ko-KR-Neural2-B',
  'pt': 'pt-BR-Neural2-B',
  'ar': 'ar-XA-Neural2-A',
  'ru': 'ru-RU-Neural2-B',
  'it': 'it-IT-Neural2-B',
  'nl': 'nl-NL-Neural2-B',
  'sv': 'sv-SE-Neural2-A',
  'pl': 'pl-PL-Neural2-B',
  'tr': 'tr-TR-Neural2-B',
  'vi': 'vi-VN-Neural2-A',
  'th': 'th-TH-Neural2-C',
  'id': 'id-ID-Neural2-A',
  'uk': 'uk-UA-Neural2-A',
};

/**
 * Synthesizes speech from text using Google Cloud Text-to-Speech.
 * Returns base64-encoded MP3 audio.
 */
export async function synthesizeSpeech(
  text: string,
  languageCode: string = 'en-US'
): Promise<TTSResult> {
  if (!text) {
    throw new Error('Text is required for speech synthesis');
  }

  // Strip markdown formatting before sending to TTS
  const cleanText = text
    .replace(/[*_#`~]/g, '')         // Remove markdown formatting
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // Convert links to text only
    .replace(/\n{3,}/g, '\n\n')      // Collapse excessive newlines
    .substring(0, 5000);              // TTS API limit

  try {
    const { TextToSpeechClient } = await import('@google-cloud/text-to-speech');
    const ttsClient = new TextToSpeechClient();

    // Get the best voice for the language
    const voiceName = VOICE_MAP[languageCode] || VOICE_MAP['en'] || 'en-US-Neural2-D';
    const voiceLangCode = voiceName.split('-').slice(0, 2).join('-');

    const [response] = await ttsClient.synthesizeSpeech({
      input: { text: cleanText },
      voice: {
        languageCode: voiceLangCode,
        name: voiceName,
        ssmlGender: 'NEUTRAL' as any,
      },
      audioConfig: {
        audioEncoding: 'MP3' as any,
        speakingRate: 0.95,
        pitch: 0,
        volumeGainDb: 0,
      },
    });

    const audioContent = Buffer.from(response.audioContent as Uint8Array).toString('base64');

    return { audioContent };
  } catch (error) {
    console.error('[TTS] Speech synthesis failed:', error);
    throw new Error('Failed to generate audio. Please try again.');
  }
}
