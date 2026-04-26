'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Wand2,
  History,
  Sparkles,
  Download,
  Copy,
  ChevronRight,
  ImageIcon,
  VideoIcon,
  UserIcon,
  Mail,
  X,
  MessageSquare,
  Send,
  Coins,
  Settings,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type TabType = 'create' | 'history';
type CreateTab = 'image' | 'video' | 'digital-human' | 'lip-sync';

// 模拟历史记录数据
const mockHistory = [
  { 
    id: 1, 
    type: 'image', 
    name: '日落海边风景', 
    prompt: 'A beautiful sunset over the ocean with golden clouds',
    time: '2024-01-15 14:30', 
    status: '完成',
    thumbnail: ''
  },
  { 
    id: 2, 
    type: 'video', 
    name: '科技风开场动画', 
    prompt: 'Futuristic tech animation with neon lights',
    time: '2024-01-15 14:00', 
    status: '完成',
    thumbnail: ''
  },
  { 
    id: 3, 
    type: 'image', 
    name: '未来城市概念图', 
    prompt: 'Futuristic city with flying cars and tall skyscrapers',
    time: '2024-01-15 13:30', 
    status: '完成',
    thumbnail: ''
  },
  { 
    id: 4, 
    type: 'digital-human', 
    name: '产品介绍视频', 
    prompt: 'Professional female presenter introducing new product',
    time: '2024-01-14 16:00', 
    status: '完成',
    thumbnail: ''
  },
  { 
    id: 5, 
    type: 'lip-sync', 
    name: '英文产品演示', 
    prompt: 'English product demonstration with natural lip sync',
    time: '2024-01-14 10:00', 
    status: '完成',
    thumbnail: ''
  },
];

const createTabs = [
  { id: 'image' as const, label: '图片生成', icon: ImageIcon, color: 'violet' },
  { id: 'video' as const, label: '视频生成', icon: VideoIcon, color: 'pink' },
  { id: 'digital-human' as const, label: '数字人', icon: UserIcon, color: 'cyan' },
  { id: 'lip-sync' as const, label: '视频配音', icon: Mail, color: 'amber' },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'image': return { bg: 'bg-violet-100', text: 'text-violet-600', border: 'border-violet-200' };
    case 'video': return { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200' };
    case 'digital-human': return { bg: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-200' };
    case 'lip-sync': return { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' };
    default: return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'image': return ImageIcon;
    case 'video': return VideoIcon;
    case 'digital-human': return UserIcon;
    case 'lip-sync': return Mail;
    default: return ImageIcon;
  }
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('create');
  const [createSubTab, setCreateSubTab] = useState<CreateTab>('image');
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    // 模拟生成过程
    setTimeout(() => {
      setGeneratedImages([
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'
      ]);
      setGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 左侧功能栏 */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="h-14 px-4 flex items-center border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">AI 工具箱</span>
          </div>
        </div>

        {/* 导航标签 */}
        <div className="px-3 py-3 border-b border-gray-100">
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'create' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              生图
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'history' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <History className="w-4 h-4" />
              历史
            </button>
          </div>
        </div>

        {/* 功能列表 */}
        <div className="flex-1 overflow-y-auto py-3 px-3">
          {activeTab === 'create' ? (
            <div className="space-y-1">
              <p className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">选择工具</p>
              {createTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = createSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCreateSubTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      isActive 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-white shadow-sm' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-violet-600' : 'text-gray-500'}`} />
                    </div>
                    {tab.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-1">
              <p className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">最近记录</p>
              {mockHistory.slice(0, 5).map((item) => {
                const Icon = getTypeIcon(item.type);
                const colors = getTypeColor(item.type);
                return (
                  <button
                    key={item.id}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 text-left truncate">{item.name}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 底部用户信息 */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
              U
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">用户名</p>
              <p className="text-xs text-gray-500">100 积分</p>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 右侧主内容区 */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* 顶部导航 */}
        <header className="h-14 px-6 flex items-center justify-between border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            {activeTab === 'create' ? (
              <h1 className="text-lg font-semibold text-gray-900">
                {createTabs.find(t => t.id === createSubTab)?.label || '创建'}
              </h1>
            ) : (
              <h1 className="text-lg font-semibold text-gray-900">生成历史</h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link 
              href="/credits"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Coins className="w-4 h-4" />
              <span>积分</span>
            </Link>
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'create' ? (
            /* 生图模式 */
            <div className="max-w-2xl mx-auto px-6 py-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {createTabs.find(t => t.id === createSubTab)?.label || '创作'}
                </h2>
                <p className="text-gray-500">描述你的想法，AI 将为你创作</p>
              </div>

              {/* 提示词输入 */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="输入你的创作描述..."
                  className="w-full h-32 text-gray-900 placeholder-gray-400 bg-transparent resize-none outline-none text-base"
                />
                
                {/* 选项栏 */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">尺寸:</span>
                      <select className="text-sm text-gray-700 bg-gray-100 rounded-lg px-3 py-1.5 outline-none cursor-pointer">
                        <option>1:1 (方形)</option>
                        <option>16:9 (横版)</option>
                        <option>9:16 (竖版)</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">数量:</span>
                      <select className="text-sm text-gray-700 bg-gray-100 rounded-lg px-3 py-1.5 outline-none cursor-pointer">
                        <option>1 张</option>
                        <option>2 张</option>
                        <option>4 张</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || generating}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {generating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        生成中...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        开始生成
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 生成结果 */}
              {generatedImages.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">生成结果</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {generatedImages.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                        <Image src={url} alt={`生成图片 ${idx + 1}`} fill className="object-cover" />
                        <div className="absolute bottom-3 right-3 flex gap-2">
                          <button className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors shadow-sm">
                            <Download className="w-4 h-4 text-gray-700" />
                          </button>
                          <button className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors shadow-sm">
                            <Copy className="w-4 h-4 text-gray-700" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* 历史模式 */
            <div className="max-w-3xl mx-auto px-6 py-12">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">生成历史</h2>
                <p className="text-gray-500">记录你的每一次创作</p>
              </div>

              {/* 时间轴 */}
              <div className="relative">
                {/* 时间轴线 */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200" />

                {/* 历史记录 */}
                <div className="space-y-6">
                  {mockHistory.map((item, idx) => {
                    const Icon = getTypeIcon(item.type);
                    const colors = getTypeColor(item.type);
                    const isLast = idx === mockHistory.length - 1;
                    
                    return (
                      <div key={item.id} className="relative pl-14">
                        {/* 时间轴节点 */}
                        <div className={`absolute left-3 w-6 h-6 rounded-full ${colors.bg} border-2 border-white flex items-center justify-center`}>
                          <Icon className={`w-3 h-3 ${colors.text}`} />
                        </div>

                        {/* 卡片 */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                                  {item.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 line-clamp-1 mb-2">{item.prompt}</p>
                              <p className="text-xs text-gray-400">{item.time}</p>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                                <Download className="w-4 h-4" />
                              </button>
                              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
