import { cookies } from 'next/headers';
import { HttpError } from '@/lib/http/errors';

const SESSION_COOKIE_NAME = 'session_token';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export interface SessionData {
  userId: string;
  issuedAt: number;
}

export function parseSessionToken(token?: string | null): SessionData | null {
  if (!token) {
    return null;
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId, issuedAtRaw] = decoded.split(':');
    const issuedAt = Number.parseInt(issuedAtRaw, 10);

    if (!userId || Number.isNaN(issuedAt)) {
      return null;
    }

    if (Date.now() - issuedAt > SESSION_MAX_AGE * 1000) {
      return null;
    }

    return { userId, issuedAt };
  } catch {
    return null;
  }
}

export async function getSessionUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return parseSessionToken(token)?.userId ?? null;
}

export async function requireSessionUserId() {
  const userId = await getSessionUserId();

  if (!userId) {
    throw new HttpError(401, '未登录或会话已过期');
  }

  return userId;
}

export async function setSessionCookie(userId: string) {
  const cookieStore = await cookies();
  const token = Buffer.from(`${userId}:${Date.now()}`).toString('base64');

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  return token;
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
