'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ImageIcon, Sparkles, Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ImageGenerationPage() {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('2K');
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

      setGeneratedImages(data.imageUrls || []);
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

  return (
    <div className="min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-violet-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            返回首页
          </Link>
          <div className="flex items-center gap-3 ml-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">图片生成</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Input Section */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <h2 className="text-xl font-semibold text-white">描述你的图片</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="prompt" className="text-white/80 mb-2 block">
                  图片描述
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="例如：一只可爱的橘猫在阳光下打盹，温暖的午后光线..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label className="text-white/80 mb-2 block">图片尺寸</Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="2K">2K (2560x1440)</SelectItem>
                      <SelectItem value="4K">4K (3840x2160)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        生成中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        生成图片
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Results Section */}
          {generatedImages.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <h3 className="text-lg font-semibold text-white mb-4">生成的图片</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedImages.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Generated image ${index + 1}`}
                      className="w-full rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <Button
                        onClick={() => handleDownload(url, index)}
                        className="bg-white text-slate-900 hover:bg-white/90"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        下载
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips Section */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h3 className="text-lg font-semibold text-white mb-4">创作小贴士</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-1">•</span>
                <span>描述越详细，生成效果越好。可以加入风格、光线、氛围等描述</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-1">•</span>
                <span>如需在图片中显示文字，请用引号包裹，如："Hello World"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-1">•</span>
                <span>4K 分辨率生成时间较长，但图片细节更丰富</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
