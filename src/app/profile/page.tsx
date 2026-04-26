'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  UserIcon, 
  LogOutIcon, 
  CoinsIcon,
  TicketIcon,
  HistoryIcon,
  Loader2
} from 'lucide-react';
import { useAuth } from '../providers';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [credits, setCredits] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activationCode, setActivationCode] = useState('');
  const [activating, setActivating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchCredits();
      fetchTransactions();
    }
  }, [user]);

  const fetchCredits = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setCredits(data.user.credits || 0);
      }
    } catch (error) {
      console.error('获取积分失败:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/credits/history');
      const data = await res.json();
      if (data.transactions) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('获取交易记录失败:', error);
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
      fetchCredits();
      fetchTransactions();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : '激活失败' 
      });
    } finally {
      setActivating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
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

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
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
        <span className="font-semibold text-gray-900">个人中心</span>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              个人信息
            </button>
            <button
              onClick={() => setActiveTab('credits')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'credits'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              积分管理
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Avatar & Name */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{user.nickname || user.email}</h2>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">账户信息</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">邮箱</span>
                  <span className="text-gray-900">{user.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">积分余额</span>
                  <span className="text-gray-900 font-medium">{credits} 积分</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">注册时间</span>
                  <span className="text-gray-900">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              <LogOutIcon className="w-5 h-5" />
              退出登录
            </button>
          </div>
        )}

        {activeTab === 'credits' && (
          <div className="space-y-6">
            {/* Balance Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">当前积分</span>
                <div className="flex items-center gap-2">
                  <CoinsIcon className="w-5 h-5 text-amber-500" />
                  <span className="text-2xl font-bold text-gray-900">{credits}</span>
                </div>
              </div>
            </div>

            {/* Activation */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">卡密激活</h3>
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

            {/* Transaction History */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">积分明细</h3>
              {transactions.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">暂无积分记录</p>
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
          </div>
        )}
      </main>
    </div>
  );
}
