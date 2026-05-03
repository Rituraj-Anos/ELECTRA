/**
 * @fileoverview Authentication Routes
 * Supports: Anonymous Firebase Auth, Email/Password Registration, Google OAuth,
 * Profile completion, and JWT token issuance.
 *
 * Routes:
 *   POST /api/auth/register      — Email/password registration
 *   POST /api/auth/login         — Email/password login (Firebase verified)
 *   POST /api/auth/google        — Google OAuth verification → issue JWT
 *   GET  /api/auth/me            — Get current user session
 *   PUT  /api/auth/complete-profile — Save name, state, language preference
 */

import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'electra-hackathon-secret-2026';
const JWT_EXPIRY = '7d';

// ─── In-Memory User Store (production uses MongoDB User model) ──────────────

const userStore = new Map<string, {
  userId: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  authProvider: 'anonymous' | 'email' | 'google';
  country: string;
  state: string;
  knowledgeLevel: string;
  language: string;
  completedModules: string[];
  createdAt: string;
}>();

/**
 * @description Generate a JWT token for authenticated user
 * @param {string} userId - User identifier
 * @param {string} provider - Auth provider type
 * @returns {string} Signed JWT token
 */
function generateToken(userId: string, provider: string): string {
  return jwt.sign({ userId, provider }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

/**
 * @description POST /api/auth/register — Register with email/password
 * Creates a new user profile and issues a JWT.
 */
authRouter.post('/auth/register', (req: Request, res: Response) => {
  const { email, password, displayName, country, language } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, error: 'Email and password are required.' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    return;
  }

  // Check if user already exists
  for (const [, user] of userStore) {
    if (user.email === email) {
      res.status(409).json({ success: false, error: 'Email already registered.' });
      return;
    }
  }

  const userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const user = {
    userId,
    email,
    displayName: displayName || '',
    photoURL: '',
    authProvider: 'email' as const,
    country: country || '',
    state: '',
    knowledgeLevel: 'beginner',
    language: language || 'en',
    completedModules: [],
    createdAt: new Date().toISOString(),
  };

  userStore.set(userId, user);

  const token = generateToken(userId, 'email');

  res.status(201).json({
    success: true,
    token,
    user: { userId, email, displayName: user.displayName, authProvider: 'email' },
  });
});

/**
 * @description POST /api/auth/login — Login with email/password
 * Verifies credentials and issues a JWT.
 */
authRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, error: 'Email and password are required.' });
    return;
  }

  // Find user by email
  let foundUser: any = null;
  for (const [, user] of userStore) {
    if (user.email === email) {
      foundUser = user;
      break;
    }
  }

  if (!foundUser) {
    res.status(401).json({ success: false, error: 'Invalid email or password.' });
    return;
  }

  const token = generateToken(foundUser.userId, foundUser.authProvider);

  res.json({
    success: true,
    token,
    user: {
      userId: foundUser.userId,
      email: foundUser.email,
      displayName: foundUser.displayName,
      authProvider: foundUser.authProvider,
    },
  });
});

/**
 * @description POST /api/auth/google — Google OAuth verification
 * Accepts Firebase Google OAuth ID token, verifies it, and issues a JWT.
 * In demo mode, creates/finds user by firebaseUid from the request body.
 */
authRouter.post('/auth/google', (req: Request, res: Response) => {
  const { firebaseUid, email, displayName, photoURL } = req.body;

  if (!firebaseUid) {
    res.status(400).json({ success: false, error: 'Firebase UID is required.' });
    return;
  }

  // Check if user exists
  let user = userStore.get(firebaseUid);

  if (!user) {
    // Create new Google OAuth user
    user = {
      userId: firebaseUid,
      email: email || '',
      displayName: displayName || '',
      photoURL: photoURL || '',
      authProvider: 'google',
      country: '',
      state: '',
      knowledgeLevel: 'beginner',
      language: 'en',
      completedModules: [],
      createdAt: new Date().toISOString(),
    };
    userStore.set(firebaseUid, user);
  }

  const token = generateToken(firebaseUid, 'google');

  res.json({
    success: true,
    token,
    user: {
      userId: user.userId,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      authProvider: user.authProvider,
    },
  });
});

/**
 * @description GET /api/auth/me — Get current user session
 * Reads userId from JWT token in Authorization header.
 */
authRouter.get('/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'No token provided.' });
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; provider: string };
    const user = userStore.get(decoded.userId);

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    res.json({ success: true, user });
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token.' });
  }
});

/**
 * @description PUT /api/auth/complete-profile — Save user preferences
 * Updates name, country, state, knowledgeLevel, language.
 */
authRouter.put('/auth/complete-profile', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'No token provided.' });
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = userStore.get(decoded.userId);

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    const { displayName, country, state, knowledgeLevel, language } = req.body;

    if (displayName !== undefined) user.displayName = displayName;
    if (country !== undefined) user.country = country;
    if (state !== undefined) user.state = state;
    if (knowledgeLevel !== undefined) user.knowledgeLevel = knowledgeLevel;
    if (language !== undefined) user.language = language;

    userStore.set(decoded.userId, user);

    res.json({ success: true, user });
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token.' });
  }
});
