'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ImageIcon, Sparkles, Loader2, Download, Copy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SAMPLE_PROMPTS = [
  '日出时分的金色海滩，浪花轻拍礁石',
  '未来城市夜景，霓虹灯光倒映在雨中',
  '森林深处的魔法小屋，萤火虫环绕',
  '极简风格的产品设计工作站',
];

export default function ImageGenerationPage() {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('1:1');
  const [quantity, setQuantity] = useState('1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('请输入图片描述');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedImages([]);

    try {
      const response = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '生成失败');
      }

      // 模拟生成结果（使用示例图片）
      const sampleImages = [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
      ];
      setGeneratedImages(sampleImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (url: string, index: number) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `generated-image-${index + 1}.png`;
      link.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('下载失败:', err);
    }
  };

  const handleSampleClick = (sample: string) => {
    setPrompt(sample);
  };

  const handleReset = () => {
    setPrompt('');
    setGeneratedImages([]);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="h-14 px-4 flex items-center gap-4 border-b border-gray-200 bg-white">
        <Link href="/" className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-violet-600" />
          </div>
          <span className="font-semibold text-gray-900">图片生成</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">AI 图片生成</h1>
          <p className="text-gray-500">输入描述，让 AI 为你创作精美图片</p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <Label htmlFor="prompt" className="text-gray-700 mb-3 block">
            图片描述
          </Label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述你想要生成的图片..."
            className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 resize-none outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 transition-all"
          />

          {/* 示例提示 */}
          <div className="mt-3">
            <p className="text-xs text-gray-400 mb-2">试试这些描述：</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSampleClick(sample)}
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-violet-100 hover:text-violet-700 text-gray-600 rounded-lg transition-colors"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">尺寸</span>
                <select 
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="text-sm text-gray-700 bg-gray-100 rounded-lg px-3 py-1.5 outline-none cursor-pointer"
                >
                  <option value="1:1">1:1 方形</option>
                  <option value="16:9">16:9 横版</option>
                  <option value="9:16">9:16 竖版</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">数量</span>
                <select 
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="text-sm text-gray-700 bg-gray-100 rounded-lg px-3 py-1.5 outline-none cursor-pointer"
                >
                  <option value="1">1 张</option>
                  <option value="2">2 张</option>
                  <option value="4">4 张</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              开始生成
            </>
          )}
        </button>

        {/* Results */}
        {generatedImages.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-500 mb-4">生成结果</h3>
            <div className="grid grid-cols-2 gap-4">
              {generatedImages.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 group">
                  <Image src={url} alt={`生成图片 ${idx + 1}`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleDownload(url, idx)}
                      className="p-2.5 bg-white rounded-xl hover:bg-gray-100 shadow-lg transition-colors"
                    >
                      <Download className="w-4 h-4 text-gray-700" />
                    </button>
                    <button className="p-2.5 bg-white rounded-xl hover:bg-gray-100 shadow-lg transition-colors">
                      <Copy className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
