export type ImageTaskStatus = 'queued' | 'processing' | 'succeeded' | 'failed';

export type ProviderErrorCode =
  | 'unauthorized'
  | 'rate_limited'
  | 'invalid_request'
  | 'upstream_unavailable'
  | 'timeout'
  | 'content_blocked'
  | 'unsupported_model'
  | 'unknown';

export interface GenerateImageParams {
  prompt: string;
  size?: string;
  ratio?: string;
  referenceImage?: string | null;
  model?: string;
  userId?: string;
  watermark?: boolean;
}

export interface GenerateImageResult {
  status: ImageTaskStatus;
  taskId?: string;
  imageUrls?: string[];
  progress?: number;
  errorCode?: ProviderErrorCode;
  errorMessage?: string;
}

export interface QueryImageTaskResult {
  status: ImageTaskStatus;
  taskId: string;
  imageUrls?: string[];
  progress?: number;
  errorCode?: ProviderErrorCode;
  errorMessage?: string;
}

export interface BalanceInfo {
  balance?: number;
  currency?: string;
  rawLabel?: string;
}

export interface ImageGenerator {
  generate(params: GenerateImageParams): Promise<GenerateImageResult>;
  queryStatus(taskId: string): Promise<QueryImageTaskResult>;
  checkBalance?(): Promise<BalanceInfo | null>;
}
