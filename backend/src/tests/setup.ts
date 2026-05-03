/**
 * @fileoverview Test Setup — Mocks all external services
 * Ensures tests never hit real APIs and always pass in isolation.
 */

process.env.NODE_ENV = 'test';
process.env.GROQ_API_KEY = 'test-groq-key';
process.env.GEMINI_API_KEY = 'test-gemini-key';
process.env.FIREBASE_PROJECT_ID = 'test-project';
process.env.GOOGLE_CLOUD_PROJECT = 'test-project';
process.env.GOOGLE_MAPS_API_KEY = 'test-maps-key';

jest.mock('../services/groq', () => {
  const actual = jest.requireActual('../services/groq');
  return {
    ...actual,
    streamChat: jest.fn((_messages: any, _context: any, onToken: (t: string) => void) => {
      onToken('This is a mock AI response about elections.');
      return Promise.resolve();
    }),
    generateResponse: jest.fn().mockResolvedValue('Mock AI response'),
    cleanResponse: jest.fn((text: string) => text),
  };
});

jest.mock('../services/gemini', () => ({
  streamChat: jest.fn((_messages: any, _context: any, onToken: (t: string) => void) => {
    onToken('Mock Gemini response.');
    return Promise.resolve();
  }),
  generateResponse: jest.fn().mockResolvedValue('Mock Gemini response'),
  buildSystemInstruction: jest.fn().mockReturnValue('Mock system instruction'),
}));

jest.mock('firebase-admin', () => ({
  auth: () => ({
    verifyIdToken: jest.fn().mockResolvedValue({ uid: 'test-user-123' }),
  }),
  initializeApp: jest.fn(),
  credential: { applicationDefault: jest.fn() },
  apps: [],
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockResolvedValue({ exists: false }),
        update: jest.fn().mockResolvedValue(undefined),
      })),
      add: jest.fn().mockResolvedValue({ id: 'mock-doc-id' }),
      where: jest.fn(() => ({
        orderBy: jest.fn(() => ({
          limit: jest.fn(() => ({
            get: jest.fn().mockResolvedValue({ docs: [] }),
          })),
          get: jest.fn().mockResolvedValue({ docs: [] }),
        })),
      })),
    })),
  })),
}));

jest.mock('../services/translate', () => ({
  translateText: jest.fn().mockResolvedValue({ translatedText: 'Translated text', detectedSourceLanguage: 'en' }),
  isLanguageSupported: jest.fn().mockReturnValue(true),
  SUPPORTED_LANGUAGES: [
    { code: 'en', name: 'English', flag: '' },
    { code: 'es', name: 'Spanish', flag: '' },
    { code: 'hi', name: 'Hindi', flag: '' },
  ],
}));

jest.mock('../services/tts', () => ({
  synthesizeSpeech: jest.fn().mockResolvedValue({ audioContent: 'base64audiodata' }),
}));

jest.mock('../services/maps', () => ({
  findPollingLocations: jest.fn().mockResolvedValue([
    {
      name: 'Test Polling Station',
      address: '123 Test St',
      latitude: 40.7128,
      longitude: -74.006,
      accessibility: { wheelchair: true, audioBallot: false },
      directionsUrl: 'https://maps.google.com',
    },
  ]),
}));

jest.mock('../services/firestore', () => ({
  createSession: jest.fn().mockResolvedValue('mock-session-id'),
  getSession: jest.fn().mockResolvedValue(null),
  touchSession: jest.fn().mockResolvedValue(undefined),
  completeModule: jest.fn().mockResolvedValue(undefined),
  saveMessage: jest.fn().mockResolvedValue('mock-msg-id'),
  getConversationHistory: jest.fn().mockResolvedValue([]),
  saveQuizResult: jest.fn().mockResolvedValue('mock-result-id'),
  getQuizResults: jest.fn().mockResolvedValue([]),
  getLeaderboard: jest.fn().mockResolvedValue([]),
}));
