'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';
import {
  ArrowLeft,
  Coins,
  Key,
  History,
  LogOut,
  Loader2,
  Check,
  Sparkles,
  User,
  ArrowRightLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  source: string;
  description: string;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, logout, refreshUser } = useAuth();

  const [activationCode, setActivationCode] = useState('');
  const [activating, setActivating] = useState(false);
  const [activationError, setActivationError] = useState('');
  const [activationSuccess, setActivationSuccess] = useState('');

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  // 认证检查
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  // 获取积分记录
  const fetchTransactions = async () => {
    if (!user) return;

    setLoadingTransactions(true);
    try {
      const response = await fetch('/api/credits/history');
      const data = await response.json();

      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('获取积分记录失败:', error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  // 激活卡密
  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activationCode.trim()) {
      setActivationError('请输入卡密');
      return;
    }

    setActivating(true);
    setActivationError('');
    setActivationSuccess('');

    try {
      const response = await fetch('/api/credits/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: activationCode }),
      });

      const data = await response.json();

      if (data.success) {
        setActivationSuccess(`激活成功！获得 ${data.addedPoints} 积分`);
        setActivationCode('');
        await refreshUser();
        fetchTransactions();
      } else {
        setActivationError(data.error);
      }
    } catch (error) {
      setActivationError('激活失败，请重试');
    } finally {
      setActivating(false);
    }
  };

  // 退出登录
  const handleLogout = async () => {
    await logout();
    router.push('/');
    router.refresh();
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-violet-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            返回首页
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">个人中心</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* User Info Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user.nickname?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {user.nickname || '用户'}
                  </h2>
                  <p className="text-white/60 text-sm">{user.email}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-2xl font-bold text-amber-400">
                  <Coins className="w-6 h-6" />
                  {user.credits}
                </div>
                <p className="text-white/40 text-sm">我的积分</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="activate" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="activate" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                激活卡密
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                积分记录
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                账号设置
              </TabsTrigger>
            </TabsList>

            {/* 激活卡密 */}
            <TabsContent value="activate">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-semibold text-white">激活卡密</h3>
                </div>

                <form onSubmit={handleActivate} className="space-y-4">
                  <div>
                    <Label htmlFor="activation-code" className="text-white/80 mb-2 block">
                      卡密
                    </Label>
                    <Input
                      id="activation-code"
                      type="text"
                      placeholder="请输入卡密"
                      value={activationCode}
                      onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 text-lg tracking-wider font-mono"
                    />
                  </div>

                  {activationError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {activationError}
                    </div>
                  )}

                  {activationSuccess && (
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      {activationSuccess}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={activating}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:opacity-90"
                  >
                    {activating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        激活中...
                      </>
                    ) : (
                      <>
                        <ArrowRightLeft className="w-4 h-4 mr-2" />
                        激活
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 p-4 rounded-xl bg-white/5">
                  <h4 className="text-sm font-medium text-white mb-2">卡密类型说明</h4>
                  <ul className="text-sm text-white/60 space-y-1">
                    <li>• 积分卡：直接充值对应积分到账户</li>
                    <li>• 月卡/季卡/年卡：开通对应时长的会员权限</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* 积分记录 */}
            <TabsContent value="history">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <History className="w-5 h-5 text-violet-400" />
                  <h3 className="text-lg font-semibold text-white">积分记录</h3>
                </div>

                {loadingTransactions ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-8 text-white/40">
                    暂无积分记录
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5"
                      >
                        <div>
                          <p className="text-white font-medium">{tx.description || getTransactionTypeName(tx.type)}</p>
                          <p className="text-white/40 text-sm">
                            {new Date(tx.created_at).toLocaleString('zh-CN')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount}
                          </p>
                          <p className="text-white/40 text-sm">
                            余额: {tx.balance_after}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* 账号设置 */}
            <TabsContent value="settings">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                <h3 className="text-lg font-semibold text-white mb-6">账号设置</h3>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5">
                    <Label className="text-white/60 text-sm">邮箱</Label>
                    <p className="text-white mt-1">{user.email}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5">
                    <Label className="text-white/60 text-sm">昵称</Label>
                    <p className="text-white mt-1">{user.nickname || '未设置'}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5">
                    <Label className="text-white/60 text-sm">注册时间</Label>
                    <p className="text-white mt-1">
                      {new Date(user.created_at).toLocaleString('zh-CN')}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    退出登录
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function getTransactionTypeName(type: string): string {
  const typeMap: Record<string, string> = {
    recharge: '积分充值',
    consume: '积分消费',
    refund: '退款',
    activation: '卡密激活',
  };
  return typeMap[type] || type;
}
