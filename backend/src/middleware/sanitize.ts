/**
 * Input Sanitization Module
 * Prevents XSS, prompt injection, and other input-based attacks.
 * All user input passes through this before reaching AI models.
 */

/**
 * Sanitize user input by removing HTML, script injections,
 * and known prompt injection patterns.
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';

  let clean = input;

  // Remove HTML tags
  clean = clean.replace(/<[^>]*>/g, '');

  // Remove script-related content
  clean = clean.replace(/javascript:/gi, '');
  clean = clean.replace(/on\w+\s*=/gi, '');

  // Remove known prompt injection patterns
  clean = clean.replace(/```/g, '');
  clean = clean.replace(/\[SYSTEM\]|\[INST\]|<s>|<\/s>/gi, '');
  clean = clean.replace(/<<SYS>>|<\/SYS>>/gi, '');
  clean = clean.replace(/\{\{.*?\}\}/g, '');

  // Remove null bytes and control characters (except newlines and tabs)
  clean = clean.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Normalize whitespace
  clean = clean.replace(/\s+/g, ' ');

  // Truncate to max length (500 chars for chat, generous for most inputs)
  clean = clean.substring(0, 500).trim();

  return clean;
}

/**
 * Wraps user message in XML tags to prevent prompt injection
 * when sending to the Gemini model.
 */
export function wrapUserMessage(message: string): string {
  const sanitized = sanitizeInput(message);
  return `<user_message>${sanitized}</user_message>`;
}

/**
 * Validate and sanitize session ID format (UUID v4)
 */
export function sanitizeSessionId(sessionId: string): string | null {
  if (!sessionId || typeof sessionId !== 'string') return null;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  // Also allow Firebase UIDs (alphanumeric, 28 chars)
  const firebaseUidRegex = /^[a-zA-Z0-9]{20,128}$/;
  if (uuidRegex.test(sessionId) || firebaseUidRegex.test(sessionId)) {
    return sessionId;
  }
  return null;
}
