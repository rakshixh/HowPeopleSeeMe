// ============================================================
// Date Utilities
// ============================================================

/**
 * Format a date as "X hours remaining" or "X minutes remaining"
 */
export function formatTimeRemaining(expiresAt: string | Date): string {
  const now = Date.now();
  const expires = new Date(expiresAt).getTime();
  const diff = expires - now;

  if (diff <= 0) return 'Expired';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }
  return `${minutes}m remaining`;
}

/**
 * Check if a date is in the past
 */
export function isExpired(expiresAt: string | Date): boolean {
  return new Date(expiresAt).getTime() < Date.now();
}

/**
 * Format a date for display
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * Get hours until expiration (for display)
 */
export function hoursUntilExpiry(expiresAt: string | Date): number {
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
}
