'use client';

import { useAuth } from '../providers';
import { AssetToolbar } from '@/features/assets/components/asset-toolbar';
import { AssetStats } from '@/features/assets/components/asset-stats';
import { AssetGrid } from '@/features/assets/components/asset-grid';
import { AssetPreviewDialog } from '@/features/assets/components/asset-preview-dialog';
import { useAssets } from '@/features/assets/hooks/use-assets';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function AssetsPage() {
  const { user } = useAuth();
  const {
    loading,
    searchQuery,
    setSearchQuery,
    filteredRecords,
    stats,
    selectedRecord,
    setSelectedRecord,
    deleteRecord,
    downloadRecord,
  } = useAssets();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            返回工作台
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">资产库</h1>
            <p className="text-sm text-gray-500">查看和管理已生成的图片记录。</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <AssetStats
          totalRecords={stats.totalRecords}
          totalCredits={stats.totalCredits}
          currentCredits={user?.credits ?? 0}
        />

        <AssetToolbar value={searchQuery} onChange={setSearchQuery} />

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white text-sm text-gray-500 shadow-sm">
            暂无符合条件的图片记录。
          </div>
        ) : (
          <AssetGrid records={filteredRecords} onSelect={setSelectedRecord} />
        )}
      </main>

      <AssetPreviewDialog
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onDelete={deleteRecord}
        onDownload={downloadRecord}
      />
    </div>
  );
}
