'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';
import {
  ArrowLeft,
  Send,
  Loader2,
  Check,
  Inbox,
  FileText,
  User,
  MessageSquare,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Submission {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
}

export default function SubmissionsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('normal');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [activeTab, setActiveTab] = useState<'new' | 'list'>('new');

  // 认证检查
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  // 获取我的投稿
  const fetchSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const response = await fetch('/api/submissions');
      const data = await response.json();

      if (data.success) {
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error('获取投稿失败:', error);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  // 提交投稿
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category) {
      setError('请填写完整信息');
      return;
    }

    setSubmitting(true);
    setError('');
    setSubmitSuccess(false);

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category, priority }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(true);
        setTitle('');
        setDescription('');
        setCategory('');
        setPriority('normal');
        fetchSubmissions();
        setActiveTab('list');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
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
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">需求投稿箱</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === 'new' ? 'default' : 'outline'}
              onClick={() => setActiveTab('new')}
              className={activeTab === 'new' ? 'bg-gradient-to-r from-violet-600 to-purple-600' : 'border-white/20 text-white/70'}
            >
              <Send className="w-4 h-4 mr-2" />
              提交新需求
            </Button>
            <Button
              variant={activeTab === 'list' ? 'default' : 'outline'}
              onClick={() => setActiveTab('list')}
              className={activeTab === 'list' ? 'bg-gradient-to-r from-violet-600 to-purple-600' : 'border-white/20 text-white/70'}
            >
              <Inbox className="w-4 h-4 mr-2" />
              我的投稿
              {submissions.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-violet-500/30 text-violet-300">
                  {submissions.length}
                </Badge>
              )}
            </Button>
          </div>

          {/* Submit Form */}
          {activeTab === 'new' && (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-violet-400" />
                <h3 className="text-lg font-semibold text-white">提交您的需求</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white/80 mb-2 block">
                    需求标题
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="简洁描述您的需求"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/80 mb-2 block">需求类型</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feature">新功能建议</SelectItem>
                        <SelectItem value="improvement">功能优化</SelectItem>
                        <SelectItem value="bug">问题反馈</SelectItem>
                        <SelectItem value="other">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white/80 mb-2 block">优先级</Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="选择优先级" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">低</SelectItem>
                        <SelectItem value="normal">普通</SelectItem>
                        <SelectItem value="high">高</SelectItem>
                        <SelectItem value="urgent">紧急</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-white/80 mb-2 block">
                    详细描述
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="请详细描述您的需求..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={6}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {submitSuccess && (
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    提交成功！我们会尽快处理您的需求
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      提交中...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      提交需求
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 p-4 rounded-xl bg-white/5">
                <h4 className="text-sm font-medium text-white mb-2">投稿须知</h4>
                <ul className="text-sm text-white/60 space-y-1">
                  <li>• 请详细描述您的需求，以便我们更好地理解</li>
                  <li>• 我们会认真处理每一条投稿，并在处理后通知您</li>
                  <li>• 对于被采纳的需求，可能会有积分奖励哦</li>
                </ul>
              </div>
            </div>
          )}

          {/* Submissions List */}
          {activeTab === 'list' && (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Inbox className="w-5 h-5 text-violet-400" />
                <h3 className="text-lg font-semibold text-white">我的投稿</h3>
              </div>

              {loadingSubmissions ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-12">
                  <Inbox className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40 mb-4">暂无投稿记录</p>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('new')}
                    className="border-white/20 text-white/70 hover:bg-white/10"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    提交第一个需求
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-medium">{sub.title}</h4>
                        {getStatusBadge(sub.status)}
                      </div>
                      <p className="text-white/60 text-sm mb-3 line-clamp-2">
                        {sub.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-white/40">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {getCategoryName(sub.category)}
                        </span>
                        <span>
                          {new Date(sub.created_at).toLocaleString('zh-CN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function getStatusBadge(status: string) {
  const statusMap: Record<string, { label: string; class: string }> = {
    pending: { label: '待处理', class: 'bg-yellow-500/20 text-yellow-400' },
    reviewing: { label: '审核中', class: 'bg-blue-500/20 text-blue-400' },
    accepted: { label: '已采纳', class: 'bg-green-500/20 text-green-400' },
    implemented: { label: '已实现', class: 'bg-violet-500/20 text-violet-400' },
    rejected: { label: '已拒绝', class: 'bg-red-500/20 text-red-400' },
  };

  const config = statusMap[status] || { label: status, class: 'bg-gray-500/20 text-gray-400' };

  return (
    <Badge className={config.class}>
      {config.label}
    </Badge>
  );
}

function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    feature: '新功能建议',
    improvement: '功能优化',
    bug: '问题反馈',
    other: '其他',
  };
  return categoryMap[category] || category;
}
