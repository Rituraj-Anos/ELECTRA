import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

const isTest = process.env.NODE_ENV === 'test';
const noopMiddleware = (_req: Request, _res: Response, next: NextFunction) => next();

/**
 * @description Global rate limiter — 100 requests per 15 minutes per IP.
 * Bypassed in test environment via noop middleware.
 */
export const globalRateLimiter = isTest ? noopMiddleware : rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please try again later.',
    retryAfter: '15 minutes',
  },
  keyGenerator: (req) => {
    return (req as any).sessionId || req.ip || 'unknown';
  },
  skip: (req) => req.path === '/health' || req.path === '/api/health',
});

/**
 * @description Chat-specific rate limiter — 30 requests per 15 minutes.
 * Protects AI chat endpoints from abuse.
 */
export const chatRateLimiter = isTest ? noopMiddleware : rateLimit({
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
 * @description TTS rate limiter — 20 requests per 15 minutes.
 * Prevents audio generation abuse.
 */
export const ttsRateLimiter = isTest ? noopMiddleware : rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Text-to-speech rate limit exceeded.',
    retryAfter: '15 minutes',
  },
});

/**
 * @description Auth rate limiter — 20 requests per 15 minutes.
 * Brute force prevention for authentication endpoints.
 */
export const authLimiter = isTest ? noopMiddleware : rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many auth attempts. Please try again later.',
    retryAfter: '15 minutes',
  },
});
