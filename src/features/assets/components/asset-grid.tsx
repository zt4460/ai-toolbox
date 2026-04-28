import Image from 'next/image';
import type { AssetRecord } from '@/features/assets/types';

interface AssetGridProps {
  records: AssetRecord[];
  onSelect: (record: AssetRecord) => void;
}

export function AssetGrid({ records, onSelect }: AssetGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {records.map((record) => (
        <button
          key={record.id}
          type="button"
          onClick={() => onSelect(record)}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="relative aspect-square bg-gray-100">
            <Image src={record.imageUrl} alt={record.prompt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
          </div>
          <div className="space-y-2 p-4">
            <p className="line-clamp-2 text-sm text-gray-700">{record.prompt}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{record.resolution} · {record.ratio}</span>
              <span>-{record.creditsCost} 积分</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
