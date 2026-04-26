'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { ArrowLeft, LogIn, UserPlus, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(email, password);
      } else {
        result = await register(email, password, nickname);
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
              {isLogin ? '欢迎回来' : '创建账号'}
            </h1>
            <p className="text-gray-500">
              {isLogin ? '登录以继续使用 AI 工具箱' : '注册账号，开始您的 AI 创作之旅'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <Tabs defaultValue="login" onValueChange={(v) => setIsLogin(v === 'login')}>
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

              <TabsContent value="login">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email" className="text-gray-700 mb-2 block">
                      邮箱
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

              <TabsContent value="register">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="reg-nickname" className="text-gray-700 mb-2 block">
                      昵称
                    </Label>
                    <Input
                      id="reg-nickname"
                      type="text"
                      placeholder="您的昵称（可选）"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="reg-email" className="text-gray-700 mb-2 block">
                      邮箱
                    </Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="reg-password" className="text-gray-700 mb-2 block">
                      密码
                    </Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="至少6位密码"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
            {isLogin ? '还没有账号？' : '已有账号？'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-violet-600 hover:text-violet-700 ml-1 font-medium"
            >
              {isLogin ? '立即注册' : '立即登录'}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
