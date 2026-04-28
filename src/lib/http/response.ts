import { NextResponse } from 'next/server';
import { HttpError, isHttpError } from '@/lib/http/errors';

export function jsonSuccess<T extends Record<string, unknown>>(
  data: T,
  init?: ResponseInit,
) {
  return NextResponse.json({ success: true, ...data }, init);
}

export function jsonError(
  message: string,
  status = 500,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export function jsonFromError(error: unknown) {
  if (isHttpError(error)) {
    return jsonError(error.message, error.status);
  }

  console.error(error);
  return jsonError('服务器错误', 500);
}

export function assert(condition: unknown, status: number, message: string): asserts condition {
  if (!condition) {
    throw new HttpError(status, message);
  }
}
