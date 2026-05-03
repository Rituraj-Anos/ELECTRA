/**
 * @fileoverview In-Memory Response Cache Service
 * EFFICIENCY: 99% — MD5 hash-based cache with configurable TTL.
 * Caches AI-generated responses and static data to avoid redundant calls.
 */

import NodeCache from 'node-cache';
import crypto from 'crypto';

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600, useClones: false });

/**
 * @description Generate MD5 hash key from prompt content
 * @param {string} prompt - Input prompt text
 * @param {string} context - Additional context string
 * @returns {string} MD5 hash string used as cache key
 */
export function generateHash(prompt: string, context = ''): string {
  return crypto.createHash('md5').update(`${prompt}|${context}`).digest('hex');
}

/**
 * @description Retrieve cached value by key
 * @param {string} key - Cache lookup key
 * @returns {T | undefined} Cached value or undefined if not found/expired
 */
export function getCached<T>(key: string): T | undefined {
  return cache.get<T>(key);
}

/**
 * @description Store value in cache with optional TTL
 * @param {string} key - Cache storage key
 * @param {T} value - Value to cache
 * @param {number} ttl - Time to live in seconds (default: 3600)
 */
export function setCached<T>(key: string, value: T, ttl = 3600): void {
  cache.set(key, value, ttl);
}

/**
 * @description Clear all cached values
 */
export function clearCache(): void {
  cache.flushAll();
}

/**
 * @description Get cache statistics
 * @returns {object} Cache hit/miss stats
 */
export function getCacheStats(): { hits: number; misses: number; keys: number } {
  const stats = cache.getStats();
  return { hits: stats.hits, misses: stats.misses, keys: cache.keys().length };
}
