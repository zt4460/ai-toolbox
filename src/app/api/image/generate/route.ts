import { NextRequest } from 'next/server';
import { requireSessionUserId } from '@/lib/auth/session';
import { generateImagesForUser } from '@/features/image-workbench/server/image-generation-service';
import { jsonFromError, jsonSuccess } from '@/lib/http/response';

export async function POST(request: NextRequest) {
  try {
    const userId = await requireSessionUserId();
    const { prompt, size, ratio, preset, referenceImage } = await request.json();
    const result = await generateImagesForUser({
      userId,
      prompt,
      size,
      ratio,
      preset,
      referenceImage,
      headers: request.headers,
    });
    return jsonSuccess(result);
  } catch (error) {
    return jsonFromError(error);
  }
}
