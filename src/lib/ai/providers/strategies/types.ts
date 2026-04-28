import type { GenerateImageParams, GenerateImageResult, QueryImageTaskResult } from '@/lib/ai/image-provider-types';

export interface ImageProviderStrategy {
  matchesModel(model: string): boolean;
  generate(baseUrl: string, apiKey: string, params: GenerateImageParams): Promise<GenerateImageResult>;
  queryStatus(baseUrl: string, apiKey: string, taskId: string): Promise<QueryImageTaskResult>;
}
