// ============================================================
// Response Validator — Zod schemas
// ============================================================

import { z } from 'zod';
import { VALID_APPRECIATION_TYPES } from '@/lib/constants';

export const submitVoteSchema = z.object({
  sessionId: z
    .string()
    .min(6, 'Invalid session ID')
    .max(16, 'Invalid session ID')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid session ID format'),
  appreciationType: z.enum(
    VALID_APPRECIATION_TYPES as unknown as [string, ...string[]],
    { error: 'Invalid appreciation type' }
  ),
});

export type SubmitVoteInput = z.infer<typeof submitVoteSchema>;
