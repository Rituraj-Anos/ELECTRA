import { Request, Response, NextFunction } from 'express';

/**
 * Firebase Authentication Middleware
 * Verifies Firebase ID tokens from anonymous auth sessions.
 * In development mode, allows requests without valid tokens for easier testing.
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Skip auth in development for easier testing
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid authorization header' });
    return;
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    // Dynamic import to avoid initialization issues when Firebase is not configured
    const admin = await import('firebase-admin');
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Attach session info to request
    (req as any).uid = decodedToken.uid;
    (req as any).sessionId = decodedToken.uid;
    
    next();
  } catch (error) {
    console.error('[AUTH] Token verification failed:', error);
    res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
};
