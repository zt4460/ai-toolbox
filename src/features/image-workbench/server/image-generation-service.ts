import { createGenerationRecord } from '@/features/assets/server/assets-service';
import type { ImagePreset } from '@/features/image-workbench/types';
import { getPresetDefinition } from '@/features/image-workbench/presets';
import { createImageGenerationClient } from '@/lib/ai/image-client';
import { HttpError } from '@/lib/http/errors';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const CREDIT_COST_BY_SIZE: Record<string, number> = {
  '1K': 2,
  '2K': 4,
  '4K': 8,
};

export async function generateImagesForUser(input: {
  userId: string;
  prompt: string;
  size?: string;
  ratio?: string;
  headers: Headers;
  preset?: ImagePreset;
  referenceImage?: string | null;
}) {
  const prompt = input.prompt.trim();
  if (!prompt) {
    throw new HttpError(400, '请提供有效的图片描述');
  }

  const preset = input.preset || 'freeform';
  const presetDefinition = getPresetDefinition(preset);
  if (!presetDefinition) {
    throw new HttpError(400, '无效的生成模式');
  }

  if (!presetDefinition.enabled) {
    throw new HttpError(400, `${presetDefinition.label} 还未开放`);
  }

  const size = input.size || presetDefinition.defaultResolution;
  const ratio = input.ratio || presetDefinition.defaultRatio;
  const supabase = getSupabaseClient();
  const creditsRequired = CREDIT_COST_BY_SIZE[size] || CREDIT_COST_BY_SIZE['2K'];
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('credits')
    .eq('id', input.userId)
    .single();

  if (userError || !user) {
    throw new HttpError(404, '用户不存在');
  }

  if ((user.credits || 0) < creditsRequired) {
    throw new HttpError(402, '积分不足');
  }

  const imageClient = createImageGenerationClient();
  const result = await imageClient.generate({
    prompt,
    size,
    ratio,
    referenceImage: presetDefinition.supportsReferenceImage ? (input.referenceImage || null) : null,
    watermark: true,
    userId: input.userId,
  });

  if (result.status !== 'succeeded' || !result.imageUrls?.length) {
    if (result.status === 'queued' || result.status === 'processing') {
      throw new HttpError(400, '当前模型返回异步任务，前端轮询流程尚未接入');
    }

    throw new HttpError(500, result.errorMessage || '图片生成失败');
  }

  const firstUrl = result.imageUrls[0] ?? null;
  const previousCredits = user.credits || 0;
  const nextCredits = previousCredits - creditsRequired;

  const { error: updateUserError } = await supabase
    .from('users')
    .update({ credits: nextCredits })
    .eq('id', input.userId);

  if (updateUserError) {
    throw new HttpError(500, updateUserError.message);
  }

  const { error: transactionError } = await supabase.from('credit_transactions').insert({
    user_id: input.userId,
    type: 'consume',
    amount: -creditsRequired,
    balance_before: previousCredits,
    balance_after: nextCredits,
    source: 'image_generation',
    description: `图片生成消耗（${size}）`,
  });

  if (transactionError) {
    throw new HttpError(500, transactionError.message);
  }

  await createGenerationRecord(input.userId, {
    type: 'image',
    prompt,
    parameters: {
      preset,
      size,
      ratio,
      referenceImage: presetDefinition.supportsReferenceImage ? (input.referenceImage || null) : null,
      urls: result.imageUrls,
      providerStatus: result.status,
      taskId: result.taskId || null,
    },
    result_url: firstUrl,
    status: 'succeeded',
    credits_used: creditsRequired,
  });

  return {
    imageUrls: result.imageUrls,
    creditsUsed: creditsRequired,
  };
}
