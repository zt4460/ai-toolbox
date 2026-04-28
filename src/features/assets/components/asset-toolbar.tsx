import { Search } from 'lucide-react';

interface AssetToolbarProps {
  value: string;
  onChange: (value: string) => void;
}

export function AssetToolbar({ value, onChange }: AssetToolbarProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="搜索图片提示词..."
        className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-gray-400"
      />
    </div>
  );
}
