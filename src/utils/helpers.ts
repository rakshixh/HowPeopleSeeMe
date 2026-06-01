// ============================================================
// Helper Utilities
// ============================================================

import crypto from 'crypto';
import { nanoid } from 'nanoid';

/**
 * Generate a unique session ID (URL-safe, 8 chars)
 */
export function generateSessionId(): string {
  return nanoid(8);
}

/**
 * Hash an IP address using SHA-256.
 * Never store raw IPs — only hashes.
 */
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || 'howpeopelseeme-salt-2024';
  return crypto
    .createHash('sha256')
    .update(`${salt}:${ip}`)
    .digest('hex')
    .slice(0, 32); // truncate to 32 chars
}

/**
 * Extract real client IP from request headers (Vercel/proxy-aware)
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

/**
 * Sanitize a string to prevent XSS (strip HTML tags)
 */
export function sanitizeString(input: string): string {
  return input.replace(/[<>'"&]/g, (char) => {
    const map: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#x27;',
      '"': '&quot;',
      '&': '&amp;',
    };
    return map[char] || char;
  });
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculate percentage (safe division)
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Pluralize a word based on count
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}

/**
 * Build the share URL for a session
 */
export function buildShareUrl(sessionId: string, baseUrl?: string): string {
  const base = (baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
  return `${base}/r/${sessionId}`;
}

/**
 * Build the dashboard URL for a session
 */
export function buildDashboardUrl(sessionId: string, baseUrl?: string): string {
  const base = (baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
  return `${base}/dashboard/${sessionId}`;
}
