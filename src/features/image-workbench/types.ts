export type ImagePreset =
  | 'freeform'
  | 'whitebg'
  | 'scene'
  | 'model-tryon'
  | 'platform-size-pack'
  | 'main-and-detail-pack';

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
}

export interface WorkbenchResolution {
  id: '1K' | '2K' | '4K';
  label: string;
  description: string;
  credits: number;
}

export interface WorkbenchRatio {
  id: '1:1' | '4:3' | '16:9' | '9:16';
  label: string;
}
