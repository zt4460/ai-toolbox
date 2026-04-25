'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, UserIcon, Sparkles, Loader2, Upload, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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
    setResult(null);

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
    <div className="min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            返回首页
          </Link>
          <div className="flex items-center gap-3 ml-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">数字人</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Template Selection */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-semibold text-white">选择数字人形象</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    template === t.id
                      ? 'border-cyan-500 bg-cyan-500/20'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <UserIcon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-white/50">{t.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Input Section */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-semibold text-white">输入内容</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="script" className="text-white/80 mb-2 block">
                  文案脚本
                </Label>
                <Textarea
                  id="script"
                  placeholder="输入你想让数字人说的内容..."
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none"
                />
              </div>

              <div>
                <Label className="text-white/80 mb-2 block">或上传音频</Label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-white/40" />
                  <p className="text-sm text-white/60 mb-2">拖拽音频文件到此处，或点击选择</p>
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="audio-upload"
                  />
                  <Label htmlFor="audio-upload" className="cursor-pointer">
                    <span className="text-cyan-400 hover:text-cyan-300">选择文件</span>
                  </Label>
                  {audioUrl && (
                    <p className="mt-2 text-sm text-green-400">音频已上传</p>
                  )}
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    生成中，请稍候...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    生成数字人视频
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Results Section */}
          {result && (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <h3 className="text-lg font-semibold text-white mb-4">生成结果</h3>
              <div className="aspect-video rounded-xl overflow-hidden bg-black">
                <video
                  src={result.videoUrl}
                  controls
                  className="w-full h-full"
                >
                  您的浏览器不支持视频播放
                </video>
              </div>
            </div>
          )}

          {/* Tips Section */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h3 className="text-lg font-semibold text-white mb-4">使用说明</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>选择合适的数字人形象，或上传你的定制形象</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>输入文案后，系统会自动生成匹配的口型和动作</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>支持上传自定义音频，获得更自然的配音效果</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
