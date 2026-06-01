'use client';

// ============================================================
// useAnalytics Hook
// ============================================================

import { useState, useEffect } from 'react';
import { getAnalytics, trackShare } from '@/services/api/analytics.service';

interface AnalyticsData {
  totalViews: number;
  totalResponses: number;
  shares: number;
  responseRate: number;
}

interface UseAnalyticsReturn {
  analytics: AnalyticsData | null;
  isLoading: boolean;
  recordShare: () => void;
}

export function useAnalytics(sessionId: string): UseAnalyticsReturn {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAnalytics(sessionId).then((data) => {
      setAnalytics(data);
      setIsLoading(false);
    });
  }, [sessionId]);

  const recordShare = () => {
    trackShare(sessionId);
    if (analytics) {
      setAnalytics((prev) => prev ? { ...prev, shares: prev.shares + 1 } : prev);
    }
  };

  return { analytics, isLoading, recordShare };
}
