'use client';

// ============================================================
// SharePanel — Social sharing buttons + canvas share card
// ============================================================

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { SessionResults } from '@/types/response.types';
import { trackShare } from '@/services/api/analytics.service';
import { Button } from '@/components/ui/Button';
import styles from './SharePanel.module.scss';

interface SharePanelProps {
  results: SessionResults;
}

export function SharePanel({ results }: SharePanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareUrl] = useState(
    `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/r/${results.sessionId}`
  );

  const shareText = results.topAppreciation
    ? `People say I bring ${results.topAppreciation.emoji} ${results.topAppreciation.label} into the world! Based on ${results.totalResponses} responses. Discover how your friends see you →`
    : `Discover how your friends appreciate you →`;

  const generateShareImage = async (): Promise<string | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const W = 1080;
    const H = 1080;
    canvas.width = W;
    canvas.height = H;

    // Background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#0F172A');
    bg.addColorStop(0.5, '#1E1040');
    bg.addColorStop(1, '#0F172A');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Accent circle
    const gradient = ctx.createRadialGradient(W / 2, H * 0.4, 0, W / 2, H * 0.4, 400);
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.25)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    // Card background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.beginPath();
    ctx.roundRect(80, 120, W - 160, H - 240, 40);
    ctx.fill();

    // Card border
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(80, 120, W - 160, H - 240, 40);
    ctx.stroke();

    // App name
    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 32px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('How People See Me', W / 2, 220);

    // Tagline
    ctx.fillStyle = '#ffffff';
    ctx.font = '400 28px Inter, sans-serif';
    ctx.fillText('People say I bring', W / 2, 320);

    // Top emoji
    if (results.topAppreciation) {
      ctx.font = '160px sans-serif';
      ctx.fillText(results.topAppreciation.emoji, W / 2, 560);

      // Label
      ctx.font = '700 80px Inter, sans-serif';
      ctx.fillStyle = results.topAppreciation.color;
      ctx.fillText(results.topAppreciation.label, W / 2, 660);

      // Subtext
      ctx.font = '400 32px Inter, sans-serif';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('into the world', W / 2, 720);
    }

    // Responses count
    ctx.font = '600 28px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(`Based on ${results.totalResponses} responses`, W / 2, 820);

    // URL
    ctx.font = '400 24px Inter, sans-serif';
    ctx.fillStyle = '#8B5CF6';
    ctx.fillText(shareUrl, W / 2, 920);

    return canvas.toDataURL('image/png');
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    const dataUrl = await generateShareImage();
    setIsGenerating(false);

    if (!dataUrl) return;

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `how-people-see-${results.ownerName.toLowerCase().replace(/\s/g, '-')}.png`;
    a.click();
    trackShare(results.sessionId);
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'How People See Me',
          text: shareText,
          url: shareUrl,
        });
        trackShare(results.sessionId);
      } catch {
        // User cancelled — no-op
      }
    }
  };

  const handleShareWhatsApp = () => {
    const text = `${shareText}\n${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    trackShare(results.sessionId);
  };

  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
    trackShare(results.sessionId);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    trackShare(results.sessionId);
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' as const }}
    >
      <h3 className={styles.title}>Share Your Results</h3>

      {/* Preview Card */}
      <div className={styles.previewCard}>
        <div className={styles.previewHeader}>
          <span className={styles.previewBadge}>How People See Me</span>
        </div>
        {results.topAppreciation ? (
          <>
            <span className={styles.previewEmoji}>{results.topAppreciation.emoji}</span>
            <p className={styles.previewLabel} style={{ color: results.topAppreciation.color }}>
              {results.topAppreciation.label}
            </p>
            <p className={styles.previewMeta}>Based on {results.totalResponses} responses</p>
          </>
        ) : (
          <p className={styles.previewEmpty}>Collect responses to unlock your share card</p>
        )}
      </div>

      {/* Share Buttons */}
      <div className={styles.buttons}>
        <button className={`${styles.shareBtn} ${styles.whatsapp}`} onClick={handleShareWhatsApp} id="share-results-whatsapp">
          💬 WhatsApp
        </button>
        <button className={`${styles.shareBtn} ${styles.twitter}`} onClick={handleShareTwitter} id="share-results-twitter">
          🐦 Twitter / X
        </button>
        {'share' in navigator && (
          <button className={`${styles.shareBtn} ${styles.native}`} onClick={handleShareNative} id="share-results-native">
            📤 Share
          </button>
        )}
        <button className={`${styles.shareBtn} ${styles.copy}`} onClick={handleCopyLink} id="share-results-copy">
          🔗 Copy Link
        </button>
      </div>

      {/* Download Image */}
      <Button
        variant="secondary"
        size="md"
        fullWidth
        isLoading={isGenerating}
        onClick={handleDownload}
        id="download-share-card-btn"
      >
        ⬇️ Download Share Card
      </Button>

      {/* Hidden canvas for image generation */}
      <canvas ref={canvasRef} className={styles.hiddenCanvas} aria-hidden="true" />
    </motion.div>
  );
}
