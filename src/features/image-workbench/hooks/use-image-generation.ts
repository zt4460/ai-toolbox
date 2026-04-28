import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WORKBENCH_RESOLUTIONS, WORKBENCH_RATIOS } from '@/features/image-workbench/constants';
import { buildGenerationPayload, buildPresetPromptContext } from '@/features/image-workbench/preset-payload';
import { getPresetDefinition } from '@/features/image-workbench/presets';
import type { GeneratedImage, ImagePreset, WorkbenchRatio, WorkbenchResolution } from '@/features/image-workbench/types';

export function useImageGeneration(refreshUser?: () => Promise<void>, currentCredits?: number) {
  const router = useRouter();
  const [selectedPreset, setSelectedPreset] = useState<ImagePreset>('freeform');
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState<WorkbenchResolution>(WORKBENCH_RESOLUTIONS[1]);
  const [ratio, setRatio] = useState<WorkbenchRatio>(WORKBENCH_RATIOS[0]);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [insufficientCredits, setInsufficientCredits] = useState(false);

  const selectedPresetDefinition = useMemo(() => getPresetDefinition(selectedPreset), [selectedPreset]);
  const creditsCost = useMemo(() => resolution.credits, [resolution]);
  const presetContext = useMemo(() => buildPresetPromptContext(selectedPreset), [selectedPreset]);

  function handlePresetChange(nextPreset: ImagePreset) {
    const definition = getPresetDefinition(nextPreset);
    setSelectedPreset(nextPreset);
    setError(null);
    setSuccessMessage(null);

    const nextResolution = WORKBENCH_RESOLUTIONS.find((item) => item.id === definition.defaultResolution);
    const nextRatio = WORKBENCH_RATIOS.find((item) => item.id === definition.defaultRatio);

    if (nextResolution) {
      setResolution(nextResolution);
    }

    if (nextRatio) {
      setRatio(nextRatio);
    }

    if (!definition.supportsReferenceImage) {
      setReferenceImage(null);
    }
  }

  async function generateImage() {
    if (!prompt.trim()) {
      return;
    }

    if (!selectedPresetDefinition.enabled) {
      setError(`${selectedPresetDefinition.label} 还未开放，请先使用自由创作模式。`);
      return;
    }

    if (currentCredits == null) {
      router.push('/auth');
      return;
    }

    if (currentCredits < creditsCost) {
      setInsufficientCredits(true);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccessMessage(null);
    setInsufficientCredits(false);

    try {
      const response = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          buildGenerationPayload({
            prompt,
            preset: selectedPreset,
            resolution,
            ratio,
            referenceImage,
          }),
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth');
          return;
        }

        if (response.status === 402) {
          setInsufficientCredits(true);
          return;
        }

        throw new Error(data.error || '生成失败，请重试');
      }

      const images = (data.imageUrls || []).map((url: string, index: number) => ({
        id: `${Date.now()}-${index}`,
        url,
        prompt,
        createdAt: new Date().toISOString(),
      }));

      setGeneratedImages(images);
      setSuccessMessage(`图片生成成功，消耗 ${data.creditsUsed ?? creditsCost} 积分`);
      await refreshUser?.();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '网络错误，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  }

  function resetGeneration() {
    setPrompt('');
    setReferenceImage(null);
    setGeneratedImages([]);
    setError(null);
    setSuccessMessage(null);
    setInsufficientCredits(false);
  }

  return {
    selectedPreset,
    setSelectedPreset: handlePresetChange,
    selectedPresetDefinition,
    prompt,
    setPrompt,
    resolution,
    setResolution,
    ratio,
    setRatio,
    referenceImage,
    setReferenceImage,
    generatedImages,
    isGenerating,
    error,
    successMessage,
    insufficientCredits,
    creditsCost,
    generateImage,
    resetGeneration,
    presetPlaceholder: presetContext.placeholder,
    supportsReferenceImage: presetContext.supportsReferenceImage,
    isPresetEnabled: presetContext.enabled,
  };
}
