import type { ImageGenerator } from '@/lib/ai/image-provider-types';
import { YunwuImageProvider } from '@/lib/ai/providers/yunwu-image-provider';

export function createImageGenerator(): ImageGenerator {
  const provider = process.env.AI_IMAGE_PROVIDER || 'yunwu';

  switch (provider) {
    case 'yunwu':
      return new YunwuImageProvider();
    default:
      throw new Error(`Unsupported AI image provider: ${provider}`);
  }
}
