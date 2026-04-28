'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, LogOutIcon, RefreshCw } from 'lucide-react';
import { useAuth } from '../providers';
import { ProfileSummary } from '@/features/profile/components/profile-summary';
import { CreditsPanel } from '@/features/credits/components/credits-panel';
import { getUserDisplayName } from '@/features/auth/display-name';
import { checkDesktopUpdate } from '@/lib/desktop/updater';

interface CreditTransaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'credits'>('profile');
  const [credits, setCredits] = useState(0);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [activationCode, setActivationCode] = useState('');
  const [activating, setActivating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [loading, router, user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadCreditData = async () => {
      try {
        const [creditRes, historyRes] = await Promise.all([
          fetch('/api/credits/balance'),
          fetch('/api/credits/history'),
        ]);
        const creditData = await creditRes.json();
        const historyData = await historyRes.json();

        if (creditData.success) {
          setCredits(creditData.credits || 0);
        }
        if (historyData.success) {
          setTransactions(historyData.transactions || []);
        }
      } catch {
        setTransactions([]);
      }
    };

    loadCreditData();
  }, [user]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'credits') {
      setActiveTab('credits');
      return;
    }

    setActiveTab('profile');
  }, []);

  const handleActivate = async () => {
    if (!activationCode.trim()) {
      setMessage({ type: 'error', text: '请输入卡密' });
      return;
    }

    setActivating(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/credits/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: activationCode }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '激活失败');
      }

      setCredits(data.credits || credits);
      setActivationCode('');
      setMessage({ type: 'success', text: data.message || '激活成功' });
      await refreshUser();

      const historyRes = await fetch('/api/credits/history');
      const historyData = await historyRes.json();
      if (historyData.success) {
        setTransactions(historyData.transactions || []);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : '激活失败' });
    } finally {
      setActivating(false);
    }
  };

  const handleCheckUpdate = async () => {
    setCheckingUpdate(true);
    setUpdateMessage({ type: '', text: '' });

    try {
      const result = await checkDesktopUpdate();
      if (result.status === 'unsupported') {
        setUpdateMessage({ type: 'error', text: '当前是网页环境，请在桌面版中检查更新' });
        return;
      }

      if (result.status === 'none') {
        setUpdateMessage({ type: 'success', text: '当前已经是最新版本' });
        return;
      }

      setUpdateMessage({ type: 'success', text: `更新已安装（${result.version || '新版本'}），请重启应用` });
    } catch (error) {
      setUpdateMessage({ type: 'error', text: error instanceof Error ? error.message : '检查更新失败，请稍后重试' });
    } finally {
      setCheckingUpdate(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              返回工作台
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">个人中心</h1>
              <p className="text-sm text-gray-500">管理账户、积分和卡密。</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={handleCheckUpdate}
              disabled={checkingUpdate}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${checkingUpdate ? 'animate-spin' : ''}`} />
              {checkingUpdate ? '检查中...' : '检查更新'}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
            >
              <LogOutIcon className="h-4 w-4" />
              退出登录
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
          {updateMessage.text ? (
            <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${updateMessage.type === 'error' ? 'border-red-200 bg-red-50 text-red-600' : 'border-green-200 bg-green-50 text-green-700'}`}>
              {updateMessage.text}
            </div>
          ) : null}
          <div className="mb-6 flex items-center justify-between gap-3 border-b border-gray-200 pb-3">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`border-b-2 px-1 py-3 text-sm font-medium transition ${
                  activeTab === 'profile' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                账户信息
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('credits')}
                className={`border-b-2 px-1 py-3 text-sm font-medium transition ${
                  activeTab === 'credits' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                积分管理
              </button>
            </div>
            {user.is_admin ? (
              <Link
                href="/admin/activation-codes"
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
              >
                卡密后台
              </Link>
            ) : null}
          </div>

        {activeTab === 'profile' ? (
          <ProfileSummary
            displayName={getUserDisplayName(user, '未命名用户')}
            email={user.email}
            phone={user.phone}
            createdAt={user.created_at}
          />
        ) : (
          <CreditsPanel
            credits={credits}
            transactions={transactions}
            activationCode={activationCode}
            onActivationCodeChange={setActivationCode}
            onActivate={handleActivate}
            activating={activating}
            message={message}
          />
        )}
      </main>
    </div>
  );
}
