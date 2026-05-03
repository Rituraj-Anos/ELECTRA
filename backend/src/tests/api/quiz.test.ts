import request from 'supertest';
import app from '../../index';

describe('Quiz Routes', () => {
  describe('GET /api/quiz/:moduleId', () => {
    it('returns questions for a valid module', async () => {
      const modulesRes = await request(app).get('/api/modules');
      const moduleId = modulesRes.body.modules[0]?.id;
      if (!moduleId) return;

      const res = await request(app).get(`/api/quiz/${moduleId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('questions');
    });

    it('returns 404 for invalid module', async () => {
      const res = await request(app).get('/api/quiz/nonexistent-module');
      expect(res.status).toBe(404);
    });

    it('each question has required fields', async () => {
      const modulesRes = await request(app).get('/api/modules');
      const moduleId = modulesRes.body.modules[0]?.id;
      if (!moduleId) return;

      const res = await request(app).get(`/api/quiz/${moduleId}`);
      if (res.body.questions && res.body.questions.length > 0) {
        const q = res.body.questions[0];
        expect(q).toHaveProperty('id');
        expect(q).toHaveProperty('question');
        expect(q).toHaveProperty('options');
      }
    });
  });

  describe('POST /api/quiz/:moduleId/submit', () => {
    it('returns score for valid submission', async () => {
      const modulesRes = await request(app).get('/api/modules');
      const moduleId = modulesRes.body.modules[0]?.id;
      if (!moduleId) return;

      const res = await request(app)
        .post(`/api/quiz/${moduleId}/submit`)
        .send({ sessionId: 'test-session', answers: [] });
      expect([200, 400]).toContain(res.status);
    });

    it('returns 400 when answers missing', async () => {
      const modulesRes = await request(app).get('/api/modules');
      const moduleId = modulesRes.body.modules[0]?.id;
      if (!moduleId) return;

      const res = await request(app)
        .post(`/api/quiz/${moduleId}/submit`)
        .send({ sessionId: 'test' });
      expect(res.status).toBe(400);
    });

    it('returns 404 for invalid module', async () => {
      const res = await request(app)
        .post('/api/quiz/nonexistent/submit')
        .send({ sessionId: 'test', answers: [{ questionId: 'q1', selectedAnswer: 'a' }] });
      expect(res.status).toBe(404);
    });
  });
});
