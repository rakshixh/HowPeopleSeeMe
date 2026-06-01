// ============================================================
// API Response Utility — Consistent response shapes
// ============================================================

import { NextResponse } from 'next/server';

interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}

export function successResponse<T>(
  data: T,
  message?: string,
  status = 200
): NextResponse<SuccessResponse<T>> {
  return NextResponse.json(
    { success: true, data, ...(message && { message }) },
    { status }
  );
}

export function errorResponse(
  error: string,
  status = 500,
  code?: string
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    { success: false, error, ...(code && { code }) },
    { status }
  );
}

// Common errors
export const notFound = (resource = 'Resource') =>
  errorResponse(`${resource} not found`, 404, 'NOT_FOUND');

export const unauthorized = () =>
  errorResponse('Unauthorized', 401, 'UNAUTHORIZED');

export const badRequest = (msg = 'Bad request') =>
  errorResponse(msg, 400, 'BAD_REQUEST');

export const tooManyRequests = (msg = 'Too many requests. Please slow down.') =>
  errorResponse(msg, 429, 'RATE_LIMITED');

export const conflict = (msg = 'Conflict') =>
  errorResponse(msg, 409, 'CONFLICT');

export const serverError = (msg = 'Internal server error') =>
  errorResponse(msg, 500, 'SERVER_ERROR');

export const sessionExpired = () =>
  errorResponse('This session has expired', 410, 'SESSION_EXPIRED');
