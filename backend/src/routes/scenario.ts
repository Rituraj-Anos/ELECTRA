/**
 * @fileoverview Election Scenario Simulator Route
 * AI-powered "what if" election scenario analysis.
 */

import { Router, Request, Response } from 'express';
import { getAIResponse } from '../services/ai';
import { sanitizeInput } from '../middleware/sanitize';
import type { ChatContext } from '../services/groq';
import { chatRateLimiter } from '../middleware/rateLimit';

export const scenarioRouter = Router();

const PRESET_SCENARIOS = [
  { id: 'no-majority', title: 'What happens if no candidate wins a majority?', description: 'Runoff elections, coalitions, plurality outcomes.', category: 'outcome' },
  { id: 'recount', title: 'How does a recount work?', description: 'Triggers, process, and legal framework.', category: 'process' },
  { id: 'hung-parliament', title: 'What is a hung parliament?', description: 'Coalition building, minority governments.', category: 'outcome' },
  { id: 'tie', title: 'What happens in case of a tie?', description: 'Tie-breaking across electoral systems.', category: 'outcome' },
  { id: 'low-turnout', title: 'What if voter turnout is extremely low?', description: 'Impact on democratic legitimacy.', category: 'participation' },
  { id: 'contested', title: 'How are contested elections resolved?', description: 'Legal challenges and dispute resolution.', category: 'process' },
  { id: 'ranked-choice', title: 'How does ranked-choice voting change outcomes?', description: 'Instant-runoff vs plurality voting.', category: 'system' },
  { id: 'third-party', title: 'Can a third-party candidate actually win?', description: 'Structural barriers and precedents.', category: 'participation' },
];

scenarioRouter.get('/scenarios', (_req: Request, res: Response) => {
  res.json({ scenarios: PRESET_SCENARIOS, totalCount: PRESET_SCENARIOS.length });
});

scenarioRouter.post('/scenario', chatRateLimiter, async (req: Request, res: Response) => {
  const { scenario, country } = req.body;
  if (!scenario || typeof scenario !== 'string') {
    res.status(400).json({ error: 'Scenario description is required.' });
    return;
  }

  const sanitizedScenario = sanitizeInput(scenario);
  const targetCountry = country || 'General';
  const context: ChatContext = { country: targetCountry, knowledgeLevel: 'intermediate', currentModule: 'Scenario Simulator' };

  const prompt = `Explain this election scenario in ${targetCountry}: "${sanitizedScenario}". Include step-by-step process, historical examples, legal framework, and how different systems handle it. Be educational and non-partisan.`;

  try {
    const analysis = await getAIResponse(prompt, context);
    res.json({
      scenario: sanitizedScenario,
      country: targetCountry,
      analysis,
      relatedScenarios: PRESET_SCENARIOS.filter((s) => s.title !== sanitizedScenario).slice(0, 3),
    });
  } catch (error) {
    console.error('[SCENARIO] Error:', error);
    res.status(500).json({ error: 'Scenario simulation failed.' });
  }
});
