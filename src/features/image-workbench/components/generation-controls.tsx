import type { WorkbenchRatio, WorkbenchResolution } from '@/features/image-workbench/types';
import { WORKBENCH_RATIOS, WORKBENCH_RESOLUTIONS } from '@/features/image-workbench/constants';

interface GenerationControlsProps {
  resolution: WorkbenchResolution;
  onResolutionChange: (value: WorkbenchResolution) => void;
  ratio: WorkbenchRatio;
  onRatioChange: (value: WorkbenchRatio) => void;
  creditsCost: number;
}

export function GenerationControls({
  resolution,
  onResolutionChange,
  ratio,
  onRatioChange,
  creditsCost,
}: GenerationControlsProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-900">生成参数</h2>
      <div className="space-y-5">
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">分辨率</p>
          <div className="grid grid-cols-3 gap-3">
            {WORKBENCH_RESOLUTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onResolutionChange(item)}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  resolution.id === item.id
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                }`}
              >
                <p className="text-sm font-medium">{item.label}</p>
                <p className={`text-xs ${resolution.id === item.id ? 'text-gray-200' : 'text-gray-500'}`}>{item.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">比例</p>
          <div className="grid grid-cols-4 gap-3">
            {WORKBENCH_RATIOS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onRatioChange(item)}
                className={`rounded-xl border px-3 py-2 text-sm transition ${
                  ratio.id === item.id
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                }`}
              >
                <p className="font-medium">{item.id}</p>
                <p className={`text-xs ${ratio.id === item.id ? 'text-gray-200' : 'text-gray-500'}`}>{item.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
          本次生成预计消耗 <span className="font-semibold text-gray-900">{creditsCost}</span> 积分。
        </div>
      </div>
    </div>
  );
}
