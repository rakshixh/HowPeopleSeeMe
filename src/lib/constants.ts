// ============================================================
// Constants — How People See Me
// ============================================================

import type { AppreciationOption } from '@/types/response.types';

// Session lifetime in milliseconds (48 hours)
export const SESSION_LIFETIME_MS = 48 * 60 * 60 * 1000;

// Rate limiting
export const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
export const RATE_LIMIT_MAX_REQUESTS = 10;
export const CREATE_SESSION_RATE_LIMIT = 3; // max 3 sessions per IP per window

// Anti-spam: max votes per IP per session
export const MAX_VOTES_PER_IP_PER_SESSION = 12; // one per appreciation type

// App URLs
export const APP_NAME = 'How People See Me';
export const APP_TAGLINE = 'Discover how your friends appreciate you';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Appreciation options (12 total)
export const APPRECIATION_OPTIONS: AppreciationOption[] = [
  {
    type: 'Kindness',
    emoji: '❤️',
    label: 'Kindness',
    color: '#FB7185',
    bgColor: 'rgba(251, 113, 133, 0.12)',
  },
  {
    type: 'Laughter',
    emoji: '😂',
    label: 'Laughter',
    color: '#FBBF24',
    bgColor: 'rgba(251, 191, 36, 0.12)',
  },
  {
    type: 'Positivity',
    emoji: '☀️',
    label: 'Positivity',
    color: '#F97316',
    bgColor: 'rgba(249, 115, 22, 0.12)',
  },
  {
    type: 'Support',
    emoji: '🤝',
    label: 'Support',
    color: '#34D399',
    bgColor: 'rgba(52, 211, 153, 0.12)',
  },
  {
    type: 'Motivation',
    emoji: '🚀',
    label: 'Motivation',
    color: '#60A5FA',
    bgColor: 'rgba(96, 165, 250, 0.12)',
  },
  {
    type: 'Inspiration',
    emoji: '✨',
    label: 'Inspiration',
    color: '#A78BFA',
    bgColor: 'rgba(167, 139, 250, 0.12)',
  },
  {
    type: 'Comfort',
    emoji: '🌸',
    label: 'Comfort',
    color: '#F9A8D4',
    bgColor: 'rgba(249, 168, 212, 0.12)',
  },
  {
    type: 'Strength',
    emoji: '💪',
    label: 'Strength',
    color: '#FB923C',
    bgColor: 'rgba(251, 146, 60, 0.12)',
  },
  {
    type: 'Confidence',
    emoji: '🔥',
    label: 'Confidence',
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.12)',
  },
  {
    type: 'Focus',
    emoji: '🎯',
    label: 'Focus',
    color: '#06B6D4',
    bgColor: 'rgba(6, 182, 212, 0.12)',
  },
  {
    type: 'Happiness',
    emoji: '🌈',
    label: 'Happiness',
    color: '#818CF8',
    bgColor: 'rgba(129, 140, 248, 0.12)',
  },
  {
    type: 'Wisdom',
    emoji: '🧠',
    label: 'Wisdom',
    color: '#C084FC',
    bgColor: 'rgba(192, 132, 252, 0.12)',
  },
];

// Lookup map for O(1) access
export const APPRECIATION_MAP = new Map(
  APPRECIATION_OPTIONS.map((opt) => [opt.type, opt])
);

// Valid appreciation type strings
export const VALID_APPRECIATION_TYPES = APPRECIATION_OPTIONS.map((o) => o.type);
