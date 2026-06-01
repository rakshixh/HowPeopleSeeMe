// ============================================================
// Session Validator — Zod schemas
// ============================================================

import { z } from 'zod';

export const createSessionSchema = z.object({
  ownerName: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be 50 characters or less')
    .trim()
    .refine(
      (val) => /^[a-zA-Z\s'-]+$/.test(val),
      'Name can only contain letters, spaces, hyphens, and apostrophes'
    ),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

export const sessionIdSchema = z.object({
  id: z
    .string()
    .min(6, 'Invalid session ID')
    .max(16, 'Invalid session ID')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid session ID format'),
});

export type SessionIdInput = z.infer<typeof sessionIdSchema>;
