import request from 'supertest';
import app from '../../index';

describe('GET /api/modules', () => {
  it('returns 200 with modules', async () => {
    const res = await request(app).get('/api/modules');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('modules');
    expect(Array.isArray(res.body.modules)).toBe(true);
  });

  it('returns modules with required fields', async () => {
    const res = await request(app).get('/api/modules');
    expect(res.body.modules.length).toBeGreaterThan(0);
    expect(res.body.modules[0]).toHaveProperty('id');
    expect(res.body.modules[0]).toHaveProperty('title');
    expect(res.body.modules[0]).toHaveProperty('description');
  });

  it('filters by country parameter', async () => {
    const res = await request(app).get('/api/modules?country=US');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.modules)).toBe(true);
  });

  it('filters by level parameter', async () => {
    const res = await request(app).get('/api/modules?level=beginner');
    expect(res.status).toBe(200);
  });
});
