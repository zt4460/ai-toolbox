'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/app/providers';
import { ActivationCodeAdminPanel } from '@/features/credits/components/activation-code-admin-panel';
import { useActivationCodeAdmin } from '@/features/credits/hooks/use-activation-code-admin';

export default function ActivationCodesAdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const admin = useActivationCodeAdmin();

  useEffect(() => {
    if (!loading && !user?.is_admin) {
      router.replace('/');
    }
  }, [loading, router, user?.is_admin]);

  if (loading || !user?.is_admin) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">卡密后台</h1>
            <p className="text-sm text-gray-500">创建、批量生成、筛选和作废卡密。</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <ActivationCodeAdminPanel
          records={admin.records}
          statusFilter={admin.statusFilter}
          onStatusFilterChange={admin.setStatusFilter}
          loading={admin.loading}
          submitting={admin.submitting}
          message={admin.message}
          onCreateSingle={admin.createSingle}
          onCreateBatch={admin.createBatch}
          onRevoke={admin.revoke}
          onCopyCode={admin.copyCode}
          onCopyCurrentRecords={admin.copyCurrentRecords}
          onExportCurrentRecords={admin.exportCurrentRecords}
        />
      </main>
    </div>
  );
}
