import { NextRequest } from 'next/server';
import { requireSessionUserId } from '@/lib/auth/session';
import { jsonFromError, jsonSuccess } from '@/lib/http/response';
import { requireAdminUser } from '@/features/auth/server/auth-service';
import {
  createActivationCode,
  createActivationCodesBatch,
  listActivationCodes,
} from '@/features/credits/server/activation-code-admin-service';

export async function GET(request: NextRequest) {
  try {
    const userId = await requireSessionUserId();
    await requireAdminUser(userId);
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get('status') || 'all') as 'all' | 'unused' | 'used' | 'disabled';
    const result = await listActivationCodes({ status });
    return jsonSuccess(result);
  } catch (error) {
    return jsonFromError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireSessionUserId();
    await requireAdminUser(userId);
    const body = await request.json();

    if (body.mode === 'batch') {
      const result = await createActivationCodesBatch({
        cardType: body.cardType,
        points: Number(body.points),
        count: Number(body.count),
        expiresAt: body.expiresAt || null,
        days: body.days == null ? undefined : Number(body.days),
        price: body.price == null ? undefined : Number(body.price),
      });
      return jsonSuccess(result);
    }

    const record = await createActivationCode({
      cardType: body.cardType,
      points: Number(body.points),
      expiresAt: body.expiresAt || null,
      days: body.days == null ? undefined : Number(body.days),
      price: body.price == null ? undefined : Number(body.price),
      code: body.code,
    });

    return jsonSuccess({ record });
  } catch (error) {
    return jsonFromError(error);
  }
}
