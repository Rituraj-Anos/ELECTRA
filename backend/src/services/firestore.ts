/**
 * Firebase Firestore Service
 * Handles all database operations for sessions, conversations,
 * quiz results, and module progress.
 */

import * as admin from 'firebase-admin';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface SessionData {
  id: string;
  country: string;
  knowledgeLevel: 'beginner' | 'intermediate' | 'expert';
  goal: 'register' | 'understand' | 'teach';
  language: string;
  createdAt: Date;
  lastActiveAt: Date;
  completedModules: string[];
  bookmarks: any[];
}

export interface ConversationMessage {
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  translatedContent?: string;
  timestamp: Date;
  moduleContext?: string;
  sources?: any[];
}

export interface QuizResult {
  sessionId: string;
  moduleId: string;
  score: number;
  answers: { questionId: string; correct: boolean; selectedAnswer: string }[];
  completedAt: Date;
}

// ─── Firebase Initialization ───────────────────────────────────────────────────

let db: admin.firestore.Firestore;
let isInitialized = false;

function initFirebase(): void {
  if (isInitialized) return;

  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    }
    db = admin.firestore();
    isInitialized = true;
    console.log('[FIRESTORE] Initialized successfully');
  } catch (error) {
    console.warn('[FIRESTORE] Initialization failed (running without Firebase):', error);
  }
}

// ─── Session Operations ────────────────────────────────────────────────────────

/**
 * Creates or updates a user session in Firestore.
 */
export async function createSession(sessionData: Partial<SessionData>): Promise<string> {
  initFirebase();
  if (!db) throw new Error('Firestore not initialized');

  const sessionRef = db.collection('sessions').doc(sessionData.id || '');
  await sessionRef.set({
    ...sessionData,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastActiveAt: admin.firestore.FieldValue.serverTimestamp(),
    completedModules: sessionData.completedModules || [],
    bookmarks: sessionData.bookmarks || [],
  }, { merge: true });

  return sessionRef.id;
}

/**
 * Retrieves a session by ID.
 */
export async function getSession(sessionId: string): Promise<SessionData | null> {
  initFirebase();
  if (!db) return null;

  try {
    const doc = await db.collection('sessions').doc(sessionId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as SessionData;
  } catch (error) {
    console.error('[FIRESTORE] getSession error:', error);
    return null;
  }
}

/**
 * Updates last active timestamp for a session.
 */
export async function touchSession(sessionId: string): Promise<void> {
  initFirebase();
  if (!db) return;

  await db.collection('sessions').doc(sessionId).update({
    lastActiveAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

/**
 * Marks a module as completed for a session.
 */
export async function completeModule(sessionId: string, moduleId: string): Promise<void> {
  initFirebase();
  if (!db) return;

  await db.collection('sessions').doc(sessionId).update({
    completedModules: admin.firestore.FieldValue.arrayUnion(moduleId),
    lastActiveAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

// ─── Conversation Operations ───────────────────────────────────────────────────

/**
 * Saves a conversation message to Firestore.
 */
export async function saveMessage(
  sessionId: string,
  message: Omit<ConversationMessage, 'sessionId'>
): Promise<string> {
  initFirebase();
  if (!db) return '';

  try {
    const ref = await db.collection('conversations').add({
      sessionId,
      ...message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    console.error('[FIRESTORE] saveMessage error:', error);
    return '';
  }
}

/**
 * Retrieves conversation history for a session.
 */
export async function getConversationHistory(
  sessionId: string,
  limit: number = 20
): Promise<ConversationMessage[]> {
  initFirebase();
  if (!db) return [];

  try {
    const snapshot = await db
      .collection('conversations')
      .where('sessionId', '==', sessionId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs
      .map((doc) => ({ ...doc.data() } as ConversationMessage))
      .reverse();
  } catch (error) {
    console.error('[FIRESTORE] getConversationHistory error:', error);
    return [];
  }
}

// ─── Quiz Operations ───────────────────────────────────────────────────────────

/**
 * Saves a quiz result to Firestore.
 */
export async function saveQuizResult(result: QuizResult): Promise<string> {
  initFirebase();
  if (!db) return '';

  try {
    const ref = await db.collection('quizResults').add({
      ...result,
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Also mark module as completed
    await completeModule(result.sessionId, result.moduleId);

    return ref.id;
  } catch (error) {
    console.error('[FIRESTORE] saveQuizResult error:', error);
    return '';
  }
}

/**
 * Gets quiz results for a session, optionally filtered by module.
 */
export async function getQuizResults(
  sessionId: string,
  moduleId?: string
): Promise<QuizResult[]> {
  initFirebase();
  if (!db) return [];

  try {
    let query = db.collection('quizResults').where('sessionId', '==', sessionId);
    if (moduleId) {
      query = query.where('moduleId', '==', moduleId);
    }

    const snapshot = await query.orderBy('completedAt', 'desc').get();
    return snapshot.docs.map((doc) => doc.data() as QuizResult);
  } catch (error) {
    console.error('[FIRESTORE] getQuizResults error:', error);
    return [];
  }
}

/**
 * Gets top scores for the leaderboard (anonymous).
 */
export async function getLeaderboard(
  moduleId: string,
  limit: number = 10
): Promise<{ score: number; completedAt: Date }[]> {
  initFirebase();
  if (!db) return [];

  try {
    const snapshot = await db
      .collection('quizResults')
      .where('moduleId', '==', moduleId)
      .orderBy('score', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => ({
      score: doc.data().score,
      completedAt: doc.data().completedAt?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error('[FIRESTORE] getLeaderboard error:', error);
    return [];
  }
}
