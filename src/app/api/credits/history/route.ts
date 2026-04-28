import { NextRequest } from 'next/server';
import { requireSessionUserId } from '@/lib/auth/session';
import { getCreditHistory } from '@/features/credits/server/credits-service';
import { jsonFromError, jsonSuccess } from '@/lib/http/response';

export async function GET(request: NextRequest) {
  try {
    const userId = await requireSessionUserId();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const result = await getCreditHistory(userId, type);
    return jsonSuccess(result);
  } catch (error) {
    return jsonFromError(error);
  }
}
