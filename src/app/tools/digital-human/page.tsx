'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, UserIcon, Sparkles, Loader2, Upload, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function DigitalHumanPage() {
  const [template, setTemplate] = useState('default');
  const [script, setScript] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ videoUrl: string; status: string } | null>(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const templates = [
    { id: 'default', name: '默认数字人', description: '通用场景' },
    { id: 'business', name: '商务主播', description: '适合新闻、汇报' },
    { id: 'casual', name: '休闲主播', description: '适合娱乐、生活' },
    { id: 'female', name: '女性形象', description: '温柔知性' },
    { id: 'male', name: '男性形象', description: '稳重专业' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const handleGenerate = async () => {
    if (!script.trim() && !audioUrl) {
      setError('请输入文案或上传音频');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/digital-human/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template, script, audioUrl }),
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
          <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-cyan-600" />
          </div>
          <span className="font-semibold text-gray-900">数字人</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">AI 数字人</h1>
          <p className="text-gray-500">选择形象，输入文案，生成数字人视频</p>
        </div>

        {/* Template Selection */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <Label className="text-gray-700 mb-3 block">选择数字人形象</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  template === t.id
                    ? 'border-cyan-300 bg-cyan-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gray-200 mb-2 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-gray-400" />
                </div>
                <p className="font-medium text-gray-900 text-sm">{t.name}</p>
                <p className="text-xs text-gray-500">{t.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Script Input */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <Label htmlFor="script" className="text-gray-700 mb-3 block">
            输入文案
          </Label>
          <textarea
            id="script"
            placeholder="输入你要数字人说的内容..."
            value={script}
            onChange={(e) => setScript(e.target.value)}
            className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 resize-none outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100 transition-all"
          />
        </div>

        {/* Audio Upload */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <Label className="text-gray-700 mb-3 block">或上传配音音频</Label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              dragActive
                ? 'border-cyan-400 bg-cyan-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => document.getElementById('audio-upload')?.click()}
          >
            <input
              id="audio-upload"
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {audioUrl ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                  <Play className="w-5 h-5 text-cyan-600" />
                </div>
                <span className="text-cyan-600 font-medium">音频已上传</span>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600 mb-1">拖拽音频文件到此处，或点击上传</p>
                <p className="text-xs text-gray-400">支持 MP3、WAV 格式</p>
              </>
            )}
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
              生成数字人视频
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
                    <UserIcon className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-500">数字人视频生成完成</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
