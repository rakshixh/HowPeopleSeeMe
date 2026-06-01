'use client';

// ============================================================
// SessionCreated — Success state after creating a session
// ============================================================

import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import type { CreateSessionResponse } from '@/types/session.types';
import { Button } from '@/components/ui/Button';
import styles from './SessionCreated.module.scss';

interface SessionCreatedProps {
  data: CreateSessionResponse;
}

export function SessionCreated({ data }: SessionCreatedProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = data.shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareViaWhatsApp = () => {
    const text = `Hey! Tell me how you see me 💜 It only takes 3 seconds!\n${data.shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareViaTwitter = () => {
    const text = `Curious how my friends see me 👀 Tell me anonymously, it only takes 3 seconds!`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(data.shareUrl)}`,
      '_blank'
    );
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Success Icon */}
      <motion.div
        className={styles.successIcon}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
      >
        🎉
      </motion.div>

      <motion.div className={styles.header} variants={itemVariants}>
        <h2 className={styles.title}>Your page is ready, {data.ownerName}!</h2>
        <p className={styles.subtitle}>
          Share the link with friends. Responses update instantly.
        </p>
      </motion.div>

      {/* Share URL */}
      <motion.div className={styles.urlCard} variants={itemVariants}>
        <p className={styles.urlLabel}>Your shareable link</p>
        <div className={styles.urlRow}>
          <span className={styles.url}>{data.shareUrl}</span>
          <button
            className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
            onClick={handleCopy}
            aria-label="Copy link"
            id="copy-link-btn"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      </motion.div>

      {/* Share Buttons */}
      <motion.div className={styles.shareButtons} variants={itemVariants}>
        <p className={styles.shareLabel}>Share directly to</p>
        <div className={styles.shareGrid}>
          <button className={`${styles.shareBtn} ${styles.whatsapp}`} onClick={shareViaWhatsApp} id="share-whatsapp-btn">
            <span>💬</span> WhatsApp
          </button>
          <button className={`${styles.shareBtn} ${styles.twitter}`} onClick={shareViaTwitter} id="share-twitter-btn">
            <span>🐦</span> Twitter / X
          </button>
        </div>
      </motion.div>

      {/* View Results */}
      <motion.div variants={itemVariants}>
        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={() => window.open(data.dashboardUrl, '_blank')}
          id="view-results-btn"
        >
          📊 View My Results Page
        </Button>
      </motion.div>

      <motion.p className={styles.expiry} variants={itemVariants}>
        ⏱ Link expires in 48 hours · All responses are anonymous
      </motion.p>
    </motion.div>
  );
}
