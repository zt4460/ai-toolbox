import Image from 'next/image';
import { Download, Trash2, X } from 'lucide-react';
import type { AssetRecord } from '@/features/assets/types';

interface AssetPreviewDialogProps {
  record: AssetRecord | null;
  onClose: () => void;
  onDelete: (id: string) => Promise<void> | void;
  onDownload: (record: AssetRecord) => Promise<void> | void;
}

export function AssetPreviewDialog({ record, onClose, onDelete, onDownload }: AssetPreviewDialogProps) {
  if (!record) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <p className="text-sm text-gray-500">图片详情</p>
            <h2 className="text-lg font-semibold text-gray-900">{record.resolution} · {record.ratio}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
            <Image src={record.imageUrl} alt={record.prompt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 640px" />
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">提示词</p>
              <p className="mt-2 text-sm leading-6 text-gray-600">{record.prompt}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
              <p>消耗积分：{record.creditsCost}</p>
              <p className="mt-1">创建时间：{new Date(record.createdAt).toLocaleString()}</p>
            </div>
            <div className="mt-auto flex gap-3">
              <button
                type="button"
                onClick={() => onDownload(record)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
              >
                <Download className="h-4 w-4" />
                下载
              </button>
              <button
                type="button"
                onClick={() => onDelete(record.id)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm text-white transition hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4" />
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
