import request from 'supertest';
import app from '../../index';

describe('Security Audit', () => {
  it('CORS allows frontend origin', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:3000');
    expect(res.status).toBe(200);
  });

  it('health endpoint returns all services', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.services).toHaveProperty('groqAI');
    expect(res.body.services).toHaveProperty('firebase');
    expect(res.body.services).toHaveProperty('googleTranslate');
  });

  it('environment variables not exposed in responses', async () => {
    const res = await request(app).get('/api/health');
    const body = JSON.stringify(res.body);
    expect(body).not.toContain('gsk_');
    expect(body).not.toContain('AIza');
  });

  it('404 handler returns proper error', async () => {
    const res = await request(app).get('/api/nonexistent-route');
    expect(res.status).toBe(404);
  });
});
