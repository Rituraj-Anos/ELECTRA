import { Request, Response, NextFunction } from 'express';

/**
 * Additional security headers beyond what Helmet provides.
 * Adds CSP reporting, feature policies, and cache control.
 */
export const securityMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // XSS Protection (legacy browsers)
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy — don't leak URLs
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy — restrict browser features
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(self), geolocation=(), payment=()'
  );

  // Strict Transport Security (HSTS)
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // Cache control for API responses — don't cache sensitive data
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  next();
};
