import { authMiddleware } from '../../middleware/auth';
import { Request, Response, NextFunction } from 'express';

describe('authMiddleware', () => {
  const makeRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('skips auth in development mode', async () => {
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const req = { headers: {} } as Request;
    const next = jest.fn();
    await authMiddleware(req, makeRes(), next);
    expect(next).toHaveBeenCalled();
    process.env.NODE_ENV = origEnv;
  });

  it('allows request without token (graceful fallback)', async () => {
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const req = { headers: {} } as Request;
    const next = jest.fn();
    await authMiddleware(req, makeRes(), next);
    expect(next).toHaveBeenCalled();
    process.env.NODE_ENV = origEnv;
  });

  it('attaches anonymous uid when no token', async () => {
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const req = { headers: {} } as any;
    const next = jest.fn();
    await authMiddleware(req, makeRes(), next);
    expect((req as any).uid).toBeDefined();
    process.env.NODE_ENV = origEnv;
  });
});
