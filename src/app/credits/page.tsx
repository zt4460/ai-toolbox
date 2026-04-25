'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../providers';
import { 
  ArrowLeft,
  Coins,
  Zap,
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
  Gift,
  Shield,
  Check
} from 'lucide-react';

// 模拟交易记录
const mockTransactions = [
  { id: 1, type: 'recharge', amount: 100, description: '充值积分', time: '2024-01-15 14:30' },
  { id: 2, type: 'consume', amount: -10, description: '图片生成', time: '2024-01-15 14:25' },
  { id: 3, type: 'consume', amount: -50, description: '视频生成', time: '2024-01-15 13:00' },
  { id: 4, type: 'activation', amount: 50, description: '卡密激活', time: '2024-01-14 10:00' },
  { id: 5, type: 'consume', amount: -20, description: '视频配音', time: '2024-01-13 16:20' },
];

const packages = [
  { id: 1, credits: 100, price: 10, label: '基础套餐', popular: false },
  { id: 2, credits: 500, price: 45, label: '超值套餐', popular: true },
  { id: 3, credits: 1000, price: 80, label: '专业套餐', popular: false },
  { id: 4, credits: 5000, price: 350, label: '企业套餐', popular: false },
];

export default function CreditsPage() {
  const { user } = useAuth();
  const [showRecharge, setShowRecharge] = useState(false);
  const [showActivate, setShowActivate] = useState(false);
  const [activateCode, setActivateCode] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<typeof packages[0] | null>(null);

  const formatAmount = (amount: number) => {
    return amount > 0 ? `+${amount}` : amount.toString();
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'recharge':
        return <ArrowDownCircle className="w-5 h-5 text-emerald-400" />;
      case 'consume':
        return <ArrowUpCircle className="w-5 h-5 text-rose-400" />;
      case 'activation':
        return <Gift className="w-5 h-5 text-amber-400" />;
      default:
        return <Coins className="w-5 h-5 text-violet-400" />;
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-amber-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/20 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/30">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-xl font-bold text-white">积分中心</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 余额卡片 */}
        <div className="rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Coins className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">当前余额</p>
                <p className="text-3xl font-bold text-white">{user?.credits || 0} <span className="text-lg text-white/60">积分</span></p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowRecharge(true)}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              充值积分
            </button>
            <button
              onClick={() => setShowActivate(true)}
              className="flex-1 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <Gift className="w-5 h-5" />
              卡密激活
            </button>
          </div>
        </div>

        {/* 积分说明 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">积分说明</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-white/5">
              <p className="text-2xl font-bold text-violet-400">10</p>
              <p className="text-xs text-white/60 mt-1">图片生成</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5">
              <p className="text-2xl font-bold text-pink-400">50</p>
              <p className="text-xs text-white/60 mt-1">视频生成</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5">
              <p className="text-2xl font-bold text-cyan-400">30</p>
              <p className="text-xs text-white/60 mt-1">数字人</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5">
              <p className="text-2xl font-bold text-amber-400">20</p>
              <p className="text-xs text-white/60 mt-1">视频配音</p>
            </div>
          </div>
        </div>

        {/* 交易记录 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">使用明细</h2>
          <div className="space-y-3">
            {mockTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                {getTransactionIcon(tx.type)}
                <div className="flex-1">
                  <p className="text-white">{tx.description}</p>
                  <p className="text-xs text-white/40">{tx.time}</p>
                </div>
                <p className={`font-medium ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatAmount(tx.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 充值弹窗 */}
      {showRecharge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-white/10 p-6 relative">
            <button
              onClick={() => { setShowRecharge(false); setSelectedPackage(null); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <span className="text-white/70">&times;</span>
            </button>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Zap className="w-6 h-6 text-amber-400" />
              充值积分
            </h2>
            
            {/* 套餐选择 */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`p-4 rounded-xl border transition-all ${
                    selectedPackage?.id === pkg.id
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {pkg.popular && (
                    <span className="inline-block px-2 py-0.5 text-xs bg-amber-500 text-white rounded-full mb-2">推荐</span>
                  )}
                  <p className="text-2xl font-bold text-white">{pkg.credits}</p>
                  <p className="text-sm text-white/60">积分</p>
                  <p className="text-lg font-medium text-amber-400 mt-2">¥{pkg.price}</p>
                </button>
              ))}
            </div>

            {selectedPackage && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
                <p className="text-white">
                  购买 <span className="font-bold text-amber-400">{selectedPackage.credits}</span> 积分，
                  支付 <span className="font-bold text-amber-400">¥{selectedPackage.price}</span>
                </p>
              </div>
            )}

            <button
              disabled={!selectedPackage}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              {selectedPackage ? '立即支付' : '请选择套餐'}
            </button>

            <p className="text-xs text-white/40 text-center mt-4 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              安全支付，保障您的权益
            </p>
          </div>
        </div>
      )}

      {/* 卡密激活弹窗 */}
      {showActivate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 p-6 relative">
            <button
              onClick={() => { setShowActivate(false); setActivateCode(''); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <span className="text-white/70">&times;</span>
            </button>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Gift className="w-6 h-6 text-emerald-400" />
              卡密激活
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">输入卡密</label>
                <input
                  type="text"
                  value={activateCode}
                  onChange={(e) => setActivateCode(e.target.value.toUpperCase())}
                  placeholder="请输入卡密代码"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 font-mono tracking-wider"
                />
              </div>
              <button
                disabled={!activateCode.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                激活卡密
              </button>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-white/5">
              <p className="text-sm text-white/60">卡密类型说明：</p>
              <ul className="mt-2 space-y-1 text-sm text-white/40">
                <li>积分卡：直接获得对应积分</li>
                <li>月卡/季卡/年卡：期间内不限次数使用</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
