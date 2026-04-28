import { WorkbenchRatio, WorkbenchResolution } from '@/features/image-workbench/types';

export const WORKBENCH_RESOLUTIONS: WorkbenchResolution[] = [
  { id: '1K', label: '1K', description: '1024 × 1024', credits: 2 },
  { id: '2K', label: '2K', description: '2048 × 2048', credits: 4 },
  { id: '4K', label: '4K', description: '4096 × 4096', credits: 8 },
];

export const WORKBENCH_RATIOS: WorkbenchRatio[] = [
  { id: '1:1', label: '方图' },
  { id: '4:3', label: '横版' },
  { id: '16:9', label: '宽图' },
  { id: '9:16', label: '竖图' },
];
