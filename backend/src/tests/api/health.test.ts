import request from 'supertest';
import app from '../../index';

describe('GET /api/health', () => {
  it('returns 200 without auth', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });

  it('returns success true', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.success).toBe(true);
  });

  it('returns status running', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.status).toBe('running');
  });

  it('returns services object', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body).toHaveProperty('services');
  });

  it('returns security configuration', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body).toHaveProperty('security');
    expect(res.body.security.helmet).toBe(true);
  });

  it('returns uptime as number', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body).toHaveProperty('uptime');
    expect(typeof res.body.uptime).toBe('number');
  });

  it('returns timestamp', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body).toHaveProperty('timestamp');
  });
});
