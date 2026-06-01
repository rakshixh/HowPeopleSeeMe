'use client';

// ============================================================
// ResultsDisplay — Live dashboard showing appreciation results
// ============================================================

import { motion, AnimatePresence } from 'framer-motion';
import type { SessionResults, AppreciationCount } from '@/types/response.types';
import { pluralize } from '@/utils/helpers';
import styles from './ResultsDisplay.module.scss';

interface ResultsDisplayProps {
  results: SessionResults;
}

function InsightCard({
  label,
  item,
  delay,
}: {
  label: string;
  item: AppreciationCount;
  delay: number;
}) {
  return (
    <motion.div
      className={styles.insightCard}
      style={{ '--accent': item.color } as React.CSSProperties}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' as const }}
    >
      <span className={styles.insightLabel}>{label}</span>
      <span className={styles.insightEmoji}>{item.emoji}</span>
      <span className={styles.insightName} style={{ color: item.color }}>
        {item.label}
      </span>
    </motion.div>
  );
}

function DistributionBar({ item, index }: { item: AppreciationCount; index: number }) {
  return (
    <motion.div
      className={styles.barRow}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.35, ease: 'easeOut' as const }}
    >
      <div className={styles.barLabel}>
        <span>{item.emoji}</span>
        <span className={styles.barName}>{item.label}</span>
      </div>
      <div className={styles.barTrack}>
        <motion.div
          className={styles.barFill}
          style={{ '--bar-color': item.color } as React.CSSProperties}
          initial={{ width: 0 }}
          animate={{ width: `${item.percentage}%` }}
          transition={{ delay: 0.1 + 0.04 * index, duration: 0.6, ease: 'easeOut' as const }}
        />
      </div>
      <span className={styles.barCount}>{item.count}</span>
    </motion.div>
  );
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const { ownerName, totalResponses, topAppreciation, secondaryAppreciation, hiddenStrength, distribution } = results;

  const topItems = distribution.filter((d) => d.count > 0);

  return (
    <div className={styles.container}>
      {/* Summary Header */}
      <motion.div
        className={styles.summary}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
      >
        {totalResponses === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyEmoji}>🌱</span>
            <h3 className={styles.emptyTitle}>Waiting for responses...</h3>
            <p className={styles.emptyText}>
              Share your link with friends to start collecting appreciations.
            </p>
          </div>
        ) : (
          <>
            <p className={styles.summaryEyebrow}>People say you bring</p>
            {topAppreciation && (
              <motion.div
                className={styles.topResult}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <span className={styles.topEmoji}>{topAppreciation.emoji}</span>
                <span
                  className={styles.topLabel}
                  style={{ color: topAppreciation.color }}
                >
                  {topAppreciation.label}
                </span>
              </motion.div>
            )}
            <p className={styles.summaryMeta}>
              into the world · Based on{' '}
              <strong>{totalResponses}</strong>{' '}
              {pluralize(totalResponses, 'response')}
            </p>
          </>
        )}
      </motion.div>

      {/* Insights */}
      {totalResponses > 0 && (
        <div className={styles.insights}>
          {topAppreciation && (
            <InsightCard label="Most Appreciated" item={topAppreciation} delay={0.3} />
          )}
          {secondaryAppreciation && (
            <InsightCard label="Secondary Trait" item={secondaryAppreciation} delay={0.4} />
          )}
          {hiddenStrength && (
            <InsightCard label="Hidden Strength" item={hiddenStrength} delay={0.5} />
          )}
        </div>
      )}

      {/* Distribution */}
      {topItems.length > 0 && (
        <motion.div
          className={styles.distribution}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className={styles.sectionTitle}>Response Distribution</h3>
          <div className={styles.bars}>
            {topItems.map((item, i) => (
              <DistributionBar key={item.type} item={item} index={i} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Live indicator */}
      <motion.div
        className={styles.liveIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className={styles.liveDot} aria-hidden="true" />
        <span>Updating live · {totalResponses} {pluralize(totalResponses, 'response')}</span>
      </motion.div>
    </div>
  );
}
