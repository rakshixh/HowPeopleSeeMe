// ============================================================
// POST /api/session — Create a new session
// ============================================================

import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Session from '@/models/Session';
import Analytics from '@/models/Analytics';
import { createSessionSchema } from '@/validators/session.validator';
import {
  successResponse,
  badRequest,
  tooManyRequests,
  serverError,
} from '@/lib/api-response';
import {
  generateSessionId,
  getClientIp,
  hashIp,
  buildShareUrl,
  buildDashboardUrl,
} from '@/utils/helpers';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  RATE_LIMIT_WINDOW_MS,
  CREATE_SESSION_RATE_LIMIT,
  SESSION_LIFETIME_MS,
} from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = getClientIp(request);
    const ipHash = hashIp(ip);
    const rl = checkRateLimit(`create:${ipHash}`, CREATE_SESSION_RATE_LIMIT, RATE_LIMIT_WINDOW_MS);

    if (!rl.allowed) {
      return tooManyRequests('You are creating sessions too quickly. Please wait a moment.');
    }

    // Parse and validate body
    const body = await request.json().catch(() => null);
    if (!body) return badRequest('Invalid JSON body');

    const parsed = createSessionSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message ?? 'Invalid input');
    }

    const { ownerName } = parsed.data;

    await connectDB();

    const expiresAt = new Date(Date.now() + SESSION_LIFETIME_MS);
    let sessionId = '';
    let retries = 5;
    let created = false;

    // Retry loop to handle highly unlikely NanoID collisions
    while (retries > 0 && !created) {
      try {
        sessionId = generateSessionId();
        await Session.create({ sessionId, ownerName, expiresAt });
        created = true;
      } catch (err: any) {
        // 11000 is MongoDB duplicate key error code
        if (err.code === 11000) {
          retries--;
          if (retries === 0) {
            throw new Error('Failed to generate a unique session ID after multiple retries.');
          }
        } else {
          throw err;
        }
      }
    }

    // Create analytics record
    await Analytics.create({ sessionId, expiresAt });

    return successResponse(
      {
        sessionId,
        ownerName,
        shareUrl: buildShareUrl(sessionId),
        dashboardUrl: buildDashboardUrl(sessionId),
        expiresAt: expiresAt.toISOString(),
      },
      'Session created successfully',
      201
    );
  } catch (error) {
    console.error('[POST /api/session]', error);
    return serverError();
  }
}
