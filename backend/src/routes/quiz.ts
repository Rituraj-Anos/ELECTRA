/**
 * Quiz Route — POST /api/quiz/submit
 * Handles quiz answer submission, scoring, and result persistence.
 */

import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { sanitizeSessionId } from '../middleware/sanitize';
import * as firestoreService from '../services/firestore';
import * as fs from 'fs';
import * as path from 'path';

export const quizRouter = Router();

// Load modules data for quiz questions
let modulesData: any[] = [];

function loadModules(): void {
  try {
    const dataPath = path.join(__dirname, '..', 'data', 'modules.json');
    const raw = fs.readFileSync(dataPath, 'utf-8');
    modulesData = JSON.parse(raw);
  } catch (error) {
    console.error('[QUIZ] Failed to load modules.json:', error);
  }
}

loadModules();

/**
 * POST /api/quiz/submit
 * Submits quiz answers and returns score + feedback.
 */
quizRouter.post('/quiz/submit', authMiddleware, quizSubmitHandler);

/**
 * POST /api/quiz/:moduleId/submit
 * Same handler, moduleId from URL param (frontend uses this path).
 */
quizRouter.post('/quiz/:moduleId/submit', authMiddleware, quizSubmitHandler);

/** Shared submit handler */
async function quizSubmitHandler(req: Request, res: Response) {
  const moduleId = req.params.moduleId || req.body.moduleId;
  const { sessionId, answers } = req.body;

  // Validate inputs
  if (!moduleId || typeof moduleId !== 'string') {
    res.status(400).json({ error: 'Module ID is required.' });
    return;
  }

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    res.status(400).json({ error: 'Answers array is required.' });
    return;
  }

  // Find the module and its quiz questions
  const module = modulesData.find((m) => m.id === moduleId);
  if (!module || !module.quizQuestions) {
    res.status(404).json({ error: 'Module or quiz questions not found.' });
    return;
  }

  const questions = module.quizQuestions;

  // Score the quiz
  const feedback: any[] = [];
  let correctCount = 0;

  for (const answer of answers) {
    const question = questions.find((q: any) => q.id === answer.questionId);
    if (!question) continue;

    const isCorrect = answer.selectedAnswer === question.correctAnswer;
    if (isCorrect) correctCount++;

    feedback.push({
      questionId: question.id,
      question: question.question,
      selectedAnswer: answer.selectedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      explanation: question.explanation,
    });
  }

  const totalQuestions = questions.length;
  const score = Math.round((correctCount / totalQuestions) * 100);

  // Determine performance label
  let performanceLabel: string;
  if (score === 100) performanceLabel = 'Election Expert!';
  else if (score >= 60) performanceLabel = 'Well Done!';
  else performanceLabel = 'Keep Studying!';

  // Save to Firestore
  const cleanSessionId = sanitizeSessionId(sessionId || '');
  if (cleanSessionId) {
    firestoreService.saveQuizResult({
      sessionId: cleanSessionId,
      moduleId,
      score,
      answers: feedback.map((f) => ({
        questionId: f.questionId,
        correct: f.isCorrect,
        selectedAnswer: f.selectedAnswer,
      })),
      completedAt: new Date(),
    }).catch((err) => console.error('[QUIZ] Failed to save result:', err));
  }

  res.json({
    score,
    correctCount,
    totalQuestions,
    performanceLabel,
    feedback,
  });
}

/**
 * GET /api/quiz/:moduleId/full
 * Returns quiz questions WITH correct answers (for client-side scoring fallback).
 * Must be registered BEFORE the /:moduleId catch-all.
 */
quizRouter.get('/quiz/:moduleId/full', (req: Request, res: Response) => {
  const { moduleId } = req.params;
  const module = modulesData.find((m) => m.id === moduleId);

  if (!module || !module.quizQuestions) {
    res.status(404).json({ error: 'Quiz not found for this module.' });
    return;
  }

  const questions = module.quizQuestions.map((q: any) => ({
    id: q.id,
    question: q.question,
    type: q.type,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
  }));

  res.json({
    moduleId,
    moduleTitle: module.title,
    questionCount: questions.length,
    questions,
  });
});

/**
 * GET /api/quiz/:moduleId
 * Returns quiz questions for a specific module (no answers — display only).
 */
quizRouter.get('/quiz/:moduleId', (req: Request, res: Response) => {
  const { moduleId } = req.params;
  const module = modulesData.find((m) => m.id === moduleId);

  if (!module || !module.quizQuestions) {
    res.status(404).json({ error: 'Quiz not found for this module.' });
    return;
  }

  // Send questions without correct answers (prevent cheating)
  const questions = module.quizQuestions.map((q: any) => ({
    id: q.id,
    question: q.question,
    type: q.type,
    options: q.options,
    // Do NOT include: correctAnswer, explanation
  }));

  res.json({
    moduleId,
    moduleTitle: module.title,
    questionCount: questions.length,
    estimatedTime: '2 minutes',
    questions,
  });
});

/**
 * GET /api/quiz/leaderboard/:moduleId
 * Returns anonymous top scores for a module.
 */
quizRouter.get('/quiz/leaderboard/:moduleId', async (req: Request, res: Response) => {
  const { moduleId } = req.params;

  try {
    const leaderboard = await firestoreService.getLeaderboard(moduleId as string, 10);
    res.json({ moduleId, leaderboard });
  } catch (error) {
    console.error('[QUIZ] Leaderboard error:', error);
    res.json({ moduleId, leaderboard: [] });
  }
});
