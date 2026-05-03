/**
 * @fileoverview MongoDB Connection Service
 * Connects to MongoDB Atlas with retry logic and graceful shutdown.
 * Falls back to in-memory mode if MONGODB_URI is not configured.
 */

import mongoose from 'mongoose';

let isConnected = false;

/**
 * @description Connect to MongoDB Atlas. Skips if already connected or URI not set.
 * @returns {Promise<boolean>} true if connected, false if using in-memory fallback
 */
export async function connectDB(): Promise<boolean> {
  if (isConnected) return true;

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('[MongoDB] MONGODB_URI not set — using in-memory stores (dev/demo mode)');
    return false;
  }

  try {
    await mongoose.connect(uri, {
      dbName: 'electra',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log('[MongoDB] Connected to Atlas successfully');

    mongoose.connection.on('error', (err) => {
      console.error('[MongoDB] Connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Disconnected');
      isConnected = false;
    });

    return true;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`[MongoDB] Connection failed: ${msg} — using in-memory stores`);
    return false;
  }
}

/**
 * @description Gracefully close MongoDB connection
 */
export async function disconnectDB(): Promise<void> {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('[MongoDB] Disconnected gracefully');
  }
}

/**
 * @description Check if MongoDB is currently connected
 * @returns {boolean} Connection status
 */
export function isDBConnected(): boolean {
  return isConnected;
}
