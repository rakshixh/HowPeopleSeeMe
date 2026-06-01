// ============================================================
// Analytics Service — Track and fetch analytics
// ============================================================

interface AnalyticsData {
  sessionId: string;
  totalViews: number;
  totalResponses: number;
  shares: number;
  responseRate: number;
}

export async function getAnalytics(sessionId: string): Promise<AnalyticsData | null> {
  try {
    const res = await fetch(`/api/analytics/${sessionId}`);
    const result = await res.json();
    if (!result.success) return null;
    return result.data as AnalyticsData;
  } catch {
    return null;
  }
}

export async function trackShare(sessionId: string): Promise<void> {
  try {
    await fetch(`/api/analytics/${sessionId}`, { method: 'PATCH' });
  } catch {
    // Fire-and-forget — don't block user on analytics failure
  }
}
