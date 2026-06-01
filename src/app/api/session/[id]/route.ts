// ============================================================
// GET /api/session/[id] — Fetch session + results
// ============================================================

import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Session from '@/models/Session';
import Response from '@/models/Response';
import Analytics from '@/models/Analytics';
import { sessionIdSchema } from '@/validators/session.validator';
import {
  successResponse,
  badRequest,
  notFound,
  serverError,
  sessionExpired,
} from '@/lib/api-response';
import { isExpired } from '@/utils/date';
import { buildSessionResults } from '@/utils/analytics';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const parsed = sessionIdSchema.safeParse({ id });
    if (!parsed.success) return badRequest('Invalid session ID');

    await connectDB();

    const session = await Session.findOne({ sessionId: id }).lean();
    if (!session) return notFound('Session');

    if (isExpired(session.expiresAt)) {
      return sessionExpired();
    }

    // Increment view count atomically
    await Analytics.findOneAndUpdate(
      { sessionId: id },
      { $inc: { totalViews: 1 } },
      { upsert: true }
    );

    // Aggregate response counts by type
    const rawCounts = await Response.aggregate([
      { $match: { sessionId: id } },
      { $group: { _id: '$appreciationType', count: { $sum: 1 } } },
    ]);

    const results = buildSessionResults(
      id,
      session.ownerName,
      session.totalResponses,
      rawCounts,
      session.expiresAt.toISOString(),
      false
    );

    return successResponse(results);
  } catch (error) {
    console.error('[GET /api/session/[id]]', error);
    return serverError();
  }
}
