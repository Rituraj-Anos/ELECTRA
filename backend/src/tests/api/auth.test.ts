import request from 'supertest';
import app from '../../index';

describe('Auth Routes', () => {
  let registeredToken = '';

  describe('POST /api/auth/register', () => {
    it('registers a new user with email and password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@electra.dev', password: 'secure123', displayName: 'Test User' });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('userId');
      expect(res.body.user.email).toBe('test@electra.dev');
      registeredToken = res.body.token;
    });

    it('rejects registration without email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ password: 'secure123' });
      expect(res.status).toBe(400);
    });

    it('rejects password shorter than 6 chars', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'short@test.com', password: '123' });
      expect(res.status).toBe(400);
    });

    it('rejects duplicate email registration', async () => {
      // Register first
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'dupe@electra.dev', password: 'secure123' });
      // Try again
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'dupe@electra.dev', password: 'secure123' });
      expect(res.status).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    it('logs in with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@electra.dev', password: 'secure123' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');
    });

    it('rejects login without password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@electra.dev' });
      expect(res.status).toBe(400);
    });

    it('rejects login with unknown email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@nowhere.com', password: 'test123' });
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/google', () => {
    it('creates user via Google OAuth', async () => {
      const res = await request(app)
        .post('/api/auth/google')
        .send({ firebaseUid: 'google-uid-123', email: 'google@test.com', displayName: 'Google User' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.authProvider).toBe('google');
    });

    it('rejects without firebaseUid', async () => {
      const res = await request(app)
        .post('/api/auth/google')
        .send({ email: 'google@test.com' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/auth/me', () => {
    it('returns user with valid token', async () => {
      // First register to get a token
      const reg = await request(app)
        .post('/api/auth/register')
        .send({ email: 'me-test@electra.dev', password: 'secure123' });
      const token = reg.body.token;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe('me-test@electra.dev');
    });

    it('rejects without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('rejects with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token-here');
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/auth/complete-profile', () => {
    it('updates user profile with valid token', async () => {
      const reg = await request(app)
        .post('/api/auth/register')
        .send({ email: 'profile@electra.dev', password: 'secure123' });
      const token = reg.body.token;

      const res = await request(app)
        .put('/api/auth/complete-profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ displayName: 'Updated Name', country: 'India', language: 'hi' });
      expect(res.status).toBe(200);
      expect(res.body.user.displayName).toBe('Updated Name');
      expect(res.body.user.country).toBe('India');
      expect(res.body.user.language).toBe('hi');
    });

    it('rejects profile update without token', async () => {
      const res = await request(app)
        .put('/api/auth/complete-profile')
        .send({ displayName: 'Hacker' });
      expect(res.status).toBe(401);
    });
  });
});
