import { NextRequest } from 'next/server';
import { requireSessionUserId } from '@/lib/auth/session';
import { deleteGenerationRecord, getGenerationRecord } from '@/features/assets/server/assets-service';
import { jsonFromError, jsonSuccess } from '@/lib/http/response';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await requireSessionUserId();
    const { id } = await params;
    const record = await getGenerationRecord(userId, id);
    return jsonSuccess({ record });
  } catch (error) {
    return jsonFromError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await requireSessionUserId();
    const { id } = await params;
    await deleteGenerationRecord(userId, id);
    return jsonSuccess({ message: '删除成功' });
  } catch (error) {
    return jsonFromError(error);
  }
}
