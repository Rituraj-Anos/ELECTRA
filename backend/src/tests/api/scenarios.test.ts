/**
 * @fileoverview Tests for Scenarios API
 */
import request from 'supertest';
import app from '../../index';

describe('GET /api/scenarios', () => {
  it('returns preset scenarios list', async () => {
    const res = await request(app).get('/api/scenarios');
    expect(res.status).toBe(200);
    expect(res.body.scenarios).toBeDefined();
    expect(Array.isArray(res.body.scenarios)).toBe(true);
    expect(res.body.totalCount).toBeGreaterThan(0);
  });

  it('each scenario has required fields', async () => {
    const res = await request(app).get('/api/scenarios');
    for (const scenario of res.body.scenarios) {
      expect(scenario.id).toBeDefined();
      expect(scenario.title).toBeDefined();
      expect(scenario.description).toBeDefined();
      expect(scenario.category).toBeDefined();
    }
  });

  it('has at least 5 preset scenarios', async () => {
    const res = await request(app).get('/api/scenarios');
    expect(res.body.scenarios.length).toBeGreaterThanOrEqual(5);
  });
});

describe('POST /api/scenario', () => {
  it('returns 400 without scenario text', async () => {
    const res = await request(app)
      .post('/api/scenario')
      .send({});
    expect(res.status).toBe(400);
  });

  it('returns 400 with non-string scenario', async () => {
    const res = await request(app)
      .post('/api/scenario')
      .send({ scenario: 123 });
    expect(res.status).toBe(400);
  });
});
