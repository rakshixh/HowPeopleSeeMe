'use client';

// ============================================================
// VoteSuccess — Shown after a successful vote
// ============================================================

import { motion } from 'framer-motion';
import type { AppreciationType } from '@/types/response.types';
import { APPRECIATION_MAP } from '@/lib/constants';
import styles from './VoteSuccess.module.scss';

interface VoteSuccessProps {
  appreciationType: AppreciationType;
  ownerName: string;
}

export function VoteSuccess({ appreciationType, ownerName }: VoteSuccessProps) {
  const option = APPRECIATION_MAP.get(appreciationType);

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    >
      {/* Celebration emoji with bounce */}
      <motion.div
        className={styles.bigEmoji}
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
      >
        {option?.emoji}
      </motion.div>

      {/* Particles */}
      <div className={styles.particles} aria-hidden="true">
        {['🎉', '✨', '💫', '⭐', '🌟', '💜'].map((particle, i) => (
          <motion.span
            key={i}
            className={styles.particle}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0.5],
              x: (i % 2 === 0 ? 1 : -1) * (40 + i * 15),
              y: -(50 + i * 20),
            }}
            transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: 'easeOut' as const }}
          >
            {particle}
          </motion.span>
        ))}
      </div>

      <motion.div
        className={styles.text}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <h2 className={styles.title}>
          You just made {ownerName}&apos;s day better! ❤️
        </h2>
        <p className={styles.subtitle}>
          You chose <strong style={{ color: option?.color }}>{option?.emoji} {option?.label}</strong>
        </p>
        <p className={styles.message}>
          Your response is anonymous and has been counted.
        </p>
      </motion.div>
    </motion.div>
  );
}
