/**
 * Chat Route — POST /api/chat
 * Streams AI responses from Gemini via Server-Sent Events (SSE).
 * This is the core feature of ELECTRA.
 */

import { Router, Request, Response } from 'express';
import { streamChat, ChatContext, Message } from '../services/groq';
import { authMiddleware } from '../middleware/auth';
import { chatRateLimiter } from '../middleware/rateLimit';
import { sanitizeInput, sanitizeSessionId } from '../middleware/sanitize';
import * as firestoreService from '../services/firestore';
import { analyzeSentiment } from '../services/sentiment';

export const chatRouter = Router();

/**
 * @description POST /api/chat — Stream AI responses via Server-Sent Events.
 * Validates input, sanitizes messages, builds context from session,
 * and streams Groq AI response tokens to the client.
 */
chatRouter.post('/chat', authMiddleware, chatRateLimiter, async (req: Request, res: Response) => {
  const { messages, sessionId, language, moduleContext } = req.body;

  // ─── Validate Input ────────────────────────────────────────────────────────
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Invalid messages format. Expected non-empty array.' });
    return;
  }

  // Validate each message has role and content
  for (const msg of messages) {
    if (!msg.role || !msg.content || !['user', 'assistant'].includes(msg.role)) {
      res.status(400).json({ error: 'Each message must have a valid role and content.' });
      return;
    }
  }

  // Sanitize messages
  const sanitizedMessages: Message[] = messages.map((m: any) => ({
    role: m.role as 'user' | 'assistant',
    content: sanitizeInput(m.content),
  }));

  // ─── Set SSE Headers ───────────────────────────────────────────────────────
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  // ─── Build Chat Context ────────────────────────────────────────────────────
  let context: ChatContext = {
    country: 'General',
    knowledgeLevel: 'beginner',
    currentModule: moduleContext || 'General',
  };

  // Try to fetch session context from Firestore
  const cleanSessionId = sanitizeSessionId(sessionId || '');
  if (cleanSessionId) {
    try {
      const session = await firestoreService.getSession(cleanSessionId);
      if (session) {
        context = {
          country: session.country || 'General',
          knowledgeLevel: session.knowledgeLevel || 'beginner',
          currentModule: moduleContext || 'General',
        };
      }
    } catch (err) {
      // Continue with default context if Firestore is unavailable
      console.warn('[CHAT] Could not fetch session context:', err);
    }
  }

  // ─── Analyze Sentiment ──────────────────────────────────────────────────────
  const lastUserMessage = sanitizedMessages[sanitizedMessages.length - 1]?.content || '';
  const sentiment = analyzeSentiment(lastUserMessage);

  // ─── Stream Response ───────────────────────────────────────────────────────
  let fullResponse = '';

  try {
    await streamChat(sanitizedMessages, context, (token: string) => {
      fullResponse += token;
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
    });

    // Signal completion with sentiment data
    res.write(`data: ${JSON.stringify({ done: true, sentiment })}\n\n`);
    res.end();

    // Save conversation to Firestore (non-blocking)
    if (cleanSessionId) {
      // Save user message
      firestoreService.saveMessage(cleanSessionId, {
        role: 'user',
        content: sanitizedMessages[sanitizedMessages.length - 1].content,
        timestamp: new Date(),
        moduleContext,
      }).catch((err) => console.error('[CHAT] Failed to save user message:', err));

      // Save assistant response
      firestoreService.saveMessage(cleanSessionId, {
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date(),
        moduleContext,
      }).catch((err) => console.error('[CHAT] Failed to save assistant message:', err));
    }
  } catch (error) {
    console.error('[CHAT] Streaming error:', error);
    res.write(`data: ${JSON.stringify({ error: 'AI response failed. Please try again.' })}\n\n`);
    res.end();
  }
});
