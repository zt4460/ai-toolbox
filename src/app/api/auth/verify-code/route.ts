import { NextRequest } from 'next/server';
import { verifyCode } from '@/features/auth/server/auth-service';
import { jsonFromError, jsonSuccess } from '@/lib/http/response';

export async function POST(request: NextRequest) {
  try {
    const { identifier, code } = await request.json();
    await verifyCode(identifier, code);
    return jsonSuccess({ message: '验证码验证成功' });
  } catch (error) {
    return jsonFromError(error);
  }
}
