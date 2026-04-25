'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  ImageIcon,
  VideoIcon,
  UserIcon,
  Mail,
  Clock,
  Download,
  Eye,
  ChevronDown,
  Filter
} from 'lucide-react';

type TabType = 'all' | 'image' | 'video' | 'digital-human' | 'lip-sync';

// 模拟历史记录数据
const mockHistory = [
  { id: 1, type: 'image', name: '日落海边风景', prompt: 'A beautiful sunset over the ocean with golden clouds', time: '2024-01-15 14:30', status: '完成', thumbnail: '' },
  { id: 2, type: 'video', name: '科技风开场动画', prompt: 'Futuristic tech animation with neon lights', time: '2024-01-15 14:00', status: '完成', thumbnail: '' },
  { id: 3, type: 'image', name: '未来城市概念图', prompt: 'Futuristic city with flying cars and tall skyscrapers', time: '2024-01-15 13:30', status: '完成', thumbnail: '' },
  { id: 4, type: 'digital-human', name: '产品介绍视频', prompt: 'Professional female presenter introducing new product', time: '2024-01-15 12:00', status: '完成', thumbnail: '' },
  { id: 5, type: 'lip-sync', name: '英文产品演示', prompt: 'English product demonstration with natural lip sync', time: '2024-01-14 16:00', status: '完成', thumbnail: '' },
  { id: 6, type: 'image', name: '梦幻森林小屋', prompt: 'A cozy cottage in a magical forest with fireflies', time: '2024-01-14 10:00', status: '完成', thumbnail: '' },
  { id: 7, type: 'video', name: '抽象艺术短片', prompt: 'Abstract art video with flowing colors and shapes', time: '2024-01-13 15:00', status: '完成', thumbnail: '' },
  { id: 8, type: 'image', name: '赛博朋克街景', prompt: 'Cyberpunk street scene with rain and neon signs', time: '2024-01-13 09:00', status: '完成', thumbnail: '' },
];

const tabs = [
  { id: 'all' as const, label: '全部', icon: null },
  { id: 'image' as const, label: '图片生成', icon: ImageIcon },
  { id: 'video' as const, label: '视频生成', icon: VideoIcon },
  { id: 'digital-human' as const, label: '数字人', icon: UserIcon },
  { id: 'lip-sync' as const, label: '视频配音', icon: Mail },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'image': return ImageIcon;
    case 'video': return VideoIcon;
    case 'digital-human': return UserIcon;
    case 'lip-sync': return Mail;
    default: return ImageIcon;
  }
};

const getColor = (type: string) => {
  switch (type) {
    case 'image': return 'text-violet-400 bg-violet-500/20';
    case 'video': return 'text-pink-400 bg-pink-500/20';
    case 'digital-human': return 'text-cyan-400 bg-cyan-500/20';
    case 'lip-sync': return 'text-amber-400 bg-amber-500/20';
    default: return 'text-white/40 bg-white/10';
  }
};

const getBgColor = (type: string) => {
  switch (type) {
    case 'image': return 'from-violet-500 to-purple-600';
    case 'video': return 'from-pink-500 to-rose-600';
    case 'digital-human': return 'from-cyan-500 to-blue-600';
    case 'lip-sync': return 'from-amber-500 to-orange-600';
    default: return 'from-slate-500 to-slate-600';
  }
};

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [showFilter, setShowFilter] = useState(false);

  const filteredHistory = activeTab === 'all' 
    ? mockHistory 
    : mockHistory.filter(item => item.type === activeTab);

  return (
    <div className="relative min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/20 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/30">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-xl font-bold text-white">生成历史</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* 分类标签 */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 统计信息 */}
        <div className="flex items-center justify-between mb-6 text-sm text-white/60">
          <p>共 {filteredHistory.length} 条记录</p>
          <button 
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Filter className="w-4 h-4" />
            筛选
          </button>
        </div>

        {/* 历史列表 */}
        <div className="space-y-4">
          {filteredHistory.map((item) => {
            const Icon = getIcon(item.type);
            const colorClass = getColor(item.type);
            const bgGradient = getBgColor(item.type);
            
            return (
              <div 
                key={item.id}
                className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all overflow-hidden"
              >
                <div className="flex">
                  {/* 缩略图区域 */}
                  <div className={`w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br ${bgGradient} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-12 h-12 text-white/80" />
                  </div>
                  
                  {/* 内容区域 */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${colorClass}`}>
                          <Icon className="w-3 h-3" />
                          {tabs.find(t => t.id === item.type)?.label || item.type}
                        </span>
                        <span className="text-xs text-white/40">完成</span>
                      </div>
                      <h3 className="text-white font-medium mb-1">{item.name}</h3>
                      <p className="text-sm text-white/50 line-clamp-2">{item.prompt}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-xs text-white/40">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                          <Eye className="w-4 h-4 text-white/70" />
                        </button>
                        <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                          <Download className="w-4 h-4 text-white/70" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 空状态 */}
        {filteredHistory.length === 0 && (
          <div className="text-center py-16">
            <Clock className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">暂无历史记录</p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 mt-4 px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 transition-colors"
            >
              去创作
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
