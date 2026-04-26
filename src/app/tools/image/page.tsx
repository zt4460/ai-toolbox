'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Wand2,
  Sparkles,
  Download,
  Copy,
  RotateCcw,
  ChevronDown,
  Image as ImageIcon,
  Coins,
  Settings,
  MessageSquare,
  Mail,
  X,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/app/providers';

// 创建共享的顶部工具栏组件
function TopBar({ 
  title, 
  credits = 0,
  showContact = true
}: { 
  title: string; 
  credits?: number;
  showContact?: boolean;
}) {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <>
      <header className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/"
            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {credits !== undefined && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
              <Coins className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-700">{credits} 积分</span>
            </div>
          )}
          
          {showContact && (
            <button 
              onClick={() => setShowContactModal(true)}
              className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Mail className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {showContactModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowContactModal(false)}>
          <div 
            className="bg-white rounded-2xl p-6 w-80 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">联系我们</h3>
              <button 
                onClick={() => setShowContactModal(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <a 
                href="mailto:contact@example.com"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">contact@example.com</span>
              </a>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <MessageSquare className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">微信: AI_Tools</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ImageToolPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState('2K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [insufficientCredits, setInsufficientCredits] = useState(false);

  // 积分不足时跳转到充值页面
  const handleRecharge = () => {
    router.push('/profile?tab=recharge');
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    // 检查是否已登录
    if (!user) {
      router.push('/auth');
      return;
    }
    
    // 检查积分
    const cost = resolution === '4K' ? 8 : 4;
    if (user.credits < cost) {
      setInsufficientCredits(true);
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    setSuccessMessage(null);
    setInsufficientCredits(false);
    setGeneratedImages([]);
    
    try {
      const response = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size: resolution }),
      });
      
      const data = await response.json();
      
      if (data.success && data.imageUrls) {
        setGeneratedImages(data.imageUrls);
        setSuccessMessage(`图片生成成功！消耗 ${cost} 积分`);
        // 刷新用户积分
        await refreshUser();
      } else {
        setError(data.error || '生成失败，请重试');
      }
    } catch {
      setError('网络错误，请检查连接后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setPrompt('');
    setGeneratedImages([]);
    setError(null);
    setSuccessMessage(null);
    setInsufficientCredits(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <TopBar title="图片生成" credits={user?.credits} />
      
      <main className="flex-1 overflow-auto pb-24">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* 成功提示 */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700">{successMessage}</span>
              <button 
                onClick={() => setSuccessMessage(null)}
                className="ml-auto text-green-400 hover:text-green-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 积分不足提示 */}
          {insufficientCredits && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <div className="flex-1">
                <span className="text-orange-700">积分不足，当前积分：{user?.credits || 0}</span>
              </div>
              <button 
                onClick={handleRecharge}
                className="px-4 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                立即充值
              </button>
              <button 
                onClick={() => setInsufficientCredits(false)}
                className="text-orange-400 hover:text-orange-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {/* 类型切换 */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex bg-white border border-gray-200 rounded-lg p-0.5">
              {['image', 'video', 'digital-human', 'lip-sync'].map((type, index) => (
                <Link
                  key={type}
                  href={index === 0 ? '/tools/image' : index === 1 ? '/tools/video' : index === 2 ? '/tools/digital-human' : '/tools/lip-sync'}
                  className={`px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
                    type === 'image' 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {type === 'image' && <ImageIcon className="w-4 h-4" />}
                  {type === 'video' && <Wand2 className="w-4 h-4" />}
                  {type === 'digital-human' && <MessageSquare className="w-4 h-4" />}
                  {type === 'lip-sync' && <Sparkles className="w-4 h-4" />}
                  {type === 'image' ? '图片' : type === 'video' ? '视频' : type === 'digital-human' ? '数字人' : '配音'}
                </Link>
              ))}
            </div>
          </div>

          {/* 创作面板 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            {/* 参数设置 */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">分辨率</span>
                <div className="relative">
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="h-9 pl-3 pr-8 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:border-gray-300"
                  >
                    <option value="2K">2K (2048x2048)</option>
                    <option value="4K">4K (4096x4096)</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 输入区域 */}
            <div className="relative mb-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述你想要创作的内容，例如：一只橘色的猫咪在阳光下打盹，古风插画风格..."
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
                onClick={handleReset}
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
          {generatedImages.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">生成结果</h2>
              <div className="grid grid-cols-2 gap-4">
                {generatedImages.map((url, index) => (
                  <div key={index} className="relative bg-white rounded-xl border border-gray-200 overflow-hidden group">
                    <Image
                      src={url}
                      alt={`Generated image ${index + 1}`}
                      width={512}
                      height={512}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors">
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 提示信息 */}
          {generatedImages.length === 0 && !isGenerating && (
            <div className="mt-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
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
                <span className="text-sm text-gray-700">{user?.credits || 0} 积分</span>
              </div>
              <span className="text-xs text-red-500">本次消耗 {resolution === '4K' ? 8 : 4} 积分</span>
            </div>
            <button 
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? '生成中...' : '立即创作'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
