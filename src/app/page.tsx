'use client';

import Link from 'next/link';
import { useAuth } from './providers';
import { 
  ImageIcon, 
  VideoIcon, 
  UserIcon, 
  MessageCircleIcon,
  Sparkles,
  Zap,
  Shield,
  Layers,
  Coins,
  User,
  LogIn,
  MessageSquare
} from 'lucide-react';

const tools = [
  {
    id: 'image',
    name: '图片生成',
    description: '输入文字描述，AI 帮你生成精美图片。支持 2K/4K 高清分辨率',
    icon: ImageIcon,
    href: '/tools/image',
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-500/10',
  },
  {
    id: 'video',
    name: '视频生成',
    description: '文字转视频，图片生视频。多种分辨率可选，自动生成配乐',
    icon: VideoIcon,
    href: '/tools/video',
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-500/10',
  },
  {
    id: 'digital-human',
    name: '数字人',
    description: '创建逼真的 AI 数字人形象，可用于虚拟主播、智能客服等场景',
    icon: UserIcon,
    href: '/tools/digital-human',
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-cyan-500/10',
  },
  {
    id: 'lip-sync',
    name: '视频配音',
    description: '上传视频，输入文案，AI 自动对口型。轻松实现多语言配音',
    icon: MessageCircleIcon,
    href: '/tools/lip-sync',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-500/10',
  },
  {
    id: 'submissions',
    name: '需求投稿',
    description: '有好的想法？提交需求建议，帮助我们做得更好',
    icon: MessageSquare,
    href: '/submissions',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-500/10',
  },
];

const features = [
  {
    icon: Sparkles,
    title: '智能创作',
    description: '基于先进 AI 模型，理解你的创意意图',
  },
  {
    icon: Zap,
    title: '极速生成',
    description: '云端算力加持，快速完成创作任务',
  },
  {
    icon: Shield,
    title: '安全可靠',
    description: '企业级安全防护，保护你的创作成果',
  },
  {
    icon: Layers,
    title: '一站式服务',
    description: '从创意到成品，全流程一站搞定',
  },
];

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <div className="relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-violet-500/20 rounded-full blur-[128px]" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-pink-500/20 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">AI 工具箱</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-white/70 hover:text-white transition-colors">
              首页
            </Link>
            <Link href="/tools/image" className="text-sm text-white/70 hover:text-white transition-colors">
              工具
            </Link>
            <Link href="/submissions" className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              投稿箱
            </Link>
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-sm text-white/80">新一代 AI 创作平台</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          释放创意
          <span className="block bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            无限可能
          </span>
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12">
          强大的 AI 工具集，助你轻松实现图片生成、视频创作、数字人制作等创意需求
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="#tools"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-5 h-5" />
            开始创作
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors border border-white/10"
          >
            了解更多
          </Link>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">创作工具</h2>
          <p className="text-white/60">选择适合你的 AI 工具，开启创作之旅</p>
        </div>
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
              <div className={`mt-4 inline-flex items-center gap-1 text-sm font-medium bg-gradient-to-r ${tool.color} bg-clip-text text-transparent`}>
                立即使用
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">为什么选择我们</h2>
          <p className="text-white/60">专业、高效、可靠的 AI 创作体验</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-white/60">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/20 to-purple-600/20 p-8 md:p-16 text-center backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-white mb-4">准备好开始创作了吗？</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            无论你是专业创作者还是初学者，都能在这里找到合适的 AI 工具
          </p>
          <Link
            href="#tools"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-slate-900 font-medium hover:bg-white/90 transition-colors"
          >
            立即体验
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-white/40">
          <p>AI 工具箱 - 释放创意，无限可能</p>
        </div>
      </footer>
    </div>
  );
}
