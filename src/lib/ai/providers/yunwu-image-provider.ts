import type { BalanceInfo, GenerateImageParams, GenerateImageResult, ImageGenerator, QueryImageTaskResult } from '@/lib/ai/image-provider-types';
import { SimpleRateLimiter } from '@/lib/ai/providers/rate-limiter';
import { MidjourneyImageStrategy } from '@/lib/ai/providers/strategies/midjourney-image-strategy';
import { OpenAiCompatibleImageStrategy } from '@/lib/ai/providers/strategies/openai-compatible-image-strategy';
import type { ImageProviderStrategy } from '@/lib/ai/providers/strategies/types';

const DEFAULT_BASE_URL = 'https://api.yunwu.site';
const DEFAULT_MIN_INTERVAL_MS = 400;

export class YunwuImageProvider implements ImageGenerator {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly defaultModel: string;
  private readonly limiter: SimpleRateLimiter;
  private readonly strategies: ImageProviderStrategy[];

  constructor() {
    this.baseUrl = (process.env.AI_IMAGE_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');
    this.apiKey = process.env.AI_IMAGE_API_KEY || '';
    this.defaultModel = process.env.AI_IMAGE_MODEL || 'gpt-image-1';
    this.limiter = new SimpleRateLimiter(Number(process.env.AI_IMAGE_MIN_INTERVAL_MS || DEFAULT_MIN_INTERVAL_MS));
    this.strategies = [new MidjourneyImageStrategy(), new OpenAiCompatibleImageStrategy()];
  }

  async generate(params: GenerateImageParams): Promise<GenerateImageResult> {
    this.assertConfigured();
    const strategy = this.resolveStrategy(params.model || this.defaultModel);
    return this.limiter.schedule(() =>
      strategy.generate(this.baseUrl, this.apiKey, {
        ...params,
        model: params.model || this.defaultModel,
      }),
    );
  }

  async queryStatus(taskId: string): Promise<QueryImageTaskResult> {
    this.assertConfigured();
    const strategy = this.resolveStrategy(this.defaultModel);
    return this.limiter.schedule(() => strategy.queryStatus(this.baseUrl, this.apiKey, taskId));
  }

  async checkBalance(): Promise<BalanceInfo | null> {
    if (!this.apiKey) {
      return null;
    }

    return null;
  }

  private resolveStrategy(model: string) {
    const strategy = this.strategies.find((item) => item.matchesModel(model));
    if (!strategy) {
      throw new Error(`No image provider strategy matched model: ${model}`);
    }
    return strategy;
  }

  private assertConfigured() {
    if (!this.apiKey) {
      throw new Error('AI_IMAGE_API_KEY is not set');
    }
  }
}
