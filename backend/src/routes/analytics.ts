/**
 * @fileoverview User Analytics & Insights Route
 * Tracks per-user learning analytics: modules completed, quiz scores,
 * questions asked, time spent, and language preferences.
 */

import { Router, Request, Response } from 'express';

export const analyticsRouter = Router();

// In-memory analytics store (production would use MongoDB/Firestore)
const analyticsStore = new Map<string, {
  questionsAsked: number;
  modulesViewed: string[];
  quizScores: { moduleId: string; score: number; total: number; date: string }[];
  languagesUsed: string[];
  firstSeen: string;
  lastSeen: string;
  totalSessions: number;
}>();

/**
 * @description Track a user event (called internally by other routes)
 */
export function trackEvent(userId: string, event: string, data?: Record<string, any>): void {
  if (!analyticsStore.has(userId)) {
    analyticsStore.set(userId, {
      questionsAsked: 0,
      modulesViewed: [],
      quizScores: [],
      languagesUsed: ['en'],
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      totalSessions: 1,
    });
  }

  const record = analyticsStore.get(userId)!;
  record.lastSeen = new Date().toISOString();

  switch (event) {
    case 'chat_message':
      record.questionsAsked++;
      break;
    case 'module_view':
      if (data?.moduleId && !record.modulesViewed.includes(data.moduleId)) {
        record.modulesViewed.push(data.moduleId);
      }
      break;
    case 'quiz_complete':
      if (data?.moduleId) {
        record.quizScores.push({
          moduleId: data.moduleId,
          score: data.score || 0,
          total: data.total || 0,
          date: new Date().toISOString(),
        });
      }
      break;
    case 'language_change':
      if (data?.language && !record.languagesUsed.includes(data.language)) {
        record.languagesUsed.push(data.language);
      }
      break;
    case 'session_start':
      record.totalSessions++;
      break;
  }
}

/**
 * @description GET /api/analytics/insights/:userId — Get user analytics.
 * Returns comprehensive learning insights for a specific user.
 */
analyticsRouter.get('/analytics/insights/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).json({ error: 'User ID is required.' });
    return;
  }

  const record = analyticsStore.get(userId as string);

  if (!record) {
    // Return empty analytics for new users
    res.json({
      userId,
      questionsAsked: 0,
      modulesCompleted: 0,
      modulesViewed: [],
      quizScores: [],
      averageQuizScore: 0,
      languagesUsed: ['en'],
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      totalSessions: 0,
      engagementLevel: 'new',
    });
    return;
  }

  // Calculate average quiz score
  const avgScore = record.quizScores.length > 0
    ? Math.round(record.quizScores.reduce((sum, q) => sum + (q.score / q.total) * 100, 0) / record.quizScores.length)
    : 0;

  // Determine engagement level
  let engagementLevel: string;
  if (record.questionsAsked >= 20 && record.modulesViewed.length >= 3) {
    engagementLevel = 'power_user';
  } else if (record.questionsAsked >= 5) {
    engagementLevel = 'active';
  } else if (record.questionsAsked >= 1) {
    engagementLevel = 'engaged';
  } else {
    engagementLevel = 'new';
  }

  res.json({
    userId,
    questionsAsked: record.questionsAsked,
    modulesCompleted: record.modulesViewed.length,
    modulesViewed: record.modulesViewed,
    quizScores: record.quizScores,
    averageQuizScore: avgScore,
    languagesUsed: record.languagesUsed,
    firstSeen: record.firstSeen,
    lastSeen: record.lastSeen,
    totalSessions: record.totalSessions,
    engagementLevel,
  });
});
