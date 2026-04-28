import type { ImagePreset, WorkbenchRatio, WorkbenchResolution } from '@/features/image-workbench/types';

export interface PresetDefinition {
  id: ImagePreset;
  label: string;
  description: string;
  enabled: boolean;
  comingSoon?: boolean;
  promptPlaceholder: string;
  supportsReferenceImage: boolean;
  defaultRatio: WorkbenchRatio['id'];
  defaultResolution: WorkbenchResolution['id'];
  uiTag?: string;
}

export const IMAGE_PRESETS: PresetDefinition[] = [
  {
    id: 'freeform',
    label: '自由创作',
    description: '通用图片生成模式，适合先完成创意验证。',
    enabled: true,
    promptPlaceholder: '描述你想生成的图片，例如：高级感护肤品白底主图、柔和阴影、商业摄影风格。',
    supportsReferenceImage: true,
    defaultRatio: '1:1',
    defaultResolution: '2K',
    uiTag: '当前可用',
  },
  {
    id: 'whitebg',
    label: '白底图',
    description: '面向商品白底主图的专业模式。',
    enabled: false,
    comingSoon: true,
    promptPlaceholder: '白底图模式即将推出。',
    supportsReferenceImage: true,
    defaultRatio: '1:1',
    defaultResolution: '2K',
    uiTag: '即将推出',
  },
  {
    id: 'scene',
    label: '场景图',
    description: '面向场景化营销图片的专业模式。',
    enabled: false,
    comingSoon: true,
    promptPlaceholder: '场景图模式即将推出。',
    supportsReferenceImage: true,
    defaultRatio: '4:3',
    defaultResolution: '2K',
    uiTag: '即将推出',
  },
  {
    id: 'model-tryon',
    label: '模特上身图',
    description: '面向服饰与上身展示的专业模式。',
    enabled: false,
    comingSoon: true,
    promptPlaceholder: '模特上身图模式即将推出。',
    supportsReferenceImage: true,
    defaultRatio: '4:3',
    defaultResolution: '2K',
    uiTag: '预留',
  },
  {
    id: 'platform-size-pack',
    label: '平台尺寸模板',
    description: '面向多平台尺寸输出的模板模式。',
    enabled: false,
    comingSoon: true,
    promptPlaceholder: '平台尺寸模板模式即将推出。',
    supportsReferenceImage: false,
    defaultRatio: '1:1',
    defaultResolution: '2K',
    uiTag: '预留',
  },
  {
    id: 'main-and-detail-pack',
    label: '主图+详情图组',
    description: '面向电商图组的一键组合模式。',
    enabled: false,
    comingSoon: true,
    promptPlaceholder: '主图+详情图组模式即将推出。',
    supportsReferenceImage: true,
    defaultRatio: '1:1',
    defaultResolution: '2K',
    uiTag: '预留',
  },
];

export function getPresetDefinition(preset: ImagePreset) {
  return IMAGE_PRESETS.find((item) => item.id === preset) ?? IMAGE_PRESETS[0];
}
