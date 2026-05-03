/**
 * @fileoverview Voter Readiness Checklist Route
 * Provides a dynamic checklist for voting preparation.
 * Users can track their readiness steps for election day.
 */

import { Router, Request, Response } from 'express';

export const checklistRouter = Router();

/**
 * @description Default checklist items for voter readiness.
 * Each item represents a key preparation step for voting.
 */
const DEFAULT_CHECKLIST = [
  { id: 'check-registration', label: 'Check voter registration status', completed: false, category: 'preparation', icon: '📋' },
  { id: 'find-polling', label: 'Find your polling booth / voting location', completed: false, category: 'preparation', icon: '📍' },
  { id: 'understand-ballot', label: 'Understand your ballot and voting options', completed: false, category: 'education', icon: '📄' },
  { id: 'know-candidates', label: 'Research candidates and their platforms', completed: false, category: 'education', icon: '👥' },
  { id: 'check-id', label: 'Ensure you have valid photo ID', completed: false, category: 'documents', icon: '🪪' },
  { id: 'plan-transport', label: 'Plan your transportation to the polling station', completed: false, category: 'logistics', icon: '🚗' },
  { id: 'check-hours', label: 'Check polling station hours', completed: false, category: 'logistics', icon: '⏰' },
  { id: 'absentee-check', label: 'Apply for absentee/mail-in ballot if needed', completed: false, category: 'preparation', icon: '📮' },
  { id: 'voting-day-plan', label: 'Create your voting day plan', completed: false, category: 'logistics', icon: '📅' },
  { id: 'tell-friends', label: 'Encourage friends and family to vote', completed: false, category: 'civic', icon: '🗣️' },
];

// In-memory store per session (production would use MongoDB/Firestore)
const checklistStore = new Map<string, typeof DEFAULT_CHECKLIST>();

/**
 * @description GET /api/checklist/:userId — Get user's checklist.
 * Returns the voter readiness checklist for a given user, or defaults.
 * @param {string} userId - User identifier (from path param)
 * @returns {Object[]} Array of checklist items with completion status
 */
checklistRouter.get('/checklist/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId || typeof userId !== 'string') {
    res.status(400).json({ error: 'User ID is required.' });
    return;
  }

  // Return user's checklist or create from defaults
  if (!checklistStore.has(userId)) {
    checklistStore.set(userId, JSON.parse(JSON.stringify(DEFAULT_CHECKLIST)));
  }

  const checklist = checklistStore.get(userId)!;
  const completedCount = checklist.filter((item) => item.completed).length;

  res.json({
    userId,
    items: checklist,
    progress: {
      completed: completedCount,
      total: checklist.length,
      percentage: Math.round((completedCount / checklist.length) * 100),
    },
  });
});

/**
 * @description POST /api/checklist/update — Toggle a checklist item.
 * Marks a specific checklist item as completed or uncompleted.
 * @param {string} userId - User identifier
 * @param {string} itemId - Checklist item ID to toggle
 * @returns {Object} Updated checklist with progress
 */
checklistRouter.post('/checklist/update', (req: Request, res: Response) => {
  const { userId, itemId, completed } = req.body;

  if (!userId || !itemId) {
    res.status(400).json({ error: 'userId and itemId are required.' });
    return;
  }

  // Initialize if not exists
  if (!checklistStore.has(userId)) {
    checklistStore.set(userId, JSON.parse(JSON.stringify(DEFAULT_CHECKLIST)));
  }

  const checklist = checklistStore.get(userId)!;
  const item = checklist.find((i) => i.id === itemId);

  if (!item) {
    res.status(404).json({ error: `Checklist item '${itemId}' not found.` });
    return;
  }

  // Toggle or set explicitly
  item.completed = typeof completed === 'boolean' ? completed : !item.completed;

  const completedCount = checklist.filter((i) => i.completed).length;

  res.json({
    success: true,
    item,
    progress: {
      completed: completedCount,
      total: checklist.length,
      percentage: Math.round((completedCount / checklist.length) * 100),
    },
  });
});
