/**
 * Modules Route — GET /api/modules
 * Serves learning module content filtered by country and knowledge level.
 */

import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

export const modulesRouter = Router();

// ─── Load Module Data ──────────────────────────────────────────────────────────

let modulesData: any[] = [];

function loadModules(): void {
  try {
    const dataPath = path.join(__dirname, '..', 'data', 'modules.json');
    const raw = fs.readFileSync(dataPath, 'utf-8');
    modulesData = JSON.parse(raw);
    console.log(`[MODULES] Loaded ${modulesData.length} learning modules`);
  } catch (error) {
    console.error('[MODULES] Failed to load modules.json:', error);
    modulesData = [];
  }
}

// Load on startup
loadModules();

/**
 * GET /api/modules
 * Query params: country (optional), level (optional)
 */
modulesRouter.get('/modules', (_req: Request, res: Response) => {
  const { country, level } = _req.query;

  let filtered = [...modulesData];

  // Filter by country — show "ALL" modules + country-specific ones
  if (country && typeof country === 'string') {
    filtered = filtered.filter(
      (m) => m.country === 'ALL' || m.country === country.toUpperCase()
    );
  }

  // Filter by knowledge level — adjust content complexity
  if (level && typeof level === 'string') {
    // All modules are available regardless of level
    // Level affects the AI context, not module visibility
  }

  // Sort by order
  filtered.sort((a, b) => a.order - b.order);

  res.json({ modules: filtered });
});

/**
 * GET /api/modules/:id
 * Returns a specific module by ID.
 */
modulesRouter.get('/modules/:id', (req: Request, res: Response) => {
  const moduleId = req.params.id;
  const module = modulesData.find((m) => m.id === moduleId);

  if (!module) {
    res.status(404).json({ error: 'Module not found.' });
    return;
  }

  res.json({ module });
});
