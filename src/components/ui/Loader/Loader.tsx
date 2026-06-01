'use client';

// ============================================================
// Loader Component
// ============================================================

import styles from './Loader.module.scss';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function Loader({ size = 'md', label = 'Loading...' }: LoaderProps) {
  return (
    <div className={styles.wrapper} role="status" aria-label={label}>
      <div className={`${styles.ring} ${styles[size]}`}>
        <div />
        <div />
        <div />
        <div />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}

// Full-page loader
export function PageLoader({ message }: { message?: string }) {
  return (
    <div className={styles.page}>
      <Loader size="lg" />
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
