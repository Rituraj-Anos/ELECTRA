/**
 * Groq AI Service
 * Uses groq-sdk with Llama 3.3 70B for fast, free AI chat.
 * Supports streaming responses via SSE for real-time chat experience.
 */

import Groq from 'groq-sdk';
import { sanitizeInput } from '../middleware/sanitize';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ChatContext {
  country: string;
  knowledgeLevel: 'beginner' | 'intermediate' | 'expert';
  currentModule: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// ─── Groq Initialization (lazy) ────────────────────────────────────────────────

let _groq: Groq | null = null;

function getClient(): Groq {
  if (_groq) return _groq;

  const apiKey = process.env.GROQ_API_KEY || '';
  if (!apiKey) {
    throw new Error('[GROQ] GROQ_API_KEY is not set. Cannot initialize chat.');
  }

  _groq = new Groq({ apiKey });
  console.log('[GROQ] Initialized with llama-3.3-70b-versatile');
  return _groq;
}

const MODEL = 'llama-3.3-70b-versatile';

/**
 * @description Strip markdown symbols from AI response for clean display.
 * Converts **heading** to heading, * bullet to bullet points.
 * @param {string} text - Raw AI response text
 * @returns {string} Cleaned response without markdown symbols
 */
export function cleanResponse(text: string): string {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/^\*\*(.+?)\*\*\s*$/gm, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/^\*\s+/gm, '• ')
    .replace(/\*\*/g, '')
    .trim();
}

// ─── System Prompt Builder ─────────────────────────────────────────────────────

/**
 * Builds the system instruction based on conversation context.
 * The prompt ensures non-partisan, educational, and well-structured responses.
 */
export function buildSystemInstruction(context: ChatContext): string {
  return `You are ELECTRA, an expert, friendly, and strictly non-partisan election education assistant.
Your role is to help users understand election processes, timelines, voting rights, 
ballot systems, and civic participation — clearly and accurately.

RULES:
1. NEVER express political opinions or favor any party, candidate, or ideology.
2. ALWAYS cite your source type (e.g., "Based on ${context.country} Election Commission guidelines...")
3. Adapt complexity to the user's stated knowledge level: ${context.knowledgeLevel}
4. The user is asking about elections in: ${context.country}
5. If you don't know something country-specific, say so and direct to official sources.
6. Format responses with clear structure: use numbered steps for processes, 
   bullet points for lists, and bold for key terms.
7. Keep responses under 300 words unless the user asks for detail.
8. End every response with 1 relevant follow-up question to encourage learning.
9. For registration/voting questions, always include official website URLs.
10. Never fabricate election dates, laws, or statistics.

KNOWLEDGE LEVEL ADAPTATION:
- Beginner: Use simple language, avoid jargon, explain every term
- Intermediate: Assume basic civic knowledge, use proper terminology with brief definitions
- Expert: Use technical language, include detailed data, comparative analysis

CURRENT CONTEXT:
Country: ${context.country}
Knowledge Level: ${context.knowledgeLevel}
Current Module: ${context.currentModule || 'General'}`;
}

// ─── Streaming Chat ────────────────────────────────────────────────────────────

/**
 * Streams a chat response from Groq, calling onToken for each text chunk.
 * Handles conversation history and system instructions.
 */
export async function streamChat(
  messages: Message[],
  context: ChatContext,
  onToken: (token: string) => void
): Promise<void> {
  const client = getClient();
  const systemPrompt = buildSystemInstruction(context);

  // Build messages array for Groq (OpenAI-compatible format)
  const groqMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: sanitizeInput(m.content),
    })),
  ];

  const stream = await client.chat.completions.create({
    model: MODEL,
    messages: groqMessages,
    stream: true,
    max_tokens: 1024,
    temperature: 0.3,
    top_p: 0.8,
  });

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content || '';
    if (token) {
      onToken(token);
    }
  }
}

/**
 * Non-streaming chat for simpler use cases like glossary ELI5 explanations.
 */
export async function generateResponse(
  prompt: string,
  context: ChatContext
): Promise<string> {
  const client = getClient();
  const systemPrompt = buildSystemInstruction(context);

  const result = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: sanitizeInput(prompt) },
    ],
    max_tokens: 1024,
    temperature: 0.3,
    top_p: 0.8,
  });

  return result.choices[0]?.message?.content || '';
}
