'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ImageIcon,
  VideoIcon,
  UserIcon,
  MessageCircleIcon,
  Loader2,
  CalendarIcon
} from 'lucide-react';
import { useAuth } from '../providers';

type Category = 'all' | 'image' | 'video' | 'digital-human' | 'lip-sync';

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const [category, setCategory] = useState<Category>('all');
  const [history, setHistory] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  const fetchHistory = async () => {
    setFetching(true);
    // 模拟历史数据（实际应从后端获取）
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockHistory = [
      { id: '1', type: 'image', prompt: '一只可爱的橘猫在阳光下打盹', created_at: '2024-01-20 14:30', thumbnail: null },
      { id: '2', type: 'video', prompt: '城市夜景，车流穿梭', created_at: '2024-01-19 10:20', thumbnail: null },
      { id: '3', type: 'image', prompt: '未来科技风格的城市建筑', created_at: '2024-01-18 16:45', thumbnail: null },
      { id: '4', type: 'digital-human', prompt: '欢迎观看本期节目', created_at: '2024-01-17 09:00', thumbnail: null },
      { id: '5', type: 'lip-sync', prompt: '今天天气真不错', created_at: '2024-01-16 20:30', thumbnail: null },
      { id: '6', type: 'video', prompt: '海边日落，浪漫唯美', created_at: '2024-01-15 18:00', thumbnail: null },
      { id: '7', type: 'image', prompt: '中国风山水画', created_at: '2024-01-14 11:15', thumbnail: null },
      { id: '8', type: 'video', prompt: '森林中的小溪流水', created_at: '2024-01-13 15:30', thumbnail: null },
    ];
    
    const filtered = category === 'all' 
      ? mockHistory 
      : mockHistory.filter(item => item.type === category);
    
    setHistory(filtered);
    setFetching(false);
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user, category]);

  const getCategoryIcon = (type: string) => {
    const icons: Record<string, { icon: any; color: string; bg: string; label: string }> = {
      'image': { icon: ImageIcon, color: 'text-violet-600', bg: 'bg-violet-100', label: '图片' },
      'video': { icon: VideoIcon, color: 'text-pink-600', bg: 'bg-pink-100', label: '视频' },
      'digital-human': { icon: UserIcon, color: 'text-cyan-600', bg: 'bg-cyan-100', label: '数字人' },
      'lip-sync': { icon: MessageCircleIcon, color: 'text-amber-600', bg: 'bg-amber-100', label: '配音' },
    };
    return icons[type] || icons['image'];
  };

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: '全部' },
    { id: 'image', label: '图片' },
    { id: 'video', label: '视频' },
    { id: 'digital-human', label: '数字人' },
    { id: 'lip-sync', label: '配音' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">请先登录</p>
        <Link href="/auth" className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium">
          登录
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="h-14 px-4 flex items-center gap-4 border-b border-gray-200 bg-white">
        <Link href="/" className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <span className="font-semibold text-gray-900">历史</span>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                category === cat.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        {fetching ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-gray-400" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-16">
            <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">暂无记录</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => {
              const cat = getCategoryIcon(item.type);
              const Icon = cat.icon;
              return (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${cat.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${cat.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${cat.bg} ${cat.color}`}>
                          {cat.label}
                        </span>
                        <span className="text-xs text-gray-400">{item.created_at}</span>
                      </div>
                      <p className="text-gray-900 text-sm line-clamp-2">{item.prompt}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
