/**
 * @fileoverview Tests for Sentiment Analysis Service
 */
import { analyzeSentiment } from '../../services/sentiment';

describe('analyzeSentiment()', () => {
  it('returns neutral for empty input', () => {
    const result = analyzeSentiment('');
    expect(result.label).toBe('neutral');
    expect(result.score).toBe(0);
  });

  it('detects positive sentiment', () => {
    const result = analyzeSentiment('This is great and amazing, thank you!');
    expect(result.label).toBe('positive');
    expect(result.score).toBeGreaterThan(0);
  });

  it('detects negative sentiment', () => {
    const result = analyzeSentiment('This is terrible and awful');
    expect(result.label).toBe('negative');
    expect(result.score).toBeLessThan(0);
  });

  it('detects mixed sentiment', () => {
    const result = analyzeSentiment('The process is great but the wait was terrible');
    expect(result.label).toBe('mixed');
  });

  it('returns neutral for factual question', () => {
    const result = analyzeSentiment('How do I register to vote in California?');
    expect(result.label).toBe('neutral');
  });

  it('handles non-string input gracefully', () => {
    const result = analyzeSentiment(null as any);
    expect(result.label).toBe('neutral');
    expect(result.score).toBe(0);
  });
});
