'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircleIcon, Sparkles, Loader2, Upload, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    if (!videoFile && !script.trim()) {
      setError('请上传视频或输入文案');
      return;
    }

    setIsGenerating(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      
      if (videoFile) {
        formData.append('video', videoFile);
      }
      formData.append('script', script);
      formData.append('language', language);
      formData.append('voice', voice);

      const response = await fetch('/api/lip-sync/generate', {
        method: 'POST',
        body: formData,
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
        <div className="absolute top-0 -left-40 w-80 h-80 bg-amber-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            返回首页
          </Link>
          <div className="flex items-center gap-3 ml-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <MessageCircleIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">视频配音</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Video Upload */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Upload className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-semibold text-white">上传视频</h2>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                dragActive
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {videoUrl ? (
                <div className="space-y-4">
                  <video
                    src={videoUrl}
                    className="max-h-48 mx-auto rounded-lg"
                    muted
                    onClick={(e) => e.stopPropagation()}
                  />
                  <p className="text-sm text-white/60">{videoFile?.name}</p>
                </div>
              ) : (
                <>
                  <Play className="w-12 h-12 mx-auto mb-4 text-white/40" />
                  <p className="text-white/80 mb-2">拖拽视频文件到此处，或点击选择</p>
                  <p className="text-sm text-white/40">支持 MP4, MOV, AVI 格式</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Script Input */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircleIcon className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-semibold text-white">输入配音文案</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="script" className="text-white/80 mb-2 block">
                  配音脚本
                </Label>
                <Textarea
                  id="script"
                  placeholder="输入你想让视频中人物说的内容..."
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/80 mb-2 block">语言</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      {languages.map((lang) => (
                        <SelectItem key={lang.id} value={lang.id}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white/80 mb-2 block">音色</Label>
                  <Select value={voice} onValueChange={setVoice}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      {voices.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:opacity-90"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    生成中，请稍候...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    生成配音视频
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
                <span className="text-amber-400 mt-1">•</span>
                <span>上传包含人物说话的视频，AI 会自动识别口型</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                <span>输入配音文案，选择语言和音色，系统将生成匹配的视频</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                <span>支持多种语言的配音转换，轻松实现视频本地化</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                <span>建议上传人物正面清晰的视频以获得最佳效果</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
