import type { ChangeEvent } from 'react';
import { Upload, X } from 'lucide-react';

interface ReferenceImageUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
  hidden?: boolean;
}

export function ReferenceImageUpload({ value, onChange, hidden = false }: ReferenceImageUploadProps) {
  if (hidden) {
    return null;
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">参考图</h3>
        {value ? (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
          >
            <X className="h-3.5 w-3.5" />
            清除
          </button>
        ) : null}
      </div>
      {value ? (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="参考图预览" className="h-40 w-full object-cover" />
        </div>
      ) : (
        <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-center transition hover:border-gray-400 hover:bg-gray-100">
          <Upload className="mb-3 h-8 w-8 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">上传参考图</p>
          <p className="mt-1 text-xs text-gray-400">支持 JPG、PNG，后续可扩展为更专业模式</p>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
      )}
    </div>
  );
}
