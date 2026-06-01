'use client';

// ============================================================
// Voting Page — Friend appreciation experience
// ============================================================

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AppreciationGrid } from '@/features/vote/AppreciationGrid';
import { VoteSuccess } from '@/features/vote/VoteSuccess';
import { PageLoader } from '@/components/ui/Loader';
import { useVote } from '@/hooks/useVote';
import { getSessionResults } from '@/services/api/session.service';
import type { SessionResults } from '@/types/response.types';
import styles from './VotingPage.module.scss';

export default function VotingPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<SessionResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { voteState, selectedType, errorMessage, handleVote } = useVote();

  useEffect(() => {
    if (!sessionId) return;
    getSessionResults(sessionId)
      .then(setSession)
      .catch((err) =>
        setFetchError(err instanceof Error ? err.message : 'Session not found')
      )
      .finally(() => setIsLoading(false));
  }, [sessionId]);

  if (isLoading) return <PageLoader message="Loading appreciation page..." />;

  if (fetchError || !session) {
    return (
      <main className={styles.errorPage}>
        <div className={styles.errorCard}>
          <span className={styles.errorEmoji}>💔</span>
          <h1 className={styles.errorTitle}>Session Not Found</h1>
          <p className={styles.errorText}>
            {fetchError?.includes('expired')
              ? 'This appreciation page has expired after 48 hours.'
              : 'This link is invalid or has been removed.'}
          </p>
          <a href="/" className={styles.errorLink}>Create your own page →</a>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <AnimatePresence mode="wait">
          {voteState === 'success' && selectedType ? (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <VoteSuccess
                appreciationType={selectedType}
                ownerName={session.ownerName}
              />
              <div className={styles.createOwn}>
                <p>Want to know how people see you?</p>
                <a href="/" className={styles.createLink}>Create your own page ✨</a>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="vote"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.voteContent}
            >
              {/* Header */}
              <div className={styles.header}>
                <div className={styles.avatarRing}>
                  <span className={styles.avatarLetter}>
                    {session.ownerName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h1 className={styles.question}>
                  What does{' '}
                  <span className="text-gradient">{session.ownerName}</span>{' '}
                  bring into the world?
                </h1>
                <p className={styles.hint}>Tap one · Completely anonymous · Takes 3 seconds</p>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    className={styles.voteError}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    role="alert"
                  >
                    {errorMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Appreciation cards */}
              <AppreciationGrid
                sessionId={sessionId}
                selectedType={selectedType}
                isLoading={voteState === 'loading'}
                onSelect={handleVote}
              />

              {/* Response count */}
              {session.totalResponses > 0 && (
                <motion.p
                  className={styles.responseCount}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  🌟 {session.totalResponses} people have already responded
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
