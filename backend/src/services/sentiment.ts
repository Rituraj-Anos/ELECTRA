/**
 * @fileoverview Sentiment Analysis Service
 * Analyzes user message sentiment to tailor AI responses and track engagement.
 * Uses keyword-based analysis with graceful fallback (no external API required).
 */

/**
 * @description Sentiment analysis result
 */
export interface SentimentResult {
  /** Score from -1 (very negative) to 1 (very positive) */
  score: number;
  /** Magnitude/intensity of the sentiment (0 to infinity) */
  magnitude: number;
  /** Human-readable label */
  label: 'positive' | 'negative' | 'neutral' | 'mixed';
}

// Positive keyword sets related to civic engagement
const POSITIVE_WORDS = new Set([
  'thanks', 'thank', 'great', 'good', 'helpful', 'awesome', 'excellent',
  'wonderful', 'appreciate', 'love', 'excited', 'interested', 'eager',
  'happy', 'glad', 'perfect', 'amazing', 'fantastic', 'useful', 'clear',
  'understand', 'learned', 'informative', 'brilliant', 'nice',
]);

// Negative keyword sets
const NEGATIVE_WORDS = new Set([
  'bad', 'wrong', 'terrible', 'horrible', 'awful', 'hate', 'angry',
  'frustrated', 'confused', 'unclear', 'useless', 'broken', 'fail',
  'disappointed', 'annoying', 'stupid', 'worst', 'never', 'impossible',
  'unfair', 'corrupt', 'rigged', 'scam', 'fraud',
]);

/**
 * @description Analyze sentiment of user message using keyword matching.
 * Provides fast, dependency-free sentiment analysis tuned for civic education context.
 * @param {string} text - User message text to analyze
 * @returns {SentimentResult} Sentiment score, magnitude, and label
 */
export function analyzeSentiment(text: string): SentimentResult {
  if (!text || typeof text !== 'string') {
    return { score: 0, magnitude: 0, label: 'neutral' };
  }

  const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;

  for (const word of words) {
    if (POSITIVE_WORDS.has(word)) positiveCount++;
    if (NEGATIVE_WORDS.has(word)) negativeCount++;
  }

  const totalSentimentWords = positiveCount + negativeCount;
  if (totalSentimentWords === 0) {
    return { score: 0, magnitude: 0, label: 'neutral' };
  }

  // Calculate score: range [-1, 1]
  const score = parseFloat(
    ((positiveCount - negativeCount) / totalSentimentWords).toFixed(2)
  );

  // Calculate magnitude: how much sentiment is present
  const magnitude = parseFloat(
    (totalSentimentWords / words.length).toFixed(2)
  );

  // Determine label
  let label: SentimentResult['label'];
  if (positiveCount > 0 && negativeCount > 0) {
    label = 'mixed';
  } else if (score > 0.1) {
    label = 'positive';
  } else if (score < -0.1) {
    label = 'negative';
  } else {
    label = 'neutral';
  }

  return { score, magnitude, label };
}
