'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Wand2,
  FolderOpen,
  Search,
  Grid3X3,
  List,
  Sparkles,
  Upload,
  X,
  Send,
  Coins,
  Sun,
  Moon,
  ChevronDown,
  Copy,
  Check,
  Loader2,
  RectangleVertical,
  Maximize,
  Grid2X2,
  User,
  Globe,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from './providers';

// 积分配置
const CREDIT_CONFIG = {
  baseCost: 1,
  resolutionMultipliers: {
    '1K': 1,
    '2K': 2,
    '4K': 4,
  },
  ratioMultipliers: {
    '1:1': 1,
    '16:9': 1.2,
    '9:16': 1.2,
    '4:3': 1.1,
  },
};

// 大模型配置
const MODELS = [
  { id: 'std', name: '标准版', description: '稳定生成，适合日常场景' },
  { id: 'pro', name: '专业版', description: '高质量生成，适合复杂场景' },
  { id: 'hd', name: '高清版', description: '最高质量，适合精细需求' },
];

// 分辨率配置
const RESOLUTIONS = [
  { id: '1K', name: '1K', size: '1024×1024', cost: 1 },
  { id: '2K', name: '2K', size: '2048×2048', cost: 2 },
  { id: '4K', name: '4K', size: '4096×4096', cost: 4 },
];

// 比例配置
const RATIOS = [
  { id: '1:1', name: '1:1', icon: Grid2X2 },
  { id: '16:9', name: '16:9', icon: Maximize },
  { id: '9:16', name: '9:16', icon: RectangleVertical },
  { id: '4:3', name: '4:3', icon: Grid2X2 },
];

// 电商灵感配置
const LANGUAGES = [
  { id: 'zh', name: '中文' },
  { id: 'en', name: '英文' },
  { id: 'ja', name: '日文' },
  { id: 'ko', name: '韩文' },
];

const COUNTRIES = [
  { id: 'cn', name: '中国' },
  { id: 'us', name: '美国' },
  { id: 'jp', name: '日本' },
  { id: 'kr', name: '韩国' },
  { id: 'eu', name: '欧洲' },
];

const PLATFORMS = [
  { id: 'taobao', name: '淘宝' },
  { id: 'jd', name: '京东' },
  { id: 'pdd', name: '拼多多' },
  { id: 'tmall', name: '天猫' },
  { id: 'amazon', name: '亚马逊' },
  { id: 'shopify', name: 'Shopify' },
];

const IMAGE_TYPES = [
  { id: 'main', name: '主图' },
  { id: 'detail', name: '材质细节图' },
  { id: 'scene', name: '使用场景图' },
  { id: 'feature', name: '卖点展示图' },
  { id: 'model', name: '模特展示图' },
  { id: 'package', name: '包装展示图' },
];

export default function HomePage() {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCredits, setShowCredits] = useState(false);
  const [showModelSelect, setShowModelSelect] = useState(false);
  const [showInspiration, setShowInspiration] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // 创作设置状态
  const [prompt, setPrompt] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [selectedResolution, setSelectedResolution] = useState(RESOLUTIONS[0]);
  const [selectedRatio, setSelectedRatio] = useState(RATIOS[0]);
  const [imageCount, setImageCount] = useState(1);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<Array<{id: string; url: string; prompt: string; time: string}>>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 电商灵感设置
  const [inspirationLanguage, setInspirationLanguage] = useState(LANGUAGES[0]);
  const [inspirationCountry, setInspirationCountry] = useState(COUNTRIES[0]);
  const [inspirationPlatform, setInspirationPlatform] = useState(PLATFORMS[0]);
  const [inspirationImageTypes, setInspirationImageTypes] = useState<string[]>(['main']);

  // 模拟积分余额
  const credits = user?.credits ?? 200;

  // 计算消耗积分
  const calculateCost = () => {
    const resolutionCost = CREDIT_CONFIG.resolutionMultipliers[selectedResolution.id as keyof typeof CREDIT_CONFIG.resolutionMultipliers] || 1;
    const ratioCost = CREDIT_CONFIG.ratioMultipliers[selectedRatio.id as keyof typeof CREDIT_CONFIG.ratioMultipliers] || 1;
    return Math.round(CREDIT_CONFIG.baseCost * resolutionCost * ratioCost * imageCount);
  };

  // 切换深色/浅色模式
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // 生成图片
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsCreating(true);
    
    // 模拟生成过程
    setTimeout(() => {
      const newImages = Array.from({ length: imageCount }, (_, i) => ({
        id: `img-${Date.now()}-${i}`,
        url: `https://picsum.photos/seed/${Date.now() + i}/512/512`,
        prompt: prompt,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      }));
      setGeneratedImages(prev => [...newImages, ...prev]);
      setIsCreating(false);
    }, 2000);
  };

  // 复制提示词
  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 处理电商灵感
  const handleInspiration = () => {
    const typeNames = IMAGE_TYPES
      .filter(t => inspirationImageTypes.includes(t.id))
      .map(t => t.name)
      .join('、');
    
    const inspiration = `${inspirationPlatform.name}电商${typeNames}，${inspirationCountry.name}市场，${inspirationLanguage.name}文案风格`;
    setPrompt(inspiration);
    setShowInspiration(false);
  };

  // 切换图片类型选择
  const toggleImageType = (id: string) => {
    setInspirationImageTypes(prev => 
      prev.includes(id) 
        ? prev.filter(t => t !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-900 flex">
      {/* 左侧极窄侧边栏 - 固定不动 */}
      <aside className="w-12 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 shrink-0">
        {/* 顶部导航 */}
        <div className="flex flex-col gap-2">
          <button
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
            title="创作"
          >
            <Wand2 className="w-5 h-5" />
          </button>
          <button
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            title="资产"
          >
            <FolderOpen className="w-5 h-5" />
          </button>
        </div>
        
        {/* 底部功能区 */}
        <div className="mt-auto flex flex-col gap-2">
          {/* 积分显示 */}
          <button 
            onClick={() => setShowCredits(true)}
            className="w-10 h-10 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            title="积分余额"
          >
            <Coins className="w-5 h-5" />
            <span className="text-[8px] mt-0.5">{credits}</span>
          </button>
          
          {/* 主题切换 */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            title={isDarkMode ? '浅色模式' : '深色模式'}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          {/* 用户头像 */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-medium mt-2">
            {user?.nickname?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* 顶部工具栏 - 固定不动 */}
        <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">让AI变成好用的牛马</h1>
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
                className="w-64 h-9 pl-9 pr-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-gray-300 dark:focus:border-gray-500 transition-colors text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>
            
            {/* 视图切换 */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
              >
                <List className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
              >
                <Grid3X3 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </header>

        {/* 内容区域 - 可滚动 */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto pb-72"
        >
          <div className="max-w-4xl mx-auto px-6 py-8">
            {generatedImages.length === 0 ? (
              /* 空白状态 */
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <Wand2 className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">开始你的创作</h2>
                <p className="text-gray-500 dark:text-gray-400">在下方描述你想要生成的内容</p>
              </div>
            ) : (
              /* 生成结果网格 */
              <div className="space-y-6">
                {generatedImages.map((img) => (
                  <div key={img.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="aspect-square relative bg-gray-100 dark:bg-gray-700">
                      <Image src={img.url} alt={img.prompt} fill className="object-cover" />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{img.prompt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-xs rounded-full">{selectedResolution.name}</span>
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">{selectedRatio.id}</span>
                          <span className="text-xs text-gray-400">{img.time}</span>
                        </div>
                        <button 
                          onClick={() => handleCopy(img.prompt, img.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm transition-colors"
                        >
                          {copiedId === img.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copiedId === img.id ? '已复制' : '复制'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 底部悬浮创作面板 - 固定在底部 */}
        <div className="fixed bottom-6 left-[72px] right-6 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            {/* 功能设置行 */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {/* 参考图上传 */}
              <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <Upload className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {referenceImage ? '已上传' : '参考图'}
                </span>
              </button>

              {/* 大模型选择 */}
              <div className="relative">
                <button 
                  onClick={() => setShowModelSelect(!showModelSelect)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="text-sm text-gray-600 dark:text-gray-300">{selectedModel.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {showModelSelect && (
                  <div className="absolute bottom-full mb-2 left-0 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden z-20 min-w-48">
                    {MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => { setSelectedModel(model); setShowModelSelect(false); }}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          selectedModel.id === model.id ? 'bg-gray-50 dark:bg-gray-700' : ''
                        }`}
                      >
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{model.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{model.description}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 分辨率选择 */}
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-xl">
                {RESOLUTIONS.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => setSelectedResolution(res)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      selectedResolution.id === res.id 
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    {res.name}
                  </button>
                ))}
              </div>

              {/* 比例选择 */}
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-xl">
                {RATIOS.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setSelectedRatio(ratio)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                      selectedRatio.id === ratio.id 
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                    }`}
                    title={ratio.id}
                  >
                    <ratio.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              {/* 张数选择 */}
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <span className="text-sm text-gray-500 dark:text-gray-400">张数</span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setImageCount(Math.max(1, imageCount - 1))}
                    className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-white dark:bg-gray-600 rounded-lg text-lg font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">{imageCount}</span>
                  <button 
                    onClick={() => setImageCount(Math.min(4, imageCount + 1))}
                    className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-white dark:bg-gray-600 rounded-lg text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* 输入区域 */}
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述你想要创作的内容..."
                className="w-full h-20 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm resize-none focus:outline-none focus:border-gray-300 dark:focus:border-gray-500 transition-colors text-gray-900 dark:text-white placeholder-gray-400"
              />
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isCreating}
                className="absolute bottom-3 right-3 w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>

            {/* 底部功能栏 */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {/* 电商AI灵感 */}
                <button 
                  onClick={() => setShowInspiration(true)}
                  className="px-3 py-1.5 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  电商AI灵感
                </button>
              </div>
              
              {/* 积分计算 */}
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <Coins className="w-4 h-4 text-pink-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  本次消耗 <span className="font-semibold text-gray-900 dark:text-white">{calculateCost()}</span> 积分
                </span>
                <span className="text-xs text-gray-400">|</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">剩余 {credits} 积分</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 积分详情弹窗 */}
      {showCredits && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowCredits(false)}>
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-80 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">积分余额</h3>
              <button 
                onClick={() => setShowCredits(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{credits}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">可用积分</div>
            </div>
            <div className="space-y-2">
              <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
                立即充值
              </button>
              <button className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                激活卡密
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 电商AI灵感弹窗 */}
      {showInspiration && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowInspiration(false)}>
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-80 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-500" />
                电商AI灵感
              </h3>
              <button 
                onClick={() => setShowInspiration(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* 语言选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  语言
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setInspirationLanguage(lang)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        inspirationLanguage.id === lang.id
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 国家选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  国家
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {COUNTRIES.map((country) => (
                    <button
                      key={country.id}
                      onClick={() => setInspirationCountry(country)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        inspirationCountry.id === country.id
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {country.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 平台选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  平台
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PLATFORMS.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => setInspirationPlatform(platform)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        inspirationPlatform.id === platform.id
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {platform.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 图片功能选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <ImageIcon className="w-4 h-4" />
                  图片功能
                </label>
                <div className="space-y-2">
                  {IMAGE_TYPES.map((type) => (
                    <label
                      key={type.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        inspirationImageTypes.includes(type.id)
                          ? 'bg-pink-50 dark:bg-pink-900/30'
                          : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={inspirationImageTypes.includes(type.id)}
                        onChange={() => toggleImageType(type.id)}
                        className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                      />
                      <span className={`text-sm ${
                        inspirationImageTypes.includes(type.id)
                          ? 'text-pink-600 dark:text-pink-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {type.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleInspiration}
              disabled={inspirationImageTypes.length === 0}
              className="w-full mt-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              生成灵感
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
