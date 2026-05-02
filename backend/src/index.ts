import dotenv from 'dotenv';
dotenv.config(); // Must be FIRST — before any imports that read process.env

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { chatRouter } from './routes/chat';
import { translateRouter } from './routes/translate';
import { ttsRouter } from './routes/tts';
import { modulesRouter } from './routes/modules';
import { quizRouter } from './routes/quiz';
import { timelineRouter } from './routes/timeline';
import { pollingRouter } from './routes/polling';
import { glossaryRouter } from './routes/glossary';
import { securityMiddleware } from './middleware/security';
import { globalRateLimiter } from './middleware/rateLimit';


const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://maps.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://*.googleapis.com", "https://*.firebaseio.com"],
      frameSrc: ["https://www.google.com", "https://maps.google.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// ─── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:3001',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Logging ───────────────────────────────────────────────────────────────────
app.use(morgan('combined'));

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
app.use(globalRateLimiter);

// ─── Security Headers ─────────────────────────────────────────────────────────
app.use(securityMiddleware);

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'electra-backend',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api', chatRouter);
app.use('/api', translateRouter);
app.use('/api', ttsRouter);
app.use('/api', modulesRouter);
app.use('/api', quizRouter);
app.use('/api', timelineRouter);
app.use('/api', pollingRouter);
app.use('/api', glossaryRouter);

// ─── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global Error Handler ──────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// ─── Server Start ──────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`🗳️  ELECTRA Backend running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// ─── Graceful Shutdown ─────────────────────────────────────────────────────────
const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export { app };
