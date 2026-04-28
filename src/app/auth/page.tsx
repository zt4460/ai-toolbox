'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { ArrowLeft, LogIn, UserPlus, Loader2, Sparkles, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  
  // Tab 状态
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // 登录表单
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // 注册表单
  const [regIdentifier, setRegIdentifier] = useState('');
  const [regCode, setRegCode] = useState('');
  const [regActivationCode, setRegActivationCode] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  
  // 发送验证码
  const [sendCodeLoading, setSendCodeLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [codeSent, setCodeSent] = useState(false);
  
  // 通用状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devCode, setDevCode] = useState('');

  // 验证码倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 判断账号类型
  const getAccountType = (value: string): 'email' | 'phone' | 'username' | null => {
    if (value.includes('@')) return 'email';
    if (/^1[3-9]\d{9}$/.test(value)) return 'phone';
    if (value.length >= 3) return 'username';
    return null;
  };

  // 发送验证码
  const handleSendCode = async () => {
    if (!regIdentifier) {
      setError('请先输入账号');
      return;
    }

    const accountType = getAccountType(regIdentifier);
    if (!accountType) {
      setError('请输入有效的邮箱或手机号');
      return;
    }

    setSendCodeLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: regIdentifier }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '发送验证码失败');
        return;
      }

      setCodeSent(true);
      setCountdown(60);
      setDevCode(data.devCode || '');
    } catch {
      setError('发送验证码失败，请稍后重试');
    } finally {
      setSendCodeLoading(false);
    }
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'register') {
      // 验证确认密码
      if (regPassword !== regConfirmPassword) {
        setError('两次输入的密码不一致');
        return;
      }
    }

    setLoading(true);

    try {
      let result;

      if (activeTab === 'login') {
        result = await login(loginIdentifier, loginPassword);
      } else {
        if (!regActivationCode) {
          setError('请输入激活码');
          setLoading(false);
          return;
        }
        result = await register(regIdentifier, regCode, regPassword, regActivationCode);
      }

      if (result.success) {
        router.push('/');
        router.refresh();
      } else {
        setError(result.error || '操作失败');
      }
    } finally {
      setLoading(false);
    }
  };

  // 切换 Tab 重置状态
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'login' | 'register');
    setError('');
    setCodeSent(false);
    setDevCode('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="h-14 px-4 flex items-center border-b border-gray-200 bg-white">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          返回首页
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-4">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {activeTab === 'login' ? '欢迎回来' : '创建账号'}
            </h1>
            <p className="text-gray-500">
              {activeTab === 'login' ? '登录以继续使用 AI 工具箱' : '注册账号，开始您的 AI 创作之旅'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                <TabsTrigger value="login" className="data-[state=active]:bg-white">
                  <LogIn className="w-4 h-4 mr-2" />
                  登录
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  注册
                </TabsTrigger>
              </TabsList>

              {/* 登录表单 */}
              <TabsContent value="login">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="login-identifier" className="text-gray-700 mb-2 block">
                      账号
                    </Label>
                    <Input
                      id="login-identifier"
                      type="text"
                      placeholder="用户名 / 邮箱 / 手机号"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      autoComplete="username"
                      required
                      className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="login-password" className="text-gray-700 mb-2 block">
                      密码
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="输入密码"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                      className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 hover:bg-gray-800"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        登录中...
                      </>
                    ) : (
                      '登录'
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* 注册表单 */}
              <TabsContent value="register">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* 账号 */}
                  <div>
                    <Label htmlFor="reg-identifier" className="text-gray-700 mb-2 block">
                      账号
                    </Label>
                    <Input
                      id="reg-identifier"
                      type="text"
                      placeholder="用户名 / 邮箱 / 手机号"
                      value={regIdentifier}
                      onChange={(e) => setRegIdentifier(e.target.value)}
                      autoComplete="username"
                      required
                      className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  {/* 验证码 */}
                  <div>
                    <Label htmlFor="reg-code" className="text-gray-700 mb-2 block">
                      验证码
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="reg-code"
                        type="text"
                        placeholder="请输入验证码"
                        value={regCode}
                        onChange={(e) => setRegCode(e.target.value)}
                        required
                        maxLength={6}
                        className="flex-1 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSendCode}
                        disabled={sendCodeLoading || countdown > 0}
                        className="shrink-0 border-gray-300 hover:bg-gray-50"
                      >
                        {sendCodeLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : countdown > 0 ? (
                          `${countdown}s`
                        ) : codeSent ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        {countdown > 0 ? '' : !codeSent ? '获取验证码' : '已发送'}
                      </Button>
                    </div>
                  </div>

                  {devCode ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                      当前为本地开发模式，验证码：<span className="font-semibold tracking-widest">{devCode}</span>
                    </div>
                  ) : null}

                  {/* 激活码 */}
                  <div>
                    <Label htmlFor="reg-activation-code" className="text-gray-700 mb-2 block">
                      激活码 <span className="text-gray-400 text-sm">(必填)</span>
                    </Label>
                    <Input
                      id="reg-activation-code"
                      type="text"
                      placeholder="请输入激活码"
                      value={regActivationCode}
                      onChange={(e) => setRegActivationCode(e.target.value)}
                      required
                      className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  {/* 密码 */}
                  <div>
                    <Label htmlFor="reg-password" className="text-gray-700 mb-2 block">
                      密码
                    </Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="至少6位密码"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                      minLength={6}
                      className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  {/* 确认密码 */}
                  <div>
                    <Label htmlFor="reg-confirm-password" className="text-gray-700 mb-2 block">
                      确认密码
                    </Label>
                    <Input
                      id="reg-confirm-password"
                      type="password"
                      placeholder="再次输入密码"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                      minLength={6}
                      className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 hover:bg-gray-800"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        注册中...
                      </>
                    ) : (
                      '注册'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>

          {/* Switch Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {activeTab === 'login' ? '还没有账号？' : '已有账号？'}
            <button
              onClick={() => handleTabChange(activeTab === 'login' ? 'register' : 'login')}
              className="text-violet-600 hover:text-violet-700 ml-1 font-medium"
            >
              {activeTab === 'login' ? '立即注册' : '立即登录'}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
