import { clearSessionCookie } from '@/lib/auth/session';
import { jsonFromError, jsonSuccess } from '@/lib/http/response';

export async function POST() {
  try {
    await clearSessionCookie();
    return jsonSuccess({ message: '已退出登录' });
  } catch (error) {
    return jsonFromError(error);
  }
}
