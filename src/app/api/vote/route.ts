// ============================================================
// POST /api/vote — Submit an appreciation vote
// ============================================================

import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Session from '@/models/Session';
import Response from '@/models/Response';
import Analytics from '@/models/Analytics';
import { submitVoteSchema } from '@/validators/response.validator';
import {
  successResponse,
  badRequest,
  notFound,
  tooManyRequests,
  conflict,
  serverError,
  sessionExpired,
} from '@/lib/api-response';
import { getClientIp, hashIp } from '@/utils/helpers';
import { checkRateLimit } from '@/lib/rate-limit';
import { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } from '@/lib/constants';
import { isExpired } from '@/utils/date';
import { SESSION_LIFETIME_MS } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP globally
    const ip = getClientIp(request);
    const ipHash = hashIp(ip);
    const rl = checkRateLimit(`vote:${ipHash}`, RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS);

    if (!rl.allowed) {
      return tooManyRequests();
    }

    // Parse and validate body
    const body = await request.json().catch(() => null);
    if (!body) return badRequest('Invalid JSON body');

    const parsed = submitVoteSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message ?? 'Invalid input');
    }

    const { sessionId, appreciationType } = parsed.data;

    await connectDB();

    // Verify session exists and is not expired
    const session = await Session.findOne({ sessionId }).lean();
    if (!session) return notFound('Session');
    if (isExpired(session.expiresAt)) return sessionExpired();

    // Anti-spam: attempt to insert (unique compound index enforces 1 vote per type per IP)
    try {
      await Response.create({
        sessionId,
        appreciationType,
        ipHash,
        expiresAt: session.expiresAt,
      });
    } catch (err: unknown) {
      // MongoDB duplicate key error (code 11000)
      if (typeof err === 'object' && err !== null && 'code' in err && (err as { code: number }).code === 11000) {
        return conflict('You have already voted for this appreciation type in this session.');
      }
      throw err;
    }

    // Increment counters atomically
    await Promise.all([
      Session.updateOne({ sessionId }, { $inc: { totalResponses: 1 } }),
      Analytics.updateOne(
        { sessionId },
        { $inc: { totalResponses: 1 } },
        { upsert: true }
      ),
    ]);

    return successResponse(
      { success: true },
      "You just made someone's day better ❤️"
    );
  } catch (error) {
    console.error('[POST /api/vote]', error);
    return serverError();
  }
}
