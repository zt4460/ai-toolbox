'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, VideoIcon, Sparkles, Loader2, Download, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    <div className="min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-500/20 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            返回首页
          </Link>
          <div className="flex items-center gap-3 ml-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <VideoIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">视频生成</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Input Section */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-pink-400" />
              <h2 className="text-xl font-semibold text-white">描述你的视频</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="prompt" className="text-white/80 mb-2 block">
                  视频描述
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="例如：一只可爱的橘猫在草地上追逐蝴蝶，阳光明媚，微风轻拂..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-white/80 mb-2 block">视频时长</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="4">4 秒</SelectItem>
                      <SelectItem value="5">5 秒</SelectItem>
                      <SelectItem value="8">8 秒</SelectItem>
                      <SelectItem value="10">10 秒</SelectItem>
                      <SelectItem value="12">12 秒</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white/80 mb-2 block">画面比例</Label>
                  <Select value={ratio} onValueChange={setRatio}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="16:9">16:9 宽屏</SelectItem>
                      <SelectItem value="9:16">9:16 竖屏</SelectItem>
                      <SelectItem value="1:1">1:1 方形</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white/80 mb-2 block">分辨率</Label>
                  <Select value={resolution} onValueChange={setResolution}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="480p">480p</SelectItem>
                      <SelectItem value="720p">720p</SelectItem>
                      <SelectItem value="1080p">1080p</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="generateAudio"
                  checked={generateAudio}
                  onChange={(e) => setGenerateAudio(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-pink-500 focus:ring-pink-500"
                />
                <Label htmlFor="generateAudio" className="text-white/80 cursor-pointer">
                  生成同步音频（语音、音效、背景音乐）
                </Label>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-90"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    生成中，请稍候...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    生成视频
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
          {showVideo && videoUrl && (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <h3 className="text-lg font-semibold text-white mb-4">生成的视频</h3>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full"
                  poster=""
                >
                  您的浏览器不支持视频播放
                </video>
              </div>
              <div className="mt-4 flex justify-center">
                <Button onClick={handleDownload} className="bg-white text-slate-900 hover:bg-white/90">
                  <Download className="w-4 h-4 mr-2" />
                  下载视频
                </Button>
              </div>
            </div>
          )}

          {/* Tips Section */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h3 className="text-lg font-semibold text-white mb-4">创作小贴士</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <span className="text-pink-400 mt-1">•</span>
                <span>描述具体动作和场景，如相机运动、光线变化等</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-400 mt-1">•</span>
                <span>如需包含对话，用引号包裹台词，如：他笑着说："欢迎来到未来"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-400 mt-1">•</span>
                <span>视频生成需要一定时间，请耐心等待</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
