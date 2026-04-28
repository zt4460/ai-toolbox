import { NextRequest } from 'next/server';
import { requireSessionUserId } from '@/lib/auth/session';
import { activateCredits } from '@/features/credits/server/credits-service';
import { jsonFromError, jsonSuccess } from '@/lib/http/response';

export async function POST(request: NextRequest) {
  try {
    const userId = await requireSessionUserId();
    const { code } = await request.json();
    const result = await activateCredits(userId, code);
    return jsonSuccess(result);
  } catch (error) {
    return jsonFromError(error);
  }
}
