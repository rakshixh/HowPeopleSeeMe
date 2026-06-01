'use client';

// ============================================================
// Dashboard Page — Owner's live results view
// ============================================================

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@/hooks/useSession';
import { ResultsDisplay } from '@/features/results/ResultsDisplay';
import { SharePanel } from '@/features/sharing/SharePanel';
import { PageLoader } from '@/components/ui/Loader';
import { formatTimeRemaining } from '@/utils/date';
import styles from './DashboardPage.module.scss';

type Tab = 'results' | 'share';

export default function DashboardPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { results, isLoading, error } = useSession(sessionId);
  const [activeTab, setActiveTab] = useState<Tab>('results');

  if (isLoading) return <PageLoader message="Loading your results..." />;

  if (error || !results) {
    return (
      <main className={styles.errorPage}>
        <div className={styles.errorCard}>
          <span className={styles.errorEmoji}>⏰</span>
          <h1 className={styles.errorTitle}>Session Expired</h1>
          <p className={styles.errorText}>
            This appreciation page has expired. Sessions last 48 hours.
          </p>
          <a href="/" className={styles.errorLink}>Create a new page →</a>
        </div>
      </main>
    );
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/r/${sessionId}`;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.headerTop}>
            <div className={styles.avatar}>
              {results.ownerName.charAt(0).toUpperCase()}
            </div>
            <div className={styles.headerInfo}>
              <h1 className={styles.name}>{results.ownerName}&apos;s Page</h1>
              <div className={styles.meta}>
                <span className={styles.metaBadge}>
                  {results.totalResponses} {results.totalResponses === 1 ? 'response' : 'responses'}
                </span>
                <span className={styles.expiry}>
                  ⏱ {formatTimeRemaining(results.expiresAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Share URL */}
          <div className={styles.shareRow}>
            <span className={styles.shareUrlText}>{shareUrl}</span>
            <button
              className={styles.copyBtn}
              onClick={() => navigator.clipboard.writeText(shareUrl)}
              id="dashboard-copy-btn"
              aria-label="Copy share link"
            >
              Copy Link
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className={styles.tabs} role="tablist">
          <button
            className={`${styles.tab} ${activeTab === 'results' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('results')}
            role="tab"
            aria-selected={activeTab === 'results'}
            id="tab-results"
          >
            📊 Results
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'share' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('share')}
            role="tab"
            aria-selected={activeTab === 'share'}
            id="tab-share"
          >
            📤 Share
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'results' ? (
              <ResultsDisplay results={results} />
            ) : (
              <SharePanel results={results} />
            )}
          </motion.div>
        </AnimatePresence>

        <footer className={styles.footer}>
          <a href="/" className={styles.footerLink}>← Create your own appreciation page</a>
        </footer>
      </div>
    </main>
  );
}
