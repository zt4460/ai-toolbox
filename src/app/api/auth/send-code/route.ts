import { NextRequest } from 'next/server';
import { sendVerificationCode } from '@/features/auth/server/auth-service';
import { jsonFromError, jsonSuccess } from '@/lib/http/response';

export async function POST(request: NextRequest) {
  try {
    const { identifier } = await request.json();
    const result = await sendVerificationCode(identifier);
    return jsonSuccess(result);
  } catch (error) {
    return jsonFromError(error);
  }
}
