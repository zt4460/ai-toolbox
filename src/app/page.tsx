'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from './providers';
import { 
  ImageIcon, 
  VideoIcon, 
  UserIcon, 
  Mail,
  Sparkles,
  Coins,
  User,
  LogIn,
  Mailbox,
  X,
  History,
  ChevronRight,
  Clock,
  Zap
} from 'lucide-react';

const tools = [
  {
    id: 'image',
    name: '图片生成',
    description: '输入文字描述，AI 帮你生成精美图片',
    icon: ImageIcon,
    href: '/tools/image',
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-500/10',
    cost: 10,
  },
  {
    id: 'video',
    name: '视频生成',
    description: '文字转视频，图片生视频',
    icon: VideoIcon,
    href: '/tools/video',
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-500/10',
    cost: 50,
  },
  {
    id: 'digital-human',
    name: '数字人',
    description: '创建逼真的 AI 数字人形象',
    icon: UserIcon,
    href: '/tools/digital-human',
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-cyan-500/10',
    cost: 30,
  },
  {
    id: 'lip-sync',
    name: '视频配音',
    description: '上传视频，AI 自动对口型',
    icon: Mail,
    href: '/tools/lip-sync',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-500/10',
    cost: 20,
  },
];

// 模拟历史记录数据
const mockHistory = [
  { id: 1, type: 'image', name: '日落海边风景', time: '10分钟前', status: '完成' },
  { id: 2, type: 'video', name: '科技风开场动画', time: '30分钟前', status: '完成' },
  { id: 3, type: 'image', name: '未来城市概念图', time: '1小时前', status: '完成' },
  { id: 4, type: 'digital-human', name: '产品介绍视频', time: '2小时前', status: '完成' },
];

export default function HomePage() {
  const { user, loading } = useAuth();
  const [showContact, setShowContact] = useState(false);
  const [showMailbox, setShowMailbox] = useState(false);

  const getToolIcon = (type: string) => {
    const tool = tools.find(t => t.id === type);
    return tool?.icon || ImageIcon;
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-violet-500/20 rounded-full blur-[128px]" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-pink-500/20 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">AI 工具箱</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/credits" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
              <Coins className="w-4 h-4" />
              积分
            </Link>
            <Link href="/history" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
              <History className="w-4 h-4" />
              历史
            </Link>
            <button 
              onClick={() => setShowContact(true)}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              联系我
            </button>
          </nav>
          <div className="flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm text-white font-medium">{user.nickname || '用户'}</p>
                      <p className="text-xs text-white/60 flex items-center gap-1">
                        <Coins className="w-3 h-3 text-amber-400" />
                        {user.credits} 积分
                      </p>
                    </div>
                  </Link>
                ) : (
                  <Link
                    href="/auth"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    <LogIn className="w-4 h-4" />
                    登录
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section - 简化版 */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
          让<span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">AI</span>变成好用的牛马
        </h1>
      </section>

      {/* Tools Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className={`w-14 h-14 rounded-xl ${tool.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <tool.icon className={`w-7 h-7 bg-gradient-to-br ${tool.color} bg-clip-text`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{tool.name}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{tool.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-white/40">{tool.cost}积分/次</span>
                <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 信箱入口 */}
      <section className="container mx-auto px-4 pb-16">
        <button
          onClick={() => setShowMailbox(true)}
          className="w-full max-w-md mx-auto flex items-center gap-4 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group"
        >
          <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Mailbox className="w-7 h-7 text-emerald-400" />
          </div>
          <div className="text-left flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">需求信箱</h3>
            <p className="text-sm text-white/60">有好的想法？写信告诉我们</p>
          </div>
          <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </button>
      </section>

      {/* 快捷入口卡片 */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/credits"
            className="flex items-center gap-4 p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Coins className="w-6 h-6 text-amber-400" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-white font-medium">积分充值</h3>
              <p className="text-xs text-white/60">当前余额 {user?.credits || 0} 积分</p>
            </div>
          </Link>
          
          <Link
            href="/history"
            className="flex items-center gap-4 p-5 rounded-2xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <History className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-white font-medium">生成历史</h3>
              <p className="text-xs text-white/60">查看历史创作记录</p>
            </div>
          </Link>

          <button
            onClick={() => setShowContact(true)}
            className="flex items-center gap-4 p-5 rounded-2xl border border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 transition-all w-full text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Mail className="w-6 h-6 text-violet-400" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-white font-medium">联系我们</h3>
              <p className="text-xs text-white/60">商务合作与技术支持</p>
            </div>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-white/40">
          <p>AI 工具箱 - 让 AI 变成好用的牛马</p>
        </div>
      </footer>

      {/* 联系我弹窗 */}
      {showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 p-6 relative">
            <button
              onClick={() => setShowContact(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white/70" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">联系我们</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                <Mail className="w-5 h-5 text-violet-400" />
                <div>
                  <p className="text-sm text-white/60">邮箱</p>
                  <p className="text-white">contact@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                <Zap className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-sm text-white/60">微信</p>
                  <p className="text-white">AI_Tools2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 信箱弹窗 */}
      {showMailbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-white/10 p-6 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowMailbox(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white/70" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Mailbox className="w-6 h-6 text-emerald-400" />
              需求信箱
            </h2>
            <div className="space-y-6">
              {/* 写信表单 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">标题</label>
                  <input
                    type="text"
                    placeholder="简要描述你的需求"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">类型</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50">
                    <option value="feature">新功能建议</option>
                    <option value="improvement">功能优化</option>
                    <option value="bug">问题反馈</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">详细内容</label>
                  <textarea
                    rows={4}
                    placeholder="详细描述你的想法..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 resize-none"
                  />
                </div>
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity">
                  发送信件
                </button>
              </div>
              
              {/* 我的投稿历史 */}
              <div className="pt-6 border-t border-white/10">
                <h3 className="text-sm text-white/60 mb-4">我的投递历史</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <div className="flex-1">
                      <p className="text-sm text-white">添加视频时长选择功能</p>
                      <p className="text-xs text-white/40">审核中</p>
                    </div>
                    <span className="text-xs text-white/30">2天前</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div className="flex-1">
                      <p className="text-sm text-white">增加更多数字人形象</p>
                      <p className="text-xs text-white/40">已采纳</p>
                    </div>
                    <span className="text-xs text-white/30">1周前</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
