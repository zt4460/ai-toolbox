'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircleIcon, Sparkles, Loader2, Upload, Play, Download } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function LipSyncPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [script, setScript] = useState('');
  const [language, setLanguage] = useState('zh');
  const [voice, setVoice] = useState('zh_female_xiaohe_uranus_bigtts');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ videoUrl: string; audioUrl?: string } | null>(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages = [
    { id: 'zh', name: '中文' },
    { id: 'en', name: '英文' },
    { id: 'ja', name: '日语' },
    { id: 'ko', name: '韩语' },
    { id: 'fr', name: '法语' },
    { id: 'de', name: '德语' },
    { id: 'es', name: '西班牙语' },
  ];

  const voices = [
    { id: 'zh_female_xiaohe_uranus_bigtts', name: '小禾 (女声)' },
    { id: 'zh_female_vv_uranus_bigtts', name: 'Vivian (中英双语)' },
    { id: 'zh_male_m191_uranus_bigtts', name: '云舟 (男声)' },
    { id: 'zh_male_taocheng_uranus_bigtts', name: '晓天 (男声)' },
    { id: 'zh_male_dayi_saturn_bigtts', name: '大毅 (男声-视频配音)' },
    { id: 'zh_female_mizai_saturn_bigtts', name: '米仔 (女声-视频配音)' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  const handleGenerate = async () => {
    if (!videoUrl) {
      setError('请上传视频');
      return;
    }

    if (!script.trim()) {
      setError('请输入配音文案');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/lip-sync/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl, script, language, voice }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '生成失败');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试');
    } finally {
      setIsGenerating(false);
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
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
            <MessageCircleIcon className="w-4 h-4 text-amber-600" />
          </div>
          <span className="font-semibold text-gray-900">视频配音</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">视频唇形同步</h1>
          <p className="text-gray-500">上传视频，输入文案，自动生成配音</p>
        </div>

        {/* Video Upload */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <Label className="text-gray-700 mb-3 block">上传视频</Label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              dragActive
                ? 'border-amber-400 bg-amber-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {videoUrl ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Play className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-amber-600 font-medium">视频已上传: {videoFile?.name}</span>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600 mb-1">拖拽视频文件到此处，或点击上传</p>
                <p className="text-xs text-gray-400">支持 MP4、MOV 格式</p>
              </>
            )}
          </div>
        </div>

        {/* Script Input */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <Label htmlFor="script" className="text-gray-700 mb-3 block">
            配音文案
          </Label>
          <textarea
            id="script"
            placeholder="输入配音内容..."
            value={script}
            onChange={(e) => setScript(e.target.value)}
            className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 resize-none outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100 transition-all"
          />

          {/* Options */}
          <div className="grid grid-cols-2 gap-4 mt-5">
            <div>
              <label className="text-sm text-gray-500 mb-1.5 block">语言</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full text-sm text-gray-700 bg-gray-100 rounded-lg px-3 py-2.5 outline-none cursor-pointer"
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1.5 block">音色</label>
              <select 
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full text-sm text-gray-700 bg-gray-100 rounded-lg px-3 py-2.5 outline-none cursor-pointer"
              >
                {voices.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
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
              生成配音视频
            </>
          )}
        </button>

        {/* Results */}
        {result && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-500 mb-4">生成结果</h3>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-200 border border-gray-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-300 flex items-center justify-center">
                    <Play className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-500">配音视频生成完成</p>
                </div>
              </div>
              <button className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg hover:bg-gray-100 transition-colors">
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
