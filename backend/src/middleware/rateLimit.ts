import rateLimit from 'express-rate-limit';

/**
 * Global Rate Limiter
 * 60 requests per 15 minutes per IP address.
 * Protects all API endpoints from abuse.
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please try again later.',
    retryAfter: '15 minutes',
  },
  keyGenerator: (req) => {
    // Use session ID if available, otherwise fall back to IP
    return (req as any).sessionId || req.ip || 'unknown';
  },
});

/**
 * Chat-specific Rate Limiter
 * More restrictive: 30 requests per 15 minutes.
 * AI chat is the most expensive endpoint.
 */
export const chatRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Chat rate limit exceeded. Please wait before sending more messages.',
    retryAfter: '15 minutes',
  },
});

/**
 * TTS Rate Limiter
 * 20 requests per 15 minutes to prevent audio generation abuse.
 */
export const ttsRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Text-to-speech rate limit exceeded.',
    retryAfter: '15 minutes',
  },
});
