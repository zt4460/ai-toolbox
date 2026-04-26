'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft,
  Wand2,
  Sparkles,
  Download,
  Copy,
  RotateCcw,
  ChevronDown,
  Image as ImageIcon,
  Video,
  Coins,
  Mail,
  MessageSquare,
  X,
  Send
} from 'lucide-react';

export default function VideoToolPage() {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState('5');
  const [ratio, setRatio] = useState('16:9');
  const [resolution, setResolution] = useState('720p');
  const [generateAudio, setGenerateAudio] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setGeneratedVideo(null);
    
    try {
      const response = await fetch('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, duration, ratio, resolution, generateAudio }),
      });
      
      const data = await response.json();
      
      if (data.success && data.videoUrl) {
        setGeneratedVideo(data.videoUrl);
      } else {
        setError(data.error || '生成失败，请重试');
      }
    } catch {
      setError('网络错误，请检查连接后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* 顶部栏 */}
      <header className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/"
            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">视频生成</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
            <Coins className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-700">200 积分</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto pb-24">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* 类型切换 */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex bg-white border border-gray-200 rounded-lg p-0.5">
              {[
                { type: 'image', label: '图片', href: '/tools/image', icon: ImageIcon },
                { type: 'video', label: '视频', href: '/tools/video', icon: Wand2 },
                { type: 'digital-human', label: '数字人', href: '/tools/digital-human', icon: MessageSquare },
                { type: 'lip-sync', label: '配音', href: '/tools/lip-sync', icon: Sparkles },
              ].map((item) => (
                <Link
                  key={item.type}
                  href={item.href}
                  className={`px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
                    item.type === 'video' 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 创作面板 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            {/* 参数设置 */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">时长</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full h-9 pl-3 pr-8 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:border-gray-300 relative"
                >
                  <option value="4">4秒</option>
                  <option value="5">5秒</option>
                  <option value="8">8秒</option>
                  <option value="12">12秒</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" style={{ marginTop: '12px', marginRight: '8px' }} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">比例</label>
                <select
                  value={ratio}
                  onChange={(e) => setRatio(e.target.value)}
                  className="w-full h-9 pl-3 pr-8 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:border-gray-300 relative"
                >
                  <option value="16:9">16:9 横屏</option>
                  <option value="9:16">9:16 竖屏</option>
                  <option value="1:1">1:1 方屏</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" style={{ marginTop: '12px', marginRight: '8px' }} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">分辨率</label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full h-9 pl-3 pr-8 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:border-gray-300 relative"
                >
                  <option value="480p">480p</option>
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" style={{ marginTop: '12px', marginRight: '8px' }} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">音频</label>
                <button
                  onClick={() => setGenerateAudio(!generateAudio)}
                  className={`w-full h-9 px-3 rounded-lg text-sm transition-colors ${
                    generateAudio 
                      ? 'bg-pink-50 text-pink-600 border border-pink-200' 
                      : 'bg-gray-50 text-gray-600 border border-gray-200'
                  }`}
                >
                  {generateAudio ? '生成配乐' : '无音频'}
                </button>
              </div>
            </div>

            {/* 输入区域 */}
            <div className="relative mb-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述你想要生成的视频内容..."
                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-gray-300 transition-colors"
              />
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* AI灵感 */}
            <div className="flex items-center justify-between">
              <button className="px-3 py-1.5 bg-pink-50 text-pink-600 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-pink-100 transition-colors">
                <Sparkles className="w-4 h-4" />
                AI灵感
              </button>
              
              <button
                onClick={() => { setPrompt(''); setGeneratedVideo(null); }}
                className="px-3 py-1.5 text-gray-500 rounded-lg text-sm flex items-center gap-1.5 hover:bg-gray-100 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                重置
              </button>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* 生成结果 */}
          {generatedVideo && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">生成结果</h2>
              <div className="relative bg-black rounded-xl overflow-hidden">
                <video
                  src={generatedVideo}
                  controls
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* 提示信息 */}
          {!generatedVideo && !isGenerating && (
            <div className="mt-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                <Video className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">输入描述词，点击发送开始创作</p>
            </div>
          )}
        </div>
      </main>

      {/* 底部悬浮操作栏 */}
      <div className="fixed bottom-6 left-14 right-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                <Coins className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700">200 积分</span>
              </div>
              <span className="text-xs text-red-500">本次消耗 50 积分</span>
            </div>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
              立即创作
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
