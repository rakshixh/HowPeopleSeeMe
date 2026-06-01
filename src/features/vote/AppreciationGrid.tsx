'use client';

// ============================================================
// AppreciationGrid — 12-card voting grid
// ============================================================

import { motion, type Variants } from 'framer-motion';
import type { AppreciationOption } from '@/types/response.types';
import type { AppreciationType } from '@/types/response.types';
import { APPRECIATION_OPTIONS } from '@/lib/constants';
import styles from './AppreciationGrid.module.scss';

interface AppreciationGridProps {
  sessionId: string;
  selectedType: AppreciationType | null;
  isLoading: boolean;
  onSelect: (sessionId: string, type: AppreciationType) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

function AppreciationCard({
  option,
  isSelected,
  isLoading,
  onSelect,
}: {
  option: AppreciationOption;
  isSelected: boolean;
  isLoading: boolean;
  onSelect: (type: AppreciationType) => void;
}) {
  return (
    <motion.button
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      style={{
        '--card-color': option.color,
        '--card-bg': option.bgColor,
      } as React.CSSProperties}
      onClick={() => !isLoading && onSelect(option.type)}
      whileHover={!isLoading ? { scale: 1.04, y: -4 } : {}}
      whileTap={!isLoading ? { scale: 0.97 } : {}}
      variants={cardVariants}
      aria-label={`${option.emoji} ${option.label}`}
      aria-pressed={isSelected}
      disabled={isLoading}
      id={`appreciation-${option.type.toLowerCase()}`}
    >
      <span className={styles.emoji} role="img" aria-hidden="true">
        {option.emoji}
      </span>
      <span className={styles.label}>{option.label}</span>
      {isSelected && (
        <motion.div
          className={styles.selectedRing}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        />
      )}
    </motion.button>
  );
}

export function AppreciationGrid({
  sessionId,
  selectedType,
  isLoading,
  onSelect,
}: AppreciationGridProps) {
  return (
    <motion.div
      className={styles.grid}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      role="group"
      aria-label="Appreciation options"
    >
      {APPRECIATION_OPTIONS.map((option) => (
        <AppreciationCard
          key={option.type}
          option={option}
          isSelected={selectedType === option.type}
          isLoading={isLoading}
          onSelect={(type) => onSelect(sessionId, type)}
        />
      ))}
    </motion.div>
  );
}
