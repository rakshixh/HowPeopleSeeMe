'use client';

// ============================================================
// useVote Hook — Manage vote state
// ============================================================

import { useState, useCallback } from 'react';
import type { AppreciationType } from '@/types/response.types';
import { submitVote } from '@/services/api/response.service';

type VoteState = 'idle' | 'loading' | 'success' | 'error' | 'duplicate';

interface UseVoteReturn {
  voteState: VoteState;
  selectedType: AppreciationType | null;
  errorMessage: string | null;
  handleVote: (sessionId: string, type: AppreciationType) => Promise<void>;
  reset: () => void;
}

export function useVote(): UseVoteReturn {
  const [voteState, setVoteState] = useState<VoteState>('idle');
  const [selectedType, setSelectedType] = useState<AppreciationType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleVote = useCallback(async (sessionId: string, type: AppreciationType) => {
    setVoteState('loading');
    setSelectedType(type);
    setErrorMessage(null);

    const result = await submitVote(sessionId, type);

    if (result.success) {
      setVoteState('success');
    } else if (result.code === 'CONFLICT') {
      setVoteState('duplicate');
      setErrorMessage('You already voted for this appreciation!');
    } else {
      setVoteState('error');
      setErrorMessage(result.error || 'Something went wrong. Please try again.');
    }
  }, []);

  const reset = useCallback(() => {
    setVoteState('idle');
    setSelectedType(null);
    setErrorMessage(null);
  }, []);

  return { voteState, selectedType, errorMessage, handleVote, reset };
}
