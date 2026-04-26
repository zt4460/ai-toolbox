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
  Image as ImageIcon,
  Video,
  Coins,
  Mail,
  MessageSquare,
  X,
  Send,
  User,
  Volume2
} from 'lucide-react';

export default function DigitalHumanPage() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('female-warm');
  const [avatar, setAvatar] = useState('professional-female');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/digital-human/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice, avatar }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setGeneratedVideo(data.videoUrl || null);
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
          <h1 className="text-lg font-semibold text-gray-900">数字人</h1>
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
                    item.type === 'digital-human' 
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
            {/* 形象选择 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">选择数字人形象</label>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { id: 'professional-female', name: '职业女性', emoji: '👩‍💼' },
                  { id: 'business-male', name: '商务男士', emoji: '👨‍💼' },
                  { id: 'casual-female', name: '休闲女性', emoji: '👩‍🦰' },
                  { id: 'young-male', name: '年轻男士', emoji: '👨‍🎓' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAvatar(item.id)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      avatar === item.id 
                        ? 'border-gray-900 bg-gray-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-1">{item.emoji}</div>
                    <div className="text-xs text-gray-600">{item.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 音色选择 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">选择音色</label>
              <div className="flex gap-2">
                {[
                  { id: 'female-warm', name: '温柔女声' },
                  { id: 'male磁性', name: '磁性男声' },
                  { id: 'young-female', name: '青春女声' },
                  { id: 'formal-male', name: '正式男声' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setVoice(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      voice === item.id 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 输入区域 */}
            <div className="relative mb-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="输入你想让数字人说的内容..."
                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-gray-300 transition-colors"
              />
              <button
                onClick={handleGenerate}
                disabled={!text.trim() || isGenerating}
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
                onClick={() => { setText(''); setGeneratedVideo(null); }}
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
                <video src={generatedVideo} controls className="w-full" />
              </div>
            </div>
          )}

          {/* 提示信息 */}
          {!generatedVideo && !isGenerating && (
            <div className="mt-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">选择形象和音色，输入文案开始创作</p>
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
              <span className="text-xs text-red-500">本次消耗 30 积分/分钟</span>
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
