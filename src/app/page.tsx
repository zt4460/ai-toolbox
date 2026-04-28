'use client';

import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle, RotateCcw, Send } from 'lucide-react';
import { useAuth } from './providers';
import { WorkbenchHeader } from '@/features/image-workbench/components/workbench-header';
import { PromptPanel } from '@/features/image-workbench/components/prompt-panel';
import { GenerationControls } from '@/features/image-workbench/components/generation-controls';
import { ReferenceImageUpload } from '@/features/image-workbench/components/reference-image-upload';
import { ResultGallery } from '@/features/image-workbench/components/result-gallery';
import { PresetSelector } from '@/features/image-workbench/components/preset-selector';
import { useImageGeneration } from '@/features/image-workbench/hooks/use-image-generation';
import { IMAGE_PRESETS } from '@/features/image-workbench/presets';
import { getUserDisplayName } from '@/features/auth/display-name';

export default function HomePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const {
    selectedPreset,
    setSelectedPreset,
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
    presetPlaceholder,
    supportsReferenceImage,
  } = useImageGeneration(refreshUser, user?.credits);

  const handleDownload = async (url: string, id: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `ai-toolbox-${id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkbenchHeader
        credits={user?.credits ?? 0}
        displayName={getUserDisplayName(user, undefined)}
        onCreditsClick={() => router.push(user ? '/profile?tab=credits' : '/auth')}
        onProfileClick={() => router.push(user ? '/profile' : '/auth')}
      />

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[380px_minmax(0,1fr)]">
        <section className="space-y-6">
          {successMessage ? (
            <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-none" />
              <span>{successMessage}</span>
            </div>
          ) : null}

          {error ? (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-none" />
              <span>{error}</span>
            </div>
          ) : null}

          {insufficientCredits ? (
            <div className="flex items-start justify-between gap-4 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-none" />
                <span>当前积分不足，请先前往个人中心激活卡密或补充积分。</span>
              </div>
              <button
                type="button"
                onClick={() => router.push(user ? '/profile?tab=credits' : '/auth')}
                className="rounded-xl bg-orange-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-orange-600"
              >
                去处理
              </button>
            </div>
          ) : null}

          <PresetSelector
            presets={IMAGE_PRESETS}
            selectedPreset={selectedPreset}
            onSelect={setSelectedPreset}
          />

          <PromptPanel
            value={prompt}
            onChange={setPrompt}
            placeholder={presetPlaceholder}
            description={selectedPresetDefinition.description}
          />

          <GenerationControls
            resolution={resolution}
            onResolutionChange={setResolution}
            ratio={ratio}
            onRatioChange={setRatio}
            creditsCost={creditsCost}
          />

          <ReferenceImageUpload
            value={referenceImage}
            onChange={setReferenceImage}
            hidden={!supportsReferenceImage}
          />

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={resetGeneration}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
              >
                <RotateCcw className="h-4 w-4" />
                重置
              </button>
              <button
                type="button"
                onClick={() => generateImage()}
                disabled={!prompt.trim() || isGenerating || !selectedPresetDefinition.enabled}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {isGenerating ? '生成中…' : selectedPresetDefinition.enabled ? '立即生成' : '暂未开放'}
              </button>
            </div>
          </div>
        </section>

        <section>
          <ResultGallery
            images={generatedImages}
            isGenerating={isGenerating}
            resolution={resolution}
            ratio={ratio}
            onDownload={handleDownload}
          />
        </section>
      </main>
    </div>
  );
}
