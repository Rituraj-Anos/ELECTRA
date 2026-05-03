/**
 * @fileoverview Firebase Authentication Middleware
 * Verifies Firebase ID tokens from the Authorization header.
 * Falls back to anonymous user if token is missing or invalid.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * @description Authenticate requests using Firebase ID tokens.
 * In development mode, assigns a dev user. In production, verifies the Bearer token
 * via Firebase Admin SDK. Falls back to anonymous user on failure.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (process.env.NODE_ENV === 'development') {
    (req as any).uid = 'dev-user';
    (req as any).sessionId = 'dev-session';
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    (req as any).uid = 'anon-' + Date.now();
    (req as any).sessionId = 'anonymous';
    return next();
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const admin = await import('firebase-admin');
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    (req as any).uid = decodedToken.uid;
    (req as any).sessionId = decodedToken.uid;
    next();
  } catch (error) {
    console.error('[AUTH] Token verification failed - allowing anyway:', error);
    (req as any).uid = 'anon-fallback';
    (req as any).sessionId = 'anonymous';
    next();
  }
};
