/**
 * @fileoverview Tests for Voter Readiness Checklist API
 */
import request from 'supertest';
import app from '../../index';

describe('GET /api/checklist/:userId', () => {
  it('returns checklist for a user', async () => {
    const res = await request(app).get('/api/checklist/test-user-1');
    expect(res.status).toBe(200);
    expect(res.body.items).toBeDefined();
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.progress).toBeDefined();
    expect(res.body.progress.total).toBeGreaterThan(0);
  });

  it('each item has required fields', async () => {
    const res = await request(app).get('/api/checklist/test-user-2');
    for (const item of res.body.items) {
      expect(item.id).toBeDefined();
      expect(item.label).toBeDefined();
      expect(typeof item.completed).toBe('boolean');
    }
  });

  it('returns progress percentage', async () => {
    const res = await request(app).get('/api/checklist/test-user-progress');
    expect(res.body.progress.percentage).toBe(0);
    expect(res.body.progress.completed).toBe(0);
  });
});

describe('POST /api/checklist/update', () => {
  it('toggles a checklist item', async () => {
    // First get the checklist to initialize
    await request(app).get('/api/checklist/test-user-3');

    const res = await request(app)
      .post('/api/checklist/update')
      .send({ userId: 'test-user-3', itemId: 'check-registration', completed: true });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.item.completed).toBe(true);
  });

  it('returns 400 without userId or itemId', async () => {
    const res = await request(app)
      .post('/api/checklist/update')
      .send({ userId: 'test' });
    expect(res.status).toBe(400);
  });

  it('returns 404 for invalid item', async () => {
    const res = await request(app)
      .post('/api/checklist/update')
      .send({ userId: 'test-user-4', itemId: 'nonexistent-item' });
    expect(res.status).toBe(404);
  });
});
