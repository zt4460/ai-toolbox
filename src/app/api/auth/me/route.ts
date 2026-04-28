import { requireSessionUserId } from '@/lib/auth/session';
import { getCurrentUser } from '@/features/auth/server/auth-service';
import { jsonFromError, jsonSuccess } from '@/lib/http/response';

export async function GET() {
  try {
    const userId = await requireSessionUserId();
    const user = await getCurrentUser(userId);
    return jsonSuccess({ user });
  } catch (error) {
    return jsonFromError(error);
  }
}
