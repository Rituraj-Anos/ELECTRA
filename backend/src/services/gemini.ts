/**
 * Gemini AI Service
 * Uses @google/generative-ai (direct API key auth) instead of Vertex AI.
 * Supports streaming responses via SSE for real-time chat experience.
 */

import { GoogleGenerativeAI, GenerativeModel, Content, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
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

// ─── Gemini API Initialization ─────────────────────────────────────────────────
let _model: GenerativeModel | null = null;

function getModel() {
  if (_model) return _model;

  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error('[GEMINI] GEMINI_API_KEY is not set. Cannot initialize chat.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  _model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.3,
      topP: 0.8,
      topK: 40,
    },
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ],
  });

  console.log('[GEMINI] Initialized with gemini-1.5-flash');
  return _model;
}

// ─── System Prompt Builder ─────────────────────────────────────────────────────

/**
 * Builds the system instruction for the Gemini model based on conversation context.
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
 * Streams a chat response from Gemini, calling onToken for each text chunk.
 * Handles conversation history and system instructions.
 */
export async function streamChat(
  messages: Message[],
  context: ChatContext,
  onToken: (token: string) => void
): Promise<void> {
  const systemInstruction = buildSystemInstruction(context);

  // Build history from all messages except the last (which is the new user message)
  const history: Content[] = messages.slice(0, -1).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: sanitizeInput(m.content) }],
  }));

  const chat = getModel().startChat({
    history,
    systemInstruction: { role: 'system' as any, parts: [{ text: systemInstruction }] },
  });

  const lastMessage = messages[messages.length - 1];
  const sanitizedInput = sanitizeInput(lastMessage.content);

  const result = await chat.sendMessageStream(sanitizedInput);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      onToken(text);
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
  const systemInstruction = buildSystemInstruction(context);

  const result = await getModel().generateContent({
    contents: [{ role: 'user', parts: [{ text: sanitizeInput(prompt) }] }],
    systemInstruction: { role: 'system' as any, parts: [{ text: systemInstruction }] },
  });

  const response = result.response;
  return response.text() || '';
}
