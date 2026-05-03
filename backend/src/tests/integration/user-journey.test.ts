import request from 'supertest';
import app from '../../index';

describe('Integration: Complete User Journey', () => {
  it('health check -> modules -> glossary flow', async () => {
    const health = await request(app).get('/api/health');
    expect(health.status).toBe(200);

    const modules = await request(app).get('/api/modules');
    expect(modules.status).toBe(200);
    expect(modules.body.modules.length).toBeGreaterThan(0);

    const glossary = await request(app).get('/api/glossary');
    expect(glossary.status).toBe(200);
    expect(glossary.body.terms.length).toBeGreaterThan(0);
  });

  it('modules -> quiz flow', async () => {
    const modules = await request(app).get('/api/modules');
    expect(modules.body.modules.length).toBeGreaterThan(0);

    const moduleId = modules.body.modules[0].id;
    const quiz = await request(app).get(`/api/quiz/${moduleId}`);
    expect([200, 404]).toContain(quiz.status);
  });

  it('timeline works for multiple countries', async () => {
    const countries = ['US', 'India', 'UK'];
    for (const country of countries) {
      const res = await request(app).get(`/api/timeline?country=${country}`);
      expect(res.status).toBe(200);
    }
  });

  it('concurrent requests handled safely', async () => {
    const promises = Array.from({ length: 5 }, () =>
      request(app).get('/api/modules')
    );
    const results = await Promise.all(promises);
    results.forEach((res) => expect(res.status).toBe(200));
  });
});
