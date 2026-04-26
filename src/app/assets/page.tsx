'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Search,
  Wand2,
  Coins,
  Sun,
  Moon,
  FolderOpen,
  Copy,
  Check,
  Trash2,
  X,
  Filter,
  Grid,
  List,
  Image as ImageIcon,
  Loader2,
  Download
} from 'lucide-react';
import { useAuth } from '@/app/providers';

interface GenerationRecord {
  id: string;
  image_url: string;
  video_url?: string; // 视频URL（可选）
  prompt: string;
  resolution: string;
  ratio: string;
  credits_cost: number;
  created_at: string;
  type?: 'image' | 'video'; // 资源类型
}

export default function AssetsPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  // 状态
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<GenerationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<GenerationRecord | null>(null);
  
  // 统计数据
  const stats = useMemo(() => {
    const totalRecords = records.length;
    const totalCredits = records.reduce((sum, r) => sum + r.credits_cost, 0);
    return { totalRecords, totalCredits };
  }, [records]);

  // 切换深色模式
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // 加载模拟数据（实际应该从 API 获取）
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // 模拟加载延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 模拟数据
      const mockRecords: GenerationRecord[] = Array.from({ length: 12 }, (_, i) => {
        const isVideo = i % 4 === 0; // 每4个中有一个视频
        return {
          id: `gen-${i + 1}`,
          image_url: isVideo ? '/placeholder-video.png' : `https://picsum.photos/seed/${Date.now() + i}/512/512`,
          video_url: isVideo ? `https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4` : undefined,
          prompt: isVideo ? `AI生成的动画作品 #${i + 1}` : `AI生成的艺术作品 #${i + 1}`,
          resolution: ['1K', '2K', '4K'][i % 3],
          ratio: ['1:1', '16:9', '9:16'][i % 3],
          credits_cost: isVideo ? 10 : [1, 2, 4][i % 3],
          created_at: new Date(Date.now() - i * 3600000 * 2).toISOString(),
          type: isVideo ? 'video' : 'image',
        };
      });
      
      setRecords(mockRecords);
      setLoading(false);
    };
    
    loadData();
  }, []);

  // 过滤记录
  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records;
    const query = searchQuery.toLowerCase();
    return records.filter(r => 
      r.prompt.toLowerCase().includes(query)
    );
  }, [records, searchQuery]);

  // 复制提示词
  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 删除记录
  const handleDelete = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    setSelectedRecord(null);
  };

  // 下载文件（支持图片和视频）
  // eslint-disable-next-line react-hooks/purity
  const handleDownload = async (record: GenerationRecord) => {
    const url = record.type === 'video' ? record.video_url : record.image_url;
    if (!url) return;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      // 确定文件扩展名和 MIME 类型
      const extension = url.split('.').pop()?.split('?')[0] || (record.type === 'video' ? 'mp4' : 'png');
      const mimeType = blob.type || (record.type === 'video' ? 'video/mp4' : 'image/png');

      // 创建下载链接
      // eslint-disable-next-line react-hooks/purity
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      // eslint-disable-next-line react-hooks/purity
      const timestamp = Date.now();
      link.download = `AI创作_${record.id.slice(0, 8)}_${timestamp}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('下载失败:', error);
      // 如果 fetch 失败，尝试直接打开链接
      window.open(url, '_blank');
    }
  };

  // 格式化时间
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-900 flex">
      {/* 左侧极窄侧边栏 - 固定不动 */}
      <aside className="w-14 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 shrink-0">
        {/* 顶部导航 */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            title="创作"
          >
            <Wand2 className="w-6 h-6" />
          </Link>
          <button
            className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
            title="资产"
          >
            <FolderOpen className="w-6 h-6" />
          </button>
        </div>
        
        {/* 底部功能区 */}
        <div className="mt-auto flex flex-col gap-3">
          {/* 积分显示 */}
          <button 
            className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            title="积分余额"
          >
            <Coins className="w-6 h-6" />
            <span className="text-[9px] mt-0.5">{user?.credits ?? 200}</span>
          </button>
          
          {/* 主题切换 */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            title={isDarkMode ? '浅色模式' : '深色模式'}
          >
            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* 顶部工具栏 */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Link href="/" className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white ml-2">资产</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索创作记录..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-72 h-11 pl-11 pr-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-gray-300 dark:focus:border-gray-500 transition-colors text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>

            {/* 视图切换 */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* 用户头像 */}
            <button 
              onClick={() => user ? router.push('/profile') : router.push('/auth')}
              className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium hover:opacity-90 transition-opacity"
            >
              {user?.nickname?.[0]?.toUpperCase() || 'U'}
            </button>
          </div>
        </header>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 统计卡片 */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">总记录数</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRecords}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">总消耗积分</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCredits}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">当前余额</div>
              <div className="text-2xl font-bold text-pink-500">{user?.credits ?? 200}</div>
            </div>
          </div>

          {/* 内容区域 */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <ImageIcon className="w-16 h-16 mb-4" />
              <p>{searchQuery ? '未找到匹配的结果' : '暂无创作记录'}</p>
            </div>
          ) : viewMode === 'grid' ? (
            /* 网格视图 */
            <div className="grid grid-cols-3 gap-4">
              {filteredRecords.map((record) => (
                <div 
                  key={record.id}
                  className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedRecord(record)}
                >
                  <div className="aspect-square relative bg-gray-100 dark:bg-gray-700">
                    <Image 
                      src={record.image_url} 
                      alt={record.prompt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {/* 下载按钮 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(record);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors opacity-0 group-hover:opacity-100"
                      title="下载"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    {/* 类型标签 */}
                    {record.type === 'video' && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-purple-500/80 text-white text-xs rounded-full">
                        视频
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">{record.prompt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">{record.resolution}</span>
                        <span>{record.ratio}</span>
                      </div>
                      <span className="text-pink-500">-{record.credits_cost}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 列表视图 */
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">图片</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">提示词</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">规格</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">消耗</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">时间</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
                          <Image 
                            src={record.image_url}
                            alt={record.prompt}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700 dark:text-gray-200 max-w-xs truncate">{record.prompt}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">{record.resolution}</span>
                          <span>{record.ratio}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-pink-500 font-medium">-{record.credits_cost}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{formatTime(record.created_at)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleDownload(record)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="下载"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCopy(record.prompt, record.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="复制提示词"
                          >
                            {copiedId === record.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* 详情弹窗 */}
      {selectedRecord && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8"
          onClick={() => setSelectedRecord(null)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 图片预览 */}
            <div className="aspect-square relative bg-gray-100 dark:bg-gray-700">
              <Image 
                src={selectedRecord.image_url}
                alt={selectedRecord.prompt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 512px"
              />
              <button
                onClick={() => setSelectedRecord(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* 详情信息 */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">提示词</h3>
                <div className="flex items-start gap-3">
                  <p className="flex-1 text-gray-900 dark:text-white">{selectedRecord.prompt}</p>
                  <button
                    onClick={() => handleCopy(selectedRecord.prompt, selectedRecord.id)}
                    className="shrink-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {copiedId === selectedRecord.id ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">分辨率</h3>
                  <p className="text-gray-900 dark:text-white">{selectedRecord.resolution}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">比例</h3>
                  <p className="text-gray-900 dark:text-white">{selectedRecord.ratio}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">消耗积分</h3>
                  <p className="text-pink-500 font-medium">-{selectedRecord.credits_cost}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">生成时间</h3>
                  <p className="text-gray-900 dark:text-white">{formatTime(selectedRecord.created_at)}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => handleDownload(selectedRecord)}
                  className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  下载{selectedRecord.type === 'video' ? '视频' : '图片'}
                </button>
                <button
                  onClick={() => handleCopy(selectedRecord.prompt, selectedRecord.id)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  复制提示词
                </button>
                <button
                  onClick={() => handleDelete(selectedRecord.id)}
                  className="px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
