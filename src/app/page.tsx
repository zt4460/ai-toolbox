'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Wand2,
  FolderOpen,
  Search,
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
  User,
  Globe,
  Image as ImageIcon,
  Shirt,
  Camera
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
  { id: '1:1', name: '1:1', description: '方形 (1:1)' },
  { id: '16:9', name: '16:9', description: '横版 (16:9)' },
  { id: '9:16', name: '9:16', description: '竖版 (9:16)' },
  { id: '4:3', name: '4:3', description: '标准 (4:3)' },
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

// 电商专用功能类型
type EcommerceTab = 'whitebg' | 'fashion' | 'ecommerce';
type FashionMode = 'product' | 'model';

export default function HomePage() {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCredits, setShowCredits] = useState(false);
  const [showModelSelect, setShowModelSelect] = useState(false);
  const [showInspiration, setShowInspiration] = useState(false);
  const [showRatioSelect, setShowRatioSelect] = useState(false);
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
  const [ecomTab, setEcomTab] = useState<EcommerceTab>('whitebg');
  const [fashionMode, setFashionMode] = useState<FashionMode>('product');
  const [ecomLanguage, setEcomLanguage] = useState(LANGUAGES[0]);
  const [ecomPlatform, setEcomPlatform] = useState(PLATFORMS[0]);
  const [ecomImageTypes, setEcomImageTypes] = useState<string[]>(['main']);
  
  // 高清白底图
  const [whitebgImage, setWhitebgImage] = useState<string | null>(null);
  
  // 服饰赛道
  const [fashionProductImage, setFashionProductImage] = useState<string | null>(null);
  const [fashionProductRef, setFashionProductRef] = useState<string | null>(null);
  const [fashionModelImage, setFashionModelImage] = useState<string | null>(null);
  const [fashionModelRef, setFashionModelRef] = useState<string | null>(null);

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
      .filter(t => ecomImageTypes.includes(t.id))
      .map(t => t.name)
      .join('、');
    
    const inspiration = `${ecomPlatform.name}电商${typeNames}，${ecomLanguage.name}文案风格`;
    setPrompt(inspiration);
    setShowInspiration(false);
  };

  // 切换图片功能选择
  const toggleImageType = (id: string) => {
    setEcomImageTypes(prev => 
      prev.includes(id) 
        ? prev.filter(t => t !== id)
        : [...prev, id]
    );
  };

  // 处理图片上传预览
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setter(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-900 flex">
      {/* 左侧极窄侧边栏 - 固定不动 */}
      <aside className="w-14 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 shrink-0">
        {/* 顶部导航 */}
        <div className="flex flex-col gap-3">
          <button
            className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white transition-all hover:bg-gray-200 dark:hover:bg-gray-600"
            title="创作"
          >
            <Wand2 className="w-6 h-6" />
          </button>
          <button
            className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            title="资产"
          >
            <FolderOpen className="w-6 h-6" />
          </button>
        </div>
        
        {/* 底部功能区 */}
        <div className="mt-auto flex flex-col gap-3">
          {/* 积分显示 */}
          <button 
            onClick={() => setShowCredits(true)}
            className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            title="积分余额"
          >
            <Coins className="w-6 h-6" />
            <span className="text-[9px] mt-0.5">{credits}</span>
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
        {/* 顶部工具栏 - 固定不动 */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">让AI变成好用的牛马</h1>
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
            
            {/* 用户头像 */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium cursor-pointer hover:opacity-90 transition-opacity">
              {user?.nickname?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* 内容区域 - 可滚动 */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto pb-80"
        >
          <div className="max-w-3xl mx-auto px-6 py-8">
            {generatedImages.length === 0 ? (
              /* 空白状态 */
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-24 h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                  <Wand2 className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">开始你的创作</h2>
                <p className="text-gray-500 dark:text-gray-400">在下方描述你想要生成的内容</p>
              </div>
            ) : (
              /* 生成结果网格 */
              <div className="space-y-6">
                {generatedImages.map((img) => (
                  <div key={img.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="aspect-square relative bg-gray-100 dark:bg-gray-700">
                      <Image src={img.url} alt={img.prompt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 512px" />
                    </div>
                    <div className="p-5">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{img.prompt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-xs rounded-full">{selectedResolution.name}</span>
                          <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">{selectedRatio.id}</span>
                          <span className="text-xs text-gray-400">{img.time}</span>
                        </div>
                        <button 
                          onClick={() => handleCopy(img.prompt, img.id)}
                          className="flex items-center gap-1.5 px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm transition-colors"
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
        <div className="fixed bottom-6 left-[72px] right-6 max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
            {/* 功能设置行 */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {/* 参考图上传 */}
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <Upload className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {referenceImage ? '已上传' : '参考图'}
                </span>
              </button>

              {/* 大模型选择 */}
              <div className="relative">
                <button 
                  onClick={() => setShowModelSelect(!showModelSelect)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="text-sm text-gray-600 dark:text-gray-300">{selectedModel.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {showModelSelect && (
                  <div className="absolute bottom-full mb-2 left-0 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden z-20 min-w-52">
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
                    className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
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
              <div className="relative">
                <button 
                  onClick={() => setShowRatioSelect(!showRatioSelect)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="text-sm text-gray-600 dark:text-gray-300">{selectedRatio.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {showRatioSelect && (
                  <div className="absolute bottom-full mb-2 left-0 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden z-20 min-w-48">
                    {RATIOS.map((ratio) => (
                      <button
                        key={ratio.id}
                        onClick={() => { setSelectedRatio(ratio); setShowRatioSelect(false); }}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          selectedRatio.id === ratio.id ? 'bg-gray-50 dark:bg-gray-700' : ''
                        }`}
                      >
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{ratio.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{ratio.description}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 张数选择 */}
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <span className="text-sm text-gray-500 dark:text-gray-400">张数</span>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setImageCount(Math.max(1, imageCount - 1))}
                    className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-white dark:bg-gray-600 rounded-lg text-lg font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">{imageCount}</span>
                  <button 
                    onClick={() => setImageCount(Math.min(4, imageCount + 1))}
                    className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-white dark:bg-gray-600 rounded-lg text-lg font-bold"
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
                className="w-full h-24 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm resize-none focus:outline-none focus:border-gray-300 dark:focus:border-gray-500 transition-colors text-gray-900 dark:text-white placeholder-gray-400"
              />
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isCreating}
                className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>

            {/* 底部功能栏 */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {/* 电商AI灵感 */}
                <button 
                  onClick={() => setShowInspiration(true)}
                  className="px-4 py-2 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  电商专用
                </button>
              </div>
              
              {/* 积分计算 */}
              <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <Coins className="w-5 h-5 text-pink-500" />
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
                className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
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

      {/* 电商专用弹窗 */}
      {showInspiration && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowInspiration(false)}>
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-[420px] shadow-xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-500" />
                电商专用
              </h3>
              <button 
                onClick={() => setShowInspiration(false)}
                className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* 功能标签 */}
            <div className="flex gap-2 mb-5 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <button
                onClick={() => setEcomTab('whitebg')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                  ecomTab === 'whitebg' 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                高清白底图
              </button>
              <button
                onClick={() => setEcomTab('fashion')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  ecomTab === 'fashion' 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <Shirt className="w-4 h-4" />
                服饰赛道
              </button>
              <button
                onClick={() => setEcomTab('ecommerce')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                  ecomTab === 'ecommerce' 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                电商图
              </button>
            </div>

            {/* 高清白底图 */}
            {ecomTab === 'whitebg' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                    <Camera className="w-4 h-4" />
                    上传商品图片
                  </label>
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                    whitebgImage 
                      ? 'border-pink-300 bg-pink-50 dark:bg-pink-900/20' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`} onClick={() => document.getElementById('whitebg-input')?.click()}>
                    {whitebgImage ? (
                      <div className="relative w-full h-40">
                        <Image src={whitebgImage} alt="预览" fill className="object-contain" />
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">点击或拖拽上传图片</p>
                      </>
                    )}
                    <input
                      id="whitebg-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setWhitebgImage)}
                      className="hidden"
                    />
                  </div>
                </div>
                <button
                  disabled={!whitebgImage}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  生成白底图
                </button>
              </div>
            )}

            {/* 服饰赛道 */}
            {ecomTab === 'fashion' && (
              <div className="space-y-4">
                {/* 模式切换 */}
                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
                  <button
                    onClick={() => setFashionMode('product')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      fashionMode === 'product' 
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    换成自己的产品
                  </button>
                  <button
                    onClick={() => setFashionMode('model')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      fashionMode === 'model' 
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    换模特
                  </button>
                </div>

                {/* 换成自己的产品 */}
                {fashionMode === 'product' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        上传产品图（高清）
                      </label>
                      <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                        fashionProductImage 
                          ? 'border-pink-300 bg-pink-50 dark:bg-pink-900/20' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                      }`} onClick={() => document.getElementById('fashion-product-input')?.click()}>
                        {fashionProductImage ? (
                          <div className="relative w-full h-28">
                            <Image src={fashionProductImage} alt="产品图" fill className="object-contain" />
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">点击上传</p>
                          </>
                        )}
                        <input
                          id="fashion-product-input"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, setFashionProductImage)}
                          className="hidden"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        上传参考图
                      </label>
                      <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                        fashionProductRef 
                          ? 'border-pink-300 bg-pink-50 dark:bg-pink-900/20' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                      }`} onClick={() => document.getElementById('fashion-product-ref-upload')?.click()}>
                        {fashionProductRef ? (
                          <div className="relative w-full h-28">
                            <Image src={fashionProductRef} alt="参考图" fill className="object-contain" />
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">点击上传</p>
                          </>
                        )}
                        <input
                          id="fashion-product-ref-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, setFashionProductRef)}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 换模特 */}
                {fashionMode === 'model' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        上传模特图（高清）
                      </label>
                      <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                        fashionModelImage 
                          ? 'border-pink-300 bg-pink-50 dark:bg-pink-900/20' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                      }`} onClick={() => document.getElementById('fashion-model-upload')?.click()}>
                        {fashionModelImage ? (
                          <div className="relative w-full h-28">
                            <Image src={fashionModelImage} alt="模特图" fill className="object-contain" />
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">点击上传</p>
                          </>
                        )}
                        <input
                          id="fashion-model-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, setFashionModelImage)}
                          className="hidden"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        上传参考图
                      </label>
                      <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                        fashionModelRef 
                          ? 'border-pink-300 bg-pink-50 dark:bg-pink-900/20' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                      }`} onClick={() => document.getElementById('fashion-model-ref-upload')?.click()}>
                        {fashionModelRef ? (
                          <div className="relative w-full h-28">
                            <Image src={fashionModelRef} alt="参考图" fill className="object-contain" />
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">点击上传</p>
                          </>
                        )}
                        <input
                          id="fashion-model-ref-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, setFashionModelRef)}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  disabled={fashionMode === 'product' ? !fashionProductImage || !fashionProductRef : !fashionModelImage || !fashionModelRef}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  生成
                </button>
              </div>
            )}

            {/* 电商图 */}
            {ecomTab === 'ecommerce' && (
              <div className="space-y-4">
                {/* 语言选择 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    语言
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => setEcomLanguage(lang)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          ecomLanguage.id === lang.id
                            ? 'bg-pink-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {lang.name}
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
                        onClick={() => setEcomPlatform(platform)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          ecomPlatform.id === platform.id
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" />
                    图片功能
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {IMAGE_TYPES.map((type) => (
                      <label
                        key={type.id}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                          ecomImageTypes.includes(type.id)
                            ? 'bg-pink-50 dark:bg-pink-900/30'
                            : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={ecomImageTypes.includes(type.id)}
                          onChange={() => toggleImageType(type.id)}
                          className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                        />
                        <span className={`text-sm ${
                          ecomImageTypes.includes(type.id)
                            ? 'text-pink-600 dark:text-pink-400'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {type.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleInspiration}
                  disabled={ecomImageTypes.length === 0}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  生成灵感
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
