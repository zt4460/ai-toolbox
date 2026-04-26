'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  CoinsIcon,
  TicketIcon,
  Loader2
} from 'lucide-react';
import { useAuth } from '../providers';

export default function CreditsPage() {
  const { user, loading } = useAuth();
  const [credits, setCredits] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activationCode, setActivationCode] = useState('');
  const [activating, setActivating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setFetching(true);
    try {
      const [creditsRes, historyRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/credits/history')
      ]);
      
      const creditsData = await creditsRes.json();
      const historyData = await historyRes.json();
      
      if (creditsData.user) {
        setCredits(creditsData.user.credits || 0);
      }
      if (historyData.transactions) {
        setTransactions(historyData.transactions);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleActivate = async () => {
    if (!activationCode.trim()) {
      setMessage({ type: 'error', text: '请输入卡密' });
      return;
    }

    setActivating(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/credits/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: activationCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '激活失败');
      }

      setMessage({ type: 'success', text: '激活成功！' });
      setActivationCode('');
      fetchData();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : '激活失败' 
      });
    } finally {
      setActivating(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'recharge':
      case 'activation':
        return <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <CoinsIcon className="w-4 h-4 text-green-600" />
        </div>;
      case 'consume':
        return <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
          <CoinsIcon className="w-4 h-4 text-red-600" />
        </div>;
      case 'refund':
        return <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <CoinsIcon className="w-4 h-4 text-blue-600" />
        </div>;
      default:
        return <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <CoinsIcon className="w-4 h-4 text-gray-600" />
        </div>;
    }
  };

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
        <span className="font-semibold text-gray-900">积分</span>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        {/* Balance Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">当前积分</span>
            <CoinsIcon className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{credits}</div>
          <p className="text-gray-400 text-sm">积分可用于所有 AI 工具</p>
        </div>

        {/* Recharge Packages */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">充值套餐</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { amount: 100, price: 10, label: '100 积分' },
              { amount: 500, price: 45, label: '500 积分', popular: true },
              { amount: 1000, price: 80, label: '1000 积分' },
              { amount: 5000, price: 350, label: '5000 积分' },
            ].map((pkg) => (
              <button
                key={pkg.amount}
                className={`p-4 rounded-xl border text-left transition-all ${
                  pkg.popular
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-semibold text-gray-900">{pkg.label}</p>
                <p className="text-sm text-gray-500">¥{pkg.price}</p>
                {pkg.popular && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-gray-900 text-white text-xs rounded-md">
                    推荐
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Activation */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TicketIcon className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-500">卡密激活</h3>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="请输入卡密"
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
            />
            <button
              onClick={handleActivate}
              disabled={activating}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {activating ? <Loader2 className="w-5 h-5 animate-spin" /> : '激活'}
            </button>
          </div>
          {message.text && (
            <p className={`mt-3 text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {message.text}
            </p>
          )}
        </div>

        {/* Usage Records */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">使用明细</h3>
          {fetching ? (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 mx-auto animate-spin text-gray-400" />
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">暂无使用记录</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                  {getTransactionIcon(tx.type)}
                  <div className="flex-1">
                    <p className="text-gray-900 text-sm">{tx.description}</p>
                    <p className="text-gray-400 text-xs">{new Date(tx.created_at).toLocaleString()}</p>
                  </div>
                  <span className={`font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
