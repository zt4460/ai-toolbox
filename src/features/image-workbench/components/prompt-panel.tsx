import { Sparkles } from 'lucide-react';

interface PromptPanelProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  description: string;
}

export function PromptPanel({ value, onChange, placeholder, description }: PromptPanelProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-violet-500" />
        <h2 className="text-base font-semibold text-gray-900">创作描述</h2>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-40 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400"
      />
      <p className="mt-3 text-xs text-gray-500">{description}</p>
    </div>
  );
}
