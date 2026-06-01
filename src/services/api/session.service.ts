// ============================================================
// Session Service — Client-side API calls
// ============================================================

import type { CreateSessionResponse } from '@/types/session.types';
import type { SessionResults } from '@/types/response.types';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  return res.json() as Promise<ApiResponse<T>>;
}

export async function createSession(ownerName: string): Promise<CreateSessionResponse> {
  const result = await apiFetch<CreateSessionResponse>('/api/session', {
    method: 'POST',
    body: JSON.stringify({ ownerName }),
  });

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to create session');
  }

  return result.data;
}

export async function getSessionResults(sessionId: string): Promise<SessionResults> {
  const result = await apiFetch<SessionResults>(`/api/session/${sessionId}`);

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch session');
  }

  return result.data;
}
