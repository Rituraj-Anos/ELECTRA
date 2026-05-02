/**
 * Timeline Route — GET /api/timeline
 * Serves election timeline data for different countries and election types.
 */

import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

export const timelineRouter = Router();

// ─── Load Timeline Data ────────────────────────────────────────────────────────

let timelinesData: Record<string, any> = {};

function loadTimelines(): void {
  try {
    const dataPath = path.join(__dirname, '..', 'data', 'timelines.json');
    const raw = fs.readFileSync(dataPath, 'utf-8');
    timelinesData = JSON.parse(raw);
    console.log('[TIMELINE] Loaded timeline data');
  } catch (error) {
    console.error('[TIMELINE] Failed to load timelines.json:', error);
  }
}

loadTimelines();

/**
 * GET /api/timeline
 * Query params: country (required), electionType (optional)
 */
timelineRouter.get('/timeline', (req: Request, res: Response) => {
  const { country, electionType } = req.query;

  if (!country || typeof country !== 'string') {
    res.status(400).json({ error: 'Country code is required.' });
    return;
  }

  const countryUpper = country.toUpperCase();
  const type = (electionType as string) || 'presidential';

  // Look up timeline data
  const key = `${countryUpper}_${type}`;
  const timelineEvents = timelinesData[key] || timelinesData[`${countryUpper}_general`] || [];

  if (timelineEvents.length === 0) {
    // Return a generic timeline structure
    res.json({
      country: countryUpper,
      electionType: type,
      events: getGenericTimeline(type),
      note: 'This is a generic timeline. Country-specific data may not be available.',
    });
    return;
  }

  res.json({
    country: countryUpper,
    electionType: type,
    events: timelineEvents,
  });
});

/**
 * Returns a generic election timeline when country-specific data is unavailable.
 */
function getGenericTimeline(electionType: string): any[] {
  return [
    {
      id: 'reg_open',
      title: 'Voter Registration Opens',
      description: 'Citizens can register or update their voter registration.',
      dateRange: '12-6 months before Election Day',
      category: 'registration',
      status: 'upcoming',
      order: 1,
    },
    {
      id: 'reg_deadline',
      title: 'Registration Deadline',
      description: 'Last day to register or update voter information.',
      dateRange: '30-15 days before Election Day',
      category: 'registration',
      status: 'upcoming',
      order: 2,
    },
    {
      id: 'campaign_period',
      title: 'Campaign Period',
      description: 'Candidates conduct rallies, debates, and advertising campaigns.',
      dateRange: '6-1 months before Election Day',
      category: 'campaigning',
      status: 'upcoming',
      order: 3,
    },
    {
      id: 'early_voting',
      title: 'Early Voting Period',
      description: 'Eligible voters can cast ballots before the official Election Day.',
      dateRange: '2-1 weeks before Election Day',
      category: 'voting',
      status: 'upcoming',
      order: 4,
    },
    {
      id: 'election_day',
      title: 'Election Day',
      description: 'The official day of voting. Polls open in the morning and close in the evening.',
      dateRange: 'Election Day',
      category: 'voting',
      status: 'upcoming',
      order: 5,
    },
    {
      id: 'counting',
      title: 'Vote Counting',
      description: 'Ballots are counted by election officials with observers present.',
      dateRange: 'Election Day - days after',
      category: 'counting',
      status: 'upcoming',
      order: 6,
    },
    {
      id: 'results',
      title: 'Preliminary Results',
      description: 'Initial results are announced based on counted ballots.',
      dateRange: 'Election Day evening - days after',
      category: 'counting',
      status: 'upcoming',
      order: 7,
    },
    {
      id: 'certification',
      title: 'Results Certification',
      description: 'Official results are certified by the election authority.',
      dateRange: '1-4 weeks after Election Day',
      category: 'certification',
      status: 'upcoming',
      order: 8,
    },
    {
      id: 'transition',
      title: 'Transition of Power',
      description: 'The winning candidate or party prepares to take office.',
      dateRange: 'Weeks-months after certification',
      category: 'certification',
      status: 'upcoming',
      order: 9,
    },
  ];
}
