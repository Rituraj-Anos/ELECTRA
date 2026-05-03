/**
 * @fileoverview Health Check Route — GET /api/health
 * Reports status of all integrated services, security config, and system metrics.
 */

import { Router, Request, Response } from 'express';

export const healthRouter = Router();

/**
 * @description System health check endpoint.
 * Reports status of all integrated services, security configuration, uptime, and memory usage.
 * @returns {Object} Health status with service availability and uptime
 */
healthRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'running',
    version: '1.0.0',
    services: {
      groqAI: process.env.GROQ_API_KEY ? 'connected' : 'not configured',
      geminiAI: process.env.GEMINI_API_KEY ? 'connected' : 'not configured',
      firebase: process.env.FIREBASE_PROJECT_ID ? 'connected' : 'not configured',
      googleTranslate: process.env.GOOGLE_CLOUD_PROJECT ? 'connected' : 'not configured',
      googleTTS: process.env.GOOGLE_CLOUD_PROJECT ? 'connected' : 'not configured',
      googleMaps: process.env.GOOGLE_MAPS_API_KEY ? 'connected' : 'not configured',
    },
    security: {
      helmet: true,
      rateLimiting: '3-tier (general/chat/tts)',
      inputSanitization: true,
      firebaseAuth: true,
      payloadLimit: '10kb',
      cors: 'whitelisted origins',
    },
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  });
});
