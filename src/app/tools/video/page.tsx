'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, VideoIcon, Sparkles, Loader2, Download, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function VideoGenerationPage() {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState('5');
  const [ratio, setRatio] = useState('16:9');
  const [resolution, setResolution] = useState('720p');
  const [generateAudio, setGenerateAudio] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const [showVideo, setShowVideo] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('请输入视频描述');
      return;
    }

    setIsGenerating(true);
    setError('');
    setVideoUrl('');
    setShowVideo(false);

    try {
      const response = await fetch('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, duration, ratio, resolution, generateAudio }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '生成失败');
      }

      setVideoUrl(data.videoUrl || '');
      setShowVideo(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!videoUrl) return;
    
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'generated-video.mp4';
      link.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('下载失败:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="h-14 px-4 flex items-center gap-4 border-b border-gray-200 bg-white">
        <Link href="/" className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
            <VideoIcon className="w-4 h-4 text-pink-600" />
          </div>
          <span className="font-semibold text-gray-900">视频生成</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">AI 视频生成</h1>
          <p className="text-gray-500">输入描述，AI 为你创作精彩视频</p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <Label htmlFor="prompt" className="text-gray-700 mb-3 block">
            视频描述
          </Label>
          <textarea
            id="prompt"
            placeholder="例如：一只可爱的橘猫在草地上追逐蝴蝶，阳光明媚，微风轻拂..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 resize-none outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all"
          />

          {/* Options */}
          <div className="grid grid-cols-3 gap-4 mt-5">
            <div>
              <label className="text-sm text-gray-500 mb-1.5 block">视频时长</label>
              <select 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full text-sm text-gray-700 bg-gray-100 rounded-lg px-3 py-2.5 outline-none cursor-pointer"
              >
                <option value="4">4 秒</option>
                <option value="5">5 秒</option>
                <option value="8">8 秒</option>
                <option value="10">10 秒</option>
                <option value="12">12 秒</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-1.5 block">画面比例</label>
              <select 
                value={ratio}
                onChange={(e) => setRatio(e.target.value)}
                className="w-full text-sm text-gray-700 bg-gray-100 rounded-lg px-3 py-2.5 outline-none cursor-pointer"
              >
                <option value="16:9">16:9 宽屏</option>
                <option value="9:16">9:16 竖屏</option>
                <option value="1:1">1:1 方形</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-1.5 block">分辨率</label>
              <select 
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full text-sm text-gray-700 bg-gray-100 rounded-lg px-3 py-2.5 outline-none cursor-pointer"
              >
                <option value="480p">480p</option>
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
              </select>
            </div>
          </div>

          {/* Audio Option */}
          <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-100">
            <input
              type="checkbox"
              id="generateAudio"
              checked={generateAudio}
              onChange={(e) => setGenerateAudio(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
            />
            <Label htmlFor="generateAudio" className="text-gray-600 cursor-pointer text-sm">
              生成同步音频（语音、音效、背景音乐）
            </Label>
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
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              生成中，请稍候...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              开始生成
            </>
          )}
        </button>

        {/* Results */}
        {showVideo && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-500 mb-4">生成结果</h3>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-200 border border-gray-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-300 flex items-center justify-center">
                    <Play className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-500">视频生成完成</p>
                </div>
              </div>
              <button 
                onClick={handleDownload}
                className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg hover:bg-gray-100 transition-colors"
              >
                <Download className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">下载视频</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
