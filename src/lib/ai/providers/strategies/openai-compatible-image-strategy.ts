import type { GenerateImageParams, GenerateImageResult, ProviderErrorCode, QueryImageTaskResult } from '@/lib/ai/image-provider-types';
import type { ImageProviderStrategy } from '@/lib/ai/providers/strategies/types';

function mapErrorCode(status: number): ProviderErrorCode {
  if (status === 400) return 'invalid_request';
  if (status === 401 || status === 403) return 'unauthorized';
  if (status === 429) return 'rate_limited';
  if (status >= 500) return 'upstream_unavailable';
  return 'unknown';
}

function normalizeSize(size?: string) {
  if (size === '1K') return '1024x1024';
  if (size === '2K') return '1536x1536';
  if (size === '4K') return '2048x2048';
  return size || '1024x1024';
}

function extractImageUrls(payload: unknown): string[] {
  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const data = (payload as { data?: unknown }).data;
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const url = (item as { url?: unknown }).url;
      return typeof url === 'string' ? url : null;
    })
    .filter((url): url is string => Boolean(url));
}

export class OpenAiCompatibleImageStrategy implements ImageProviderStrategy {
  matchesModel(model: string) {
    return !/^mj-|^midjourney-/i.test(model);
  }

  async generate(baseUrl: string, apiKey: string, params: GenerateImageParams): Promise<GenerateImageResult> {
    const response = await fetch(`${baseUrl}/v1/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: params.model,
        prompt: params.prompt,
        size: normalizeSize(params.size),
        n: 1,
      }),
    });

    const json = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        status: 'failed',
        errorCode: mapErrorCode(response.status),
        errorMessage:
          (json && typeof json === 'object' && 'error' in json && typeof (json as { error?: unknown }).error === 'string'
            ? (json as { error: string }).error
            : undefined) || '图片生成失败',
      };
    }

    const imageUrls = extractImageUrls(json);
    if (!imageUrls.length) {
      return {
        status: 'failed',
        errorCode: 'unknown',
        errorMessage: '供应商未返回图片地址',
      };
    }

    return {
      status: 'succeeded',
      imageUrls,
      progress: 100,
    };
  }

  async queryStatus(_baseUrl: string, _apiKey: string, taskId: string): Promise<QueryImageTaskResult> {
    return {
      status: 'failed',
      taskId,
      errorCode: 'invalid_request',
      errorMessage: '当前模型不支持任务轮询',
    };
  }
}
