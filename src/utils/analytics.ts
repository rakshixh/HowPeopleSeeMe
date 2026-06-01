// ============================================================
// Analytics Utilities — Compute session results from raw data
// ============================================================

import type { AppreciationCount, SessionResults } from '@/types/response.types';
import { APPRECIATION_MAP } from '@/lib/constants';
import { percentage } from './helpers';

interface RawCount {
  _id: string; // appreciationType
  count: number;
}

/**
 * Transform raw MongoDB aggregation counts into rich AppreciationCount objects.
 * Fills in zero-count items for all 12 types.
 */
export function buildDistribution(
  rawCounts: RawCount[],
  totalResponses: number
): AppreciationCount[] {
  const countMap = new Map(rawCounts.map((r) => [r._id, r.count]));

  const distribution: AppreciationCount[] = [];

  for (const [type, option] of APPRECIATION_MAP) {
    const count = countMap.get(type) ?? 0;
    distribution.push({
      type: option.type,
      emoji: option.emoji,
      label: option.label,
      count,
      percentage: percentage(count, totalResponses),
      color: option.color,
      bgColor: option.bgColor,
    });
  }

  // Sort by count descending
  return distribution.sort((a, b) => b.count - a.count);
}

/**
 * Build full session results from raw data.
 */
export function buildSessionResults(
  sessionId: string,
  ownerName: string,
  totalResponses: number,
  rawCounts: RawCount[],
  expiresAt: string,
  isExpired: boolean
): SessionResults {
  const distribution = buildDistribution(rawCounts, totalResponses);

  // Only include items with at least 1 vote for insights
  const withVotes = distribution.filter((d) => d.count > 0);

  return {
    sessionId,
    ownerName,
    totalResponses,
    distribution,
    topAppreciation: withVotes[0] ?? null,
    secondaryAppreciation: withVotes[1] ?? null,
    // "Hidden strength" = third-ranked item (lesser known but present)
    hiddenStrength: withVotes[2] ?? null,
    isExpired,
    expiresAt,
  };
}
