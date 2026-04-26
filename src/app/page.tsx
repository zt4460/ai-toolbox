'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Wand2,
  FolderOpen,
  MessageSquare,
  Settings,
  Search,
  Grid3X3,
  List,
  Sparkles,
  Edit3,
  Upload,
  ChevronDown,
  Heart,
  TrendingUp,
  Coins,
  Image as ImageIcon,
  Video,
  User,
  Download,
  X,
  Send,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// 模拟历史记录数据
const mockHistory = [
  { 
    id: 1, 
    type: 'image', 
    name: '日落海边风景', 
    prompt: 'A beautiful sunset over the ocean with golden clouds',
    time: '14:30', 
    status: '完成',
    thumbnail: ''
  },
  { 
    id: 2, 
    type: 'video', 
    name: '科技风开场动画', 
    prompt: 'Futuristic tech animation with neon lights',
    time: '14:00', 
    status: '完成',
    thumbnail: ''
  },
  { 
    id: 3, 
    type: 'image', 
    name: '极简风格海报', 
    prompt: 'Minimalist poster design with clean typography',
    time: '13:45', 
    status: '完成',
    thumbnail: ''
  },
  { 
    id: 4, 
    type: 'digital-human', 
    name: '产品介绍视频', 
    prompt: 'Professional product introduction with smooth transitions',
    time: '13:20', 
    status: '完成',
    thumbnail: ''
  },
];

// 侧边栏导航项
const navItems = [
  { id: 'create', icon: Wand2, label: '创作' },
  { id: 'assets', icon: FolderOpen, label: '资产' },
  { id: 'messages', icon: MessageSquare, label: '消息' },
  { id: 'settings', icon: Settings, label: '设置' },
];

export default function HomePage() {
  const [activeNav, setActiveNav] = useState('create');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showContact, setShowContact] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createType, setCreateType] = useState<'image' | 'video' | 'digital-human' | 'lip-sync'>('image');

  // 获取类型图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'digital-human': return <User className="w-4 h-4" />;
      case 'lip-sync': return <MessageSquare className="w-4 h-4" />;
      default: return <ImageIcon className="w-4 h-4" />;
    }
  };

  // 获取类型名称
  const getTypeName = (type: string) => {
    switch (type) {
      case 'image': return '图片';
      case 'video': return '视频';
      case 'digital-human': return '数字人';
      case 'lip-sync': return '配音';
      default: return type;
    }
  };

  // 筛选历史记录
  const filteredHistory = mockHistory.filter(item => {
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* 左侧极窄侧边栏 */}
      <aside className="w-12 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              activeNav === item.id 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
        
        {/* 底部用户区域 */}
        <div className="mt-auto flex flex-col gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-medium">
            U
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col">
        {/* 顶部工具栏 */}
        <header className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-900">让AI变成好用的牛马</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索创作记录..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 h-9 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-300 transition-colors"
              />
            </div>
            
            {/* 视图切换 */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <List className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <Grid3X3 className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* 联系我 */}
            <button
              onClick={() => setShowContact(true)}
              className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Mail className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* 内容区域 */}
        <div className="flex-1 overflow-auto pb-24">
          <div className="max-w-3xl mx-auto px-6 py-8">
            {/* 时间分组 */}
            <div className="space-y-8">
              {/* 今天 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">今天</h2>
                <div className="space-y-3">
                  {filteredHistory.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-white rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow cursor-pointer border border-gray-100"
                    >
                      {/* 缩略图 */}
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                        {getTypeIcon(item.type)}
                      </div>
                      
                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                            {getTypeName(item.type)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{item.prompt}</p>
                      </div>
                      
                      {/* 时间和操作 */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">{item.time}</span>
                        <div className="flex items-center gap-1">
                          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 昨天 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">昨天</h2>
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div 
                      key={i}
                      className="bg-white rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow cursor-pointer border border-gray-100"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">历史创作 {i}</h3>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">图片</span>
                        </div>
                        <p className="text-sm text-gray-500">创作描述内容...</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">{i === 1 ? '16:30' : '10:15'}</span>
                        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* 底部悬浮创作面板 */}
        <div className="fixed bottom-6 left-14 right-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            {/* 类型切换 */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex bg-gray-100 rounded-lg p-0.5">
                {(['image', 'video', 'digital-human', 'lip-sync'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setCreateType(type)}
                    className={`px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
                      createType === type 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {getTypeIcon(type)}
                    {getTypeName(type)}
                  </button>
                ))}
              </div>
              
              <div className="ml-auto flex items-center gap-2">
                <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Upload className="w-5 h-5" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 输入区域 */}
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述你想要创作的内容..."
                className="w-full h-20 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-gray-300 transition-colors"
              />
              <button
                onClick={() => setIsCreating(true)}
                disabled={!prompt.trim()}
                className="absolute bottom-3 right-3 w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* 底部功能按钮 */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-3">
                {/* AI灵感 */}
                <button className="px-3 py-1.5 bg-pink-50 text-pink-600 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-pink-100 transition-colors">
                  <Sparkles className="w-4 h-4" />
                  AI灵感
                </button>
                
                {/* 精准改图 Beta */}
                <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm flex items-center gap-1.5 hover:bg-gray-200 transition-colors">
                  <Edit3 className="w-4 h-4" />
                  精准改图
                  <span className="px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded">Beta</span>
                </button>
              </div>
              
              {/* 积分 */}
              <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Coins className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700">200 积分</span>
                <span className="text-xs text-red-500">剩余不足</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 联系我弹窗 */}
      {showContact && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowContact(false)}>
          <div 
            className="bg-white rounded-2xl p-6 w-80 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">联系我们</h3>
              <button 
                onClick={() => setShowContact(false)}
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
    </div>
  );
}
