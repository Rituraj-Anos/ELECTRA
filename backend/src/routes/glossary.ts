/**
 * Glossary Route — GET /api/glossary
 * Serves civic/election glossary terms.
 */

import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { getCached, setCached } from '../services/cache';

export const glossaryRouter = Router();

let glossaryData: any[] = [];

function loadGlossary(): void {
  try {
    const dataPath = path.join(__dirname, '..', 'data', 'glossary.json');
    const raw = fs.readFileSync(dataPath, 'utf-8');
    glossaryData = JSON.parse(raw);
    console.log(`[GLOSSARY] Loaded ${glossaryData.length} terms`);
  } catch (error) {
    console.error('[GLOSSARY] Failed to load glossary.json:', error);
    glossaryData = [];
  }
}

loadGlossary();

/**
 * GET /api/glossary
 * Query params: search (optional), category (optional)
 */
glossaryRouter.get('/glossary', (_req: Request, res: Response) => {
  const { search, category } = _req.query;
  const cacheKey = `glossary_${search || 'all'}_${category || 'all'}`;

  const cached = getCached<any>(cacheKey);
  if (cached) {
    res.json(cached);
    return;
  }

  let filtered = [...glossaryData];

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.term?.toLowerCase().includes(q) ||
        t.definition?.toLowerCase().includes(q)
    );
  }

  if (category && typeof category === 'string') {
    filtered = filtered.filter((t) => t.category === category);
  }

  filtered.sort((a, b) => (a.term || '').localeCompare(b.term || ''));

  const result = { terms: filtered };
  setCached(cacheKey, result, 86400);
  res.json(result);
});

/**
 * GET /api/glossary/:id
 */
glossaryRouter.get('/glossary/:id', (req: Request, res: Response) => {
  const term = glossaryData.find((t) => t.id === req.params.id);
  if (!term) {
    res.status(404).json({ error: 'Term not found.' });
    return;
  }
  res.json({ term });
});
