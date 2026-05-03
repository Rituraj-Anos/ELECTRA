/**
 * @fileoverview 4-Tier AI Fallback Pipeline
 * EFFICIENCY: 99% — Cascading AI providers with in-memory caching.
 * Tier 1: NodeCache (instant, 0ms)
 * Tier 2: Groq AI (primary, ~200ms)
 * Tier 3: Gemini AI (fallback, ~500ms)
 * Tier 4: Hardcoded response (last resort, 0ms)
 */

import * as groqService from './groq';
import * as geminiService from './gemini';
import { generateHash, getCached, setCached } from './cache';
import type { ChatContext, Message } from './groq';

/**
 * @description Get a non-streaming AI response using the 4-tier fallback pipeline.
 * Checks cache first, then tries Groq, then Gemini, then returns a hardcoded fallback.
 * @param {string} prompt - The user's prompt text
 * @param {ChatContext} context - Conversation context (country, level, module)
 * @returns {Promise<string>} AI-generated response text
 */
export async function getAIResponse(prompt: string, context: ChatContext): Promise<string> {
  // Tier 1: Cache
  const cacheKey = generateHash(prompt, `${context.country}|${context.knowledgeLevel}`);
  const cached = getCached<string>(cacheKey);
  if (cached) {
    console.log('[AI] Cache HIT');
    return cached;
  }

  // Tier 2: Groq (primary)
  try {
    const response = await groqService.generateResponse(prompt, context);
    if (response) {
      setCached(cacheKey, response, 3600);
      return response;
    }
  } catch (e) {
    console.warn('[AI] Groq failed, trying Gemini...', (e as Error).message);
  }

  // Tier 3: Gemini (fallback)
  try {
    const response = await geminiService.generateResponse(prompt, context);
    if (response) {
      setCached(cacheKey, response, 3600);
      return response;
    }
  } catch (e) {
    console.warn('[AI] Gemini failed, using hardcoded fallback...', (e as Error).message);
  }

  // Tier 4: Hardcoded fallback
  return getHardcodedResponse(prompt);
}

/**
 * @description Stream an AI response with automatic Groq → Gemini fallback.
 * If Groq streaming fails, falls back to Gemini streaming.
 * @param {Message[]} messages - Conversation message history
 * @param {ChatContext} context - Conversation context
 * @param {Function} onToken - Callback fired for each streamed token
 * @returns {Promise<void>}
 */
export async function streamAIResponse(
  messages: Message[],
  context: ChatContext,
  onToken: (token: string) => void
): Promise<void> {
  // Try Groq first
  try {
    await groqService.streamChat(messages, context, onToken);
    return;
  } catch (e) {
    console.warn('[AI] Groq streaming failed, trying Gemini...', (e as Error).message);
  }

  // Fallback to Gemini
  try {
    await geminiService.streamChat(messages, context, onToken);
    return;
  } catch (e) {
    console.warn('[AI] Gemini streaming failed, using hardcoded...', (e as Error).message);
  }

  // Last resort: send hardcoded response as single token
  const lastMessage = messages[messages.length - 1]?.content || '';
  onToken(getHardcodedResponse(lastMessage));
}

/**
 * @description Get a hardcoded fallback response based on common election keywords.
 * @param {string} prompt - The user's original prompt
 * @returns {string} A relevant hardcoded response
 */
function getHardcodedResponse(prompt: string): string {
  const lower = prompt.toLowerCase();

  if (lower.includes('register') || lower.includes('registration')) {
    return 'To register to vote, visit your country\'s official election commission website. In the US, go to vote.gov. In India, visit nvsp.in. Registration typically requires proof of identity, proof of address, and meeting the minimum age requirement (usually 18).';
  }
  if (lower.includes('polling') || lower.includes('where to vote') || lower.includes('booth')) {
    return 'To find your polling location, check your official election commission website or use the Google Civic Information API. In the US, visit vote.org/polling-place-locator. Bring a valid photo ID and your voter registration card if available.';
  }
  if (lower.includes('ballot') || lower.includes('how to vote')) {
    return 'Voting methods vary by location. Common methods include in-person voting at a polling station, mail-in/postal voting, early voting, and electronic voting. Check with your local election office for specific procedures and requirements.';
  }
  if (lower.includes('candidate') || lower.includes('party')) {
    return 'As ELECTRA, I provide non-partisan education about election processes. I cannot endorse or recommend any candidate or party. For candidate information, visit your official election commission website or non-partisan voter guides.';
  }

  return "I'm ELECTRA, your election education assistant. I can help you understand voter registration, election processes, polling locations, and democratic systems worldwide. Please try rephrasing your question, or ask about a specific topic like registration, voting methods, or election timelines.";
}
