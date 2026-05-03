/**
 * @fileoverview Personalized Voting Journey Route
 * Generates a personalized step-by-step voting journey for each user
 * based on their country, state, and experience level.
 */

import { Router, Request, Response } from 'express';
import { getAIResponse } from '../services/ai';
import type { ChatContext } from '../services/groq';

export const journeyRouter = Router();

/**
 * @description Default journey templates per country.
 * Used as fallback if AI generation fails.
 */
const JOURNEY_TEMPLATES: Record<string, { title: string; description: string; icon: string }[]> = {
  default: [
    { title: 'Check Your Eligibility', description: 'Verify you meet the age, citizenship, and residency requirements for voter registration in your area.', icon: '✅' },
    { title: 'Register to Vote', description: 'Complete your voter registration through your official election commission website or local registration office.', icon: '📝' },
    { title: 'Learn About Candidates', description: 'Research candidates, their platforms, and positions on issues that matter to you using non-partisan voter guides.', icon: '🔍' },
    { title: 'Understand Your Ballot', description: 'Review a sample ballot to familiarize yourself with the format, races, and measures you will vote on.', icon: '📋' },
    { title: 'Plan Your Vote', description: 'Find your polling location, check hours, plan transportation, and decide whether to vote in-person, early, or by mail.', icon: '📍' },
    { title: 'Cast Your Vote', description: 'Head to your polling station with valid ID, review your ballot carefully, and submit your vote. Encourage others to vote!', icon: '🗳️' },
  ],
  US: [
    { title: 'Check Your Eligibility', description: 'You must be a U.S. citizen, 18+ years old, and meet your state\'s residency requirements. Visit vote.gov to check.', icon: '✅' },
    { title: 'Register to Vote', description: 'Register online at vote.gov, by mail, or at your DMV. Deadlines vary by state — some allow same-day registration.', icon: '📝' },
    { title: 'Research Your Ballot', description: 'Use Ballotpedia or Vote411.org to preview your ballot. Research candidates for federal, state, and local races.', icon: '🔍' },
    { title: 'Choose Your Voting Method', description: 'Decide between in-person, early voting, or absentee/mail-in ballot. Check your state\'s options and deadlines.', icon: '📮' },
    { title: 'Prepare for Election Day', description: 'Find your polling place at vote.org, bring valid ID (requirements vary by state), and plan your schedule.', icon: '📍' },
    { title: 'Vote & Share', description: 'Cast your ballot, get your "I Voted" sticker, and encourage friends and family to participate in democracy!', icon: '🗳️' },
  ],
  IN: [
    { title: 'Check Your Eligibility', description: 'You must be an Indian citizen, 18+ on the qualifying date, and a resident of the constituency. Visit nvsp.in.', icon: '✅' },
    { title: 'Get Your Voter ID (EPIC)', description: 'Apply for your Electors Photo Identity Card through nvsp.in or your local ERO office. You need Form 6.', icon: '🪪' },
    { title: 'Verify Your Electoral Roll', description: 'Check your name on the electoral roll at eci.gov.in or nvsp.in. Ensure your details are correct.', icon: '🔍' },
    { title: 'Know Your Candidates', description: 'Research candidates and parties. Check affidavits on MyNeta.info and the ECI website for declarations.', icon: '📋' },
    { title: 'Find Your Polling Booth', description: 'Locate your assigned polling booth using the Voter Helpline app or visiting ceoapplication websites.', icon: '📍' },
    { title: 'Cast Your Vote', description: 'Bring your EPIC or valid ID to the booth. Use the EVM (Electronic Voting Machine). Verify with VVPAT slip.', icon: '🗳️' },
  ],
  GB: [
    { title: 'Check Your Eligibility', description: 'British, Irish, or qualifying Commonwealth/EU citizens aged 18+ (16 in Scotland/Wales for devolved elections).', icon: '✅' },
    { title: 'Register to Vote', description: 'Register online at gov.uk/register-to-vote. You need your National Insurance number. Deadline is usually 12 working days before an election.', icon: '📝' },
    { title: 'Understand the Electoral System', description: 'UK uses First Past the Post for general elections. Scotland, Wales, and NI use additional systems for devolved elections.', icon: '🏛️' },
    { title: 'Research Candidates & Manifestos', description: 'Read party manifestos and candidate statements. Check the Electoral Commission website for impartial guidance.', icon: '🔍' },
    { title: 'Choose Your Voting Method', description: 'Vote in person at your polling station, by post (apply early), or appoint a proxy. Photo ID is now required in England.', icon: '📮' },
    { title: 'Vote on Election Day', description: 'Polling stations open 7am-10pm. Bring photo ID (England), mark your ballot with an X, and fold it into the ballot box.', icon: '🗳️' },
  ],
};

/**
 * @description GET /api/journey/:userId — Get personalized voting journey.
 * Returns a 6-step journey tailored to the user's country and experience level.
 * @param {string} userId - User identifier
 * @query {string} country - Country code (US, IN, GB, etc.)
 * @query {string} level - Knowledge level (beginner, intermediate, expert)
 * @returns {Object} Personalized journey steps with progress tracking
 */
journeyRouter.get('/journey/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const country = (req.query.country as string) || 'US';
  const level = (req.query.level as string) || 'beginner';

  if (!userId) {
    res.status(400).json({ error: 'User ID is required.' });
    return;
  }

  // Use country-specific template or default
  const steps = JOURNEY_TEMPLATES[country] || JOURNEY_TEMPLATES['default'];

  // Try to get AI-enhanced descriptions for the user's level
  let enhancedSteps = steps;
  try {
    const context: ChatContext = {
      country,
      knowledgeLevel: level as 'beginner' | 'intermediate' | 'expert',
      currentModule: 'Voting Journey',
    };

    const aiPrompt = `Generate a brief, encouraging, one-sentence tip for someone at the "${level}" level preparing to vote in ${country}. Focus on the most important thing they should know right now.`;
    const aiTip = await getAIResponse(aiPrompt, context);

    enhancedSteps = steps.map((step, index) => ({
      ...step,
      stepNumber: index + 1,
    }));

    res.json({
      userId,
      country,
      level,
      steps: enhancedSteps,
      aiTip: aiTip || undefined,
      totalSteps: steps.length,
    });
  } catch {
    // Fallback without AI enhancement
    res.json({
      userId,
      country,
      level,
      steps: steps.map((step, index) => ({ ...step, stepNumber: index + 1 })),
      totalSteps: steps.length,
    });
  }
});
