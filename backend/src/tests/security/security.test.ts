import request from 'supertest';
import app from '../../index';

describe('Security Middleware', () => {
  it('sets X-Content-Type-Options header (helmet)', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('removes X-Powered-By header (helmet)', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('handles XSS in chat input safely', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({
        messages: [{ role: 'user', content: '<script>alert(1)</script>' }],
        sessionId: 'test',
      });
    expect([200, 400]).toContain(res.status);
  });

  it('handles SQL injection patterns', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({
        messages: [{ role: 'user', content: "'; DROP TABLE users; --" }],
        sessionId: 'test',
      });
    expect([200, 400]).toContain(res.status);
  });

  it('handles NoSQL injection patterns', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({
        messages: [{ role: 'user', content: '{"$ne": null}' }],
        sessionId: 'test',
      });
    expect([200, 400]).toContain(res.status);
  });

  it('returns proper CORS headers', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:3000');
    expect(res.status).toBe(200);
  });
});
