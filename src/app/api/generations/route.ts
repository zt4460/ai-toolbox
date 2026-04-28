import { NextRequest } from 'next/server';
import { requireSessionUserId } from '@/lib/auth/session';
import { createGenerationRecord, listGenerationRecords } from '@/features/assets/server/assets-service';
import { jsonFromError, jsonSuccess } from '@/lib/http/response';

export async function GET(request: NextRequest) {
  try {
    const userId = await requireSessionUserId();
    const { searchParams } = new URL(request.url);
    const result = await listGenerationRecords(userId, {
      type: searchParams.get('type'),
      status: searchParams.get('status'),
      page: Number.parseInt(searchParams.get('page') || '1', 10),
      limit: Number.parseInt(searchParams.get('limit') || '20', 10),
    });
    return jsonSuccess(result);
  } catch (error) {
    return jsonFromError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireSessionUserId();
    const { type, prompt, parameters, result_url, status, credits_used } = await request.json();
    const record = await createGenerationRecord(userId, {
      type,
      prompt,
      parameters,
      result_url,
      status,
      credits_used,
    });
    return jsonSuccess({ record });
  } catch (error) {
    return jsonFromError(error);
  }
}
