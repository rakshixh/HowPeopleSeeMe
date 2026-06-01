// ============================================================
// Response Service — Vote submission
// ============================================================

import type { AppreciationType } from '@/types/response.types';

interface VoteResult {
  success: boolean;
  message?: string;
  error?: string;
  code?: string;
}

export async function submitVote(
  sessionId: string,
  appreciationType: AppreciationType
): Promise<VoteResult> {
  const res = await fetch('/api/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, appreciationType }),
  });

  const result = await res.json();

  if (!result.success) {
    return {
      success: false,
      error: result.error || 'Failed to submit vote',
      code: result.code,
    };
  }

  return { success: true, message: result.message };
}
