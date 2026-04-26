'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MailIcon, 
  PlusIcon, 
  Loader2,
  SendIcon,
  EyeIcon
} from 'lucide-react';
import { useAuth } from '../providers';

export default function SubmissionsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('list');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: '',
    category: 'feature',
    priority: 'normal',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && activeTab === 'list') {
      fetchSubmissions();
    }
  }, [user, activeTab]);

  const fetchSubmissions = async () => {
    setLoadingData(true);
    try {
      const res = await fetch('/api/submissions');
      const data = await res.json();
      if (data.submissions) {
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error('获取投稿失败:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setMessage({ type: 'error', text: '请输入标题' });
      return;
    }
    if (!form.description.trim()) {
      setMessage({ type: 'error', text: '请输入详细描述' });
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '提交失败');
      }

      setMessage({ type: 'success', text: '提交成功！' });
      setForm({ title: '', category: 'feature', priority: 'normal', description: '' });
      setActiveTab('list');
      fetchSubmissions();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : '提交失败' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-gray-100 text-gray-600',
      reviewing: 'bg-amber-100 text-amber-700',
      accepted: 'bg-green-100 text-green-700',
      implemented: 'bg-blue-100 text-blue-700',
      rejected: 'bg-red-100 text-red-700'
    };
    const labels: Record<string, string> = {
      pending: '待处理',
      reviewing: '审核中',
      accepted: '已采纳',
      implemented: '已实现',
      rejected: '已拒绝'
    };
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      feature: '功能建议',
      improvement: '功能优化',
      bug: '问题反馈',
      other: '其他'
    };
    return labels[category] || category;
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
        <div className="flex items-center gap-2">
          <MailIcon className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-900">需求投稿箱</span>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('list')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'list'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              我的投递
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'new'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              写信
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {activeTab === 'list' && (
          <div className="space-y-4">
            {loadingData ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-gray-400" />
              </div>
            ) : submissions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <MailIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-2">暂无投递记录</p>
                <p className="text-gray-400 text-sm">点击「写信」提交你的第一个需求</p>
              </div>
            ) : (
              submissions.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    {getStatusBadge(item.status)}
                  </div>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{getCategoryLabel(item.category)}</span>
                    <span>|</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'new' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            {/* Title */}
            <div className="mb-5">
              <label className="text-sm text-gray-600 mb-2 block">标题</label>
              <input
                type="text"
                placeholder="简要描述你的需求"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
              />
            </div>

            {/* Category & Priority */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">类型</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 outline-none cursor-pointer"
                >
                  <option value="feature">功能建议</option>
                  <option value="improvement">功能优化</option>
                  <option value="bug">问题反馈</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">优先级</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 outline-none cursor-pointer"
                >
                  <option value="low">低</option>
                  <option value="normal">普通</option>
                  <option value="high">高</option>
                  <option value="urgent">紧急</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="text-sm text-gray-600 mb-2 block">详细描述</label>
              <textarea
                placeholder="详细描述你的需求..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 resize-none outline-none focus:border-gray-400 transition-colors"
              />
            </div>

            {/* Message */}
            {message.text && (
              <p className={`mb-4 text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                {message.text}
              </p>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <SendIcon className="w-5 h-5" />
              )}
              投递
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
