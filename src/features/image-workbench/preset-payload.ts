import type { ImagePreset, WorkbenchRatio, WorkbenchResolution } from '@/features/image-workbench/types';
import { getPresetDefinition } from '@/features/image-workbench/presets';

interface BuildGenerationPayloadInput {
  prompt: string;
  preset: ImagePreset;
  resolution: WorkbenchResolution;
  ratio: WorkbenchRatio;
  referenceImage: string | null;
}

export function buildPresetPromptContext(preset: ImagePreset) {
  const definition = getPresetDefinition(preset);
  return {
    placeholder: definition.promptPlaceholder,
    supportsReferenceImage: definition.supportsReferenceImage,
    enabled: definition.enabled,
    label: definition.label,
    description: definition.description,
  };
}

export function buildGenerationPayload(input: BuildGenerationPayloadInput) {
  return {
    prompt: input.prompt,
    size: input.resolution.id,
    ratio: input.ratio.id,
    preset: input.preset,
    referenceImage: input.referenceImage,
  };
}
