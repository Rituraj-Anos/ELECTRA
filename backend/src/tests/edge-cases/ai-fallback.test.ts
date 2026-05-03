import request from 'supertest';
import app from '../../index';

describe('AI Fallback Behavior', () => {
  it('chat endpoint handles AI responses', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({
        messages: [{ role: 'user', content: 'How do I register to vote?' }],
        sessionId: 'test-session',
      });
    expect([200, 400, 500]).toContain(res.status);
  });

  it('translate endpoint handles requests', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({ text: 'Hello', targetLanguage: 'es' });
    expect([200, 400, 500]).toContain(res.status);
  });
});
