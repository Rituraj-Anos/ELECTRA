import request from 'supertest';
import app from '../../index';

describe('GET /api/glossary', () => {
  it('returns 200 status', async () => {
    const res = await request(app).get('/api/glossary');
    expect(res.status).toBe(200);
  });

  it('returns object with terms array', async () => {
    const res = await request(app).get('/api/glossary');
    expect(res.body).toHaveProperty('terms');
    expect(Array.isArray(res.body.terms)).toBe(true);
    expect(res.body.terms.length).toBeGreaterThan(10);
  });

  it('each term has required fields', async () => {
    const res = await request(app).get('/api/glossary');
    const term = res.body.terms[0];
    expect(term).toHaveProperty('term');
    expect(term).toHaveProperty('definition');
  });

  it('supports search query', async () => {
    const res = await request(app).get('/api/glossary?search=ballot');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.terms)).toBe(true);
  });

  it('search returns relevant terms', async () => {
    const res = await request(app).get('/api/glossary?search=vote');
    expect(res.body.terms.length).toBeGreaterThan(0);
  });
});
