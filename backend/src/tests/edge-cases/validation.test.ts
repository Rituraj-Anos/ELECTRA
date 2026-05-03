import request from 'supertest';
import app from '../../index';

describe('Edge Cases: Input Validation', () => {
  it('handles empty messages array in chat', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ messages: [], sessionId: 'test' });
    expect(res.status).toBe(400);
  });

  it('handles missing sessionId in chat', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ messages: [{ role: 'user', content: 'test' }] });
    expect([200, 400]).toContain(res.status);
  });

  it('handles special unicode characters', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({
        messages: [{ role: 'user', content: 'Elections' }],
        sessionId: 'test',
      });
    expect([200, 400]).toContain(res.status);
  });

  it('handles undefined country in timeline', async () => {
    const res = await request(app).get('/api/timeline');
    expect(res.status).toBe(400);
  });

  it('handles special chars in glossary search', async () => {
    const res = await request(app).get('/api/glossary?search=elect%24ion');
    expect(res.status).toBe(200);
  });

  it('handles missing address in polling', async () => {
    const res = await request(app).get('/api/polling');
    expect(res.status).toBe(400);
  });
});
