import { requireSessionUserId } from '@/lib/auth/session';
import { getCreditBalance } from '@/features/credits/server/credits-service';
import { jsonFromError, jsonSuccess } from '@/lib/http/response';

export async function GET() {
  try {
    const userId = await requireSessionUserId();
    const credits = await getCreditBalance(userId);
    return jsonSuccess({ credits });
  } catch (error) {
    return jsonFromError(error);
  }
}
