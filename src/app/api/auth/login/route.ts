import { NextRequest } from 'next/server';
import { loginUser } from '@/features/auth/server/auth-service';
import { jsonFromError, jsonSuccess } from '@/lib/http/response';

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();
    const user = await loginUser(identifier, password);
    return jsonSuccess({ user, message: '登录成功' });
  } catch (error) {
    return jsonFromError(error);
  }
}
