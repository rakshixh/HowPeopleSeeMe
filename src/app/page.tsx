'use client';

// ============================================================
// Landing Page — Create Session
// ============================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CreateSessionResponse } from '@/types/session.types';
import { CreateSessionForm } from '@/features/create-session/CreateSessionForm';
import { SessionCreated } from '@/features/create-session/SessionCreated';
import styles from './page.module.scss';

export default function HomePage() {
  const [sessionData, setSessionData] = useState<CreateSessionResponse | null>(null);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Hero Section */}
        <motion.div
          className={styles.hero}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' as const }}
        >
          <h1 className={styles.title}>
            How do people{' '}
            <span className="text-gradient">really</span>{' '}
            see you?
          </h1>

          <p className={styles.subtitle}>
            Create your appreciation page. Share with friends.
            <br />
            Discover what you bring into the world, in under 3 seconds.
          </p>

          {/* Feature pills */}
          <div className={styles.pills}>
            {[
              { emoji: '⚡', text: '3-second response' },
              { emoji: '🔒', text: '100% anonymous' },
              { emoji: '⏱', text: 'Expires in 48h' },
              { emoji: '💜', text: 'Feels magical' },
            ].map(({ emoji, text }) => (
              <span key={text} className={styles.pill}>
                {emoji} {text}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Form / Success Card */}
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' as const }}
        >
          <AnimatePresence mode="wait">
            {!sessionData ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <CreateSessionForm onSuccess={setSessionData} />
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' as const }}
              >
                <SessionCreated data={sessionData} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* How it works */}
        {!sessionData && (
          <motion.div
            className={styles.howItWorks}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' as const }}
          >
            <h2 className={styles.howTitle}>How it works</h2>
            <div className={styles.steps}>
              {[
                { step: '1', emoji: '✏️', title: 'Create your page', desc: 'Enter your name. Takes 5 seconds.' },
                { step: '2', emoji: '🔗', title: 'Share your link', desc: 'Send to friends on WhatsApp, Instagram, anywhere.' },
                { step: '3', emoji: '❤️', title: 'Collect appreciations', desc: 'Friends tap one card. Completely anonymous.' },
                { step: '4', emoji: '🎉', title: 'See your results', desc: 'Watch responses appear in real-time.' },
              ].map(({ step, emoji, title, desc }) => (
                <div key={step} className={styles.step}>
                  <div className={styles.stepNumber}>{step}</div>
                  <div className={styles.stepContent}>
                    <span className={styles.stepEmoji}>{emoji}</span>
                    <h3 className={styles.stepTitle}>{title}</h3>
                    <p className={styles.stepDesc}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <footer className={styles.footer}>
          <p>
            Made with ❤️ by{' '}
            <a
              href="https://github.com/rakshixh"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubLink}
            >
              rakshixh
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
