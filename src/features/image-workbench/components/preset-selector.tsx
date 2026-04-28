import type { ImagePreset } from '@/features/image-workbench/types';
import type { PresetDefinition } from '@/features/image-workbench/presets';

interface PresetSelectorProps {
  presets: PresetDefinition[];
  selectedPreset: ImagePreset;
  onSelect: (preset: ImagePreset) => void;
}

export function PresetSelector({ presets, selectedPreset, onSelect }: PresetSelectorProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-900">模式选择</h2>
        <p className="mt-1 text-sm text-gray-500">先铺好模式结构，当前只开放自由创作。</p>
      </div>
      <div className="grid gap-3">
        {presets.map((preset) => {
          const isSelected = preset.id === selectedPreset;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelect(preset.id)}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                isSelected
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-gray-50 text-gray-800 hover:border-gray-300'
              } ${!preset.enabled ? 'opacity-90' : ''}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{preset.label}</p>
                  <p className={`mt-1 text-xs ${isSelected ? 'text-gray-200' : 'text-gray-500'}`}>{preset.description}</p>
                </div>
                {preset.uiTag ? (
                  <span className={`rounded-full px-2 py-1 text-[11px] ${isSelected ? 'bg-white/15 text-white' : 'bg-white text-gray-500'}`}>
                    {preset.uiTag}
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
