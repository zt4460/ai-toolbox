import Image from 'next/image';
import { Download, Loader2 } from 'lucide-react';
import type { GeneratedImage, WorkbenchRatio, WorkbenchResolution } from '@/features/image-workbench/types';

interface ResultGalleryProps {
  images: GeneratedImage[];
  isGenerating: boolean;
  resolution: WorkbenchResolution;
  ratio: WorkbenchRatio;
  onDownload: (url: string, id: string) => Promise<void> | void;
}

export function ResultGallery({ images, isGenerating, resolution, ratio, onDownload }: ResultGalleryProps) {
  if (isGenerating) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-gray-400" />
        <p className="text-sm text-gray-500">正在生成图片，请稍候…</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-base font-medium text-gray-900">还没有生成结果</p>
        <p className="mt-2 text-sm text-gray-500">输入描述并点击立即生成后，图片会展示在这里。</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {images.map((image) => (
        <div key={image.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="relative aspect-square bg-gray-100">
            <Image src={image.url} alt={image.prompt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 640px" />
          </div>
          <div className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="line-clamp-2 text-sm text-gray-700">{image.prompt}</p>
              <p className="mt-2 text-xs text-gray-400">{resolution.label} · {ratio.id}</p>
            </div>
            <button
              type="button"
              onClick={() => onDownload(image.url, image.id)}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              下载
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
