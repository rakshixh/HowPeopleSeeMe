// ============================================================
// GET /api/analytics/[id] — Get analytics for a session
// PATCH /api/analytics/[id] — Increment share count
// ============================================================

import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Analytics from '@/models/Analytics';
import Session from '@/models/Session';
import { sessionIdSchema } from '@/validators/session.validator';
import {
  successResponse,
  badRequest,
  notFound,
  serverError,
} from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const parsed = sessionIdSchema.safeParse({ id });
    if (!parsed.success) return badRequest('Invalid session ID');

    await connectDB();

    const analytics = await Analytics.findOne({ sessionId: id }).lean();
    if (!analytics) return notFound('Analytics');

    const session = await Session.findOne({ sessionId: id }).select('totalResponses').lean();
    const responseRate =
      analytics.totalViews > 0
        ? Math.round((analytics.totalResponses / analytics.totalViews) * 100)
        : 0;

    return successResponse({
      sessionId: id,
      totalViews: analytics.totalViews,
      totalResponses: analytics.totalResponses,
      shares: analytics.shares,
      responseRate,
    });
  } catch (error) {
    console.error('[GET /api/analytics/[id]]', error);
    return serverError();
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const parsed = sessionIdSchema.safeParse({ id });
    if (!parsed.success) return badRequest('Invalid session ID');

    await connectDB();

    const analytics = await Analytics.findOneAndUpdate(
      { sessionId: id },
      { $inc: { shares: 1 } },
      { new: true }
    ).lean();

    if (!analytics) return notFound('Analytics');

    return successResponse({ shares: analytics.shares });
  } catch (error) {
    console.error('[PATCH /api/analytics/[id]]', error);
    return serverError();
  }
}
