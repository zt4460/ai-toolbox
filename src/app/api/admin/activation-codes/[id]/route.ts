import { NextRequest } from 'next/server';
import { requireSessionUserId } from '@/lib/auth/session';
import { jsonFromError, jsonSuccess } from '@/lib/http/response';
import { requireAdminUser } from '@/features/auth/server/auth-service';
import { revokeActivationCode } from '@/features/credits/server/activation-code-admin-service';

export async function PATCH(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = await requireSessionUserId();
    await requireAdminUser(userId);
    const { id } = await context.params;
    const record = await revokeActivationCode(id);
    return jsonSuccess({ record, message: '卡密已作废' });
  } catch (error) {
    return jsonFromError(error);
  }
}
