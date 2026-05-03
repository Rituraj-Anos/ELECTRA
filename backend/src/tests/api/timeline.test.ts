import request from 'supertest';
import app from '../../index';

describe('GET /api/timeline', () => {
  it('returns timeline for US', async () => {
    const res = await request(app).get('/api/timeline?country=US');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('events');
  });

  it('returns timeline for India', async () => {
    const res = await request(app).get('/api/timeline?country=India');
    expect(res.status).toBe(200);
  });

  it('events array is not empty', async () => {
    const res = await request(app).get('/api/timeline?country=US');
    expect(res.body.events.length).toBeGreaterThan(0);
  });

  it('each event has required fields', async () => {
    const res = await request(app).get('/api/timeline?country=US');
    const event = res.body.events[0];
    expect(event).toHaveProperty('title');
    expect(event).toHaveProperty('description');
  });

  it('returns 400 when country missing', async () => {
    const res = await request(app).get('/api/timeline');
    expect(res.status).toBe(400);
  });
});
