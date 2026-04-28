import { createImageGenerator } from '@/lib/ai/providers/provider-factory';

export function createImageGenerationClient() {
  return createImageGenerator();
}
