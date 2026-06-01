'use client';

// ============================================================
// useSession Hook — Fetch and poll session results
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import type { SessionResults } from '@/types/response.types';
import { getSessionResults } from '@/services/api/session.service';

interface UseSessionReturn {
  results: SessionResults | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const POLL_INTERVAL_MS = 8000; // Poll every 8 seconds for live updates

export function useSession(sessionId: string): UseSessionReturn {
  const [results, setResults] = useState<SessionResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchResults = useCallback(async () => {
    try {
      const data = await getSessionResults(sessionId);
      setResults(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load session');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // Initial fetch
  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Poll for live updates (stop if expired)
  useEffect(() => {
    pollingRef.current = setInterval(() => {
      if (results?.isExpired) {
        if (pollingRef.current) clearInterval(pollingRef.current);
        return;
      }
      fetchResults();
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchResults, results?.isExpired]);

  return { results, isLoading, error, refresh: fetchResults };
}
