import { NextRequest } from 'next/server';
import { registerUser } from '@/features/auth/server/auth-service';
import { jsonFromError, jsonSuccess } from '@/lib/http/response';

export async function POST(request: NextRequest) {
  try {
    const { identifier, password, code, activationCode } = await request.json();
    const result = await registerUser(identifier, code, password, activationCode);
    return jsonSuccess(result);
  } catch (error) {
    return jsonFromError(error);
  }
}
