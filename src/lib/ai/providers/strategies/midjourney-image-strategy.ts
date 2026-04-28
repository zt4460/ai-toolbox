import type { GenerateImageParams, GenerateImageResult, ProviderErrorCode, QueryImageTaskResult } from '@/lib/ai/image-provider-types';
import type { ImageProviderStrategy } from '@/lib/ai/providers/strategies/types';

function mapErrorCode(status: number): ProviderErrorCode {
  if (status === 400) return 'invalid_request';
  if (status === 401 || status === 403) return 'unauthorized';
  if (status === 429) return 'rate_limited';
  if (status >= 500) return 'upstream_unavailable';
  return 'unknown';
}

function normalizeMjStatus(status: string | undefined) {
  const value = (status || '').toUpperCase();
  if (['SUCCESS', 'DONE', 'FINISHED'].includes(value)) return 'succeeded' as const;
  if (['FAIL', 'FAILED', 'ERROR'].includes(value)) return 'failed' as const;
  if (['IN_PROGRESS', 'PROCESSING', 'RUNNING'].includes(value)) return 'processing' as const;
  return 'queued' as const;
}

function extractTaskId(payload: unknown) {
  if (!payload || typeof payload !== 'object') return undefined;
  const record = payload as Record<string, unknown>;
  const directTaskId = record.taskId;
  if (typeof directTaskId === 'string' && directTaskId) return directTaskId;
  const data = record.data;
  if (data && typeof data === 'object') {
    const nestedTaskId = (data as Record<string, unknown>).taskId;
    if (typeof nestedTaskId === 'string' && nestedTaskId) return nestedTaskId;
  }
  return undefined;
}

function extractUrls(payload: unknown): string[] {
  if (!payload || typeof payload !== 'object') return [];
  const data = (payload as Record<string, unknown>).data;
  if (!data || typeof data !== 'object') return [];

  const imageUrl = (data as Record<string, unknown>).imageUrl;
  if (typeof imageUrl === 'string' && imageUrl) return [imageUrl];

  const imageUrls = (data as Record<string, unknown>).imageUrls;
  if (Array.isArray(imageUrls)) {
    return imageUrls.filter((item): item is string => typeof item === 'string' && Boolean(item));
  }

  return [];
}

function extractProgress(payload: unknown) {
  if (!payload || typeof payload !== 'object') return undefined;
  const data = (payload as Record<string, unknown>).data;
  if (!data || typeof data !== 'object') return undefined;
  const progress = (data as Record<string, unknown>).progress;
  return typeof progress === 'number' ? progress : undefined;
}

export class MidjourneyImageStrategy implements ImageProviderStrategy {
  matchesModel(model: string) {
    return /^mj-|^midjourney-/i.test(model);
  }

  async generate(baseUrl: string, apiKey: string, params: GenerateImageParams): Promise<GenerateImageResult> {
    const response = await fetch(`${baseUrl}/mj/submit/imagine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: params.prompt,
        model: params.model,
      }),
    });

    const json = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        status: 'failed',
        errorCode: mapErrorCode(response.status),
        errorMessage: 'Midjourney 任务提交失败',
      };
    }

    const taskId = extractTaskId(json);
    if (!taskId) {
      return {
        status: 'failed',
        errorCode: 'unknown',
        errorMessage: '供应商未返回任务编号',
      };
    }

    return {
      status: 'queued',
      taskId,
      progress: 0,
    };
  }

  async queryStatus(baseUrl: string, apiKey: string, taskId: string): Promise<QueryImageTaskResult> {
    const response = await fetch(`${baseUrl}/mj/task/${taskId}/fetch`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const json = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        status: 'failed',
        taskId,
        errorCode: mapErrorCode(response.status),
        errorMessage: 'Midjourney 任务查询失败',
      };
    }

    const payload = json && typeof json === 'object' ? (json as Record<string, unknown>) : {};
    const data = payload.data && typeof payload.data === 'object' ? (payload.data as Record<string, unknown>) : payload;
    const statusValue = typeof data.status === 'string' ? data.status : undefined;

    return {
      status: normalizeMjStatus(statusValue),
      taskId,
      imageUrls: extractUrls(json),
      progress: extractProgress(json),
      errorCode: normalizeMjStatus(statusValue) === 'failed' ? 'upstream_unavailable' : undefined,
      errorMessage: normalizeMjStatus(statusValue) === 'failed' ? 'Midjourney 任务执行失败' : undefined,
    };
  }
}
