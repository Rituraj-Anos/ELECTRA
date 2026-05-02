/**
 * Polling Route — GET /api/polling
 * Searches for nearby polling locations using Google Maps API.
 */

import { Router, Request, Response } from 'express';
import { findPollingLocations } from '../services/maps';

export const pollingRouter = Router();

/**
 * GET /api/polling
 * Query params: address (required)
 */
pollingRouter.get('/polling', async (req: Request, res: Response) => {
  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    res.status(400).json({ error: 'Address is required.' });
    return;
  }

  const cleanAddress = address.trim();
  if (cleanAddress.length < 5) {
    res.status(400).json({ error: 'Please enter a complete address.' });
    return;
  }

  try {
    const locations = await findPollingLocations(cleanAddress);

    res.json({
      address: cleanAddress,
      locations,
      disclaimer: 'Data sourced from available mapping services. Always verify with your local election office before Election Day.',
      mapsEmbedUrl: `https://maps.google.com/maps?q=POLLING+STATION+NEAR+${encodeURIComponent(cleanAddress)}&output=embed`,
    });
  } catch (error) {
    console.error('[POLLING] Route error:', error);
    res.status(500).json({ error: 'Polling location service unavailable.' });
  }
});
