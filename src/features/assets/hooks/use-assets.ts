import { useEffect, useMemo, useState } from 'react';
import type { AssetRecord } from '@/features/assets/types';

export function useAssets() {
  const [records, setRecords] = useState<AssetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<AssetRecord | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/generations?limit=100');
        const data = await response.json();
        if (data.success && data.records) {
          setRecords(
            data.records.map((record: Record<string, unknown>) => ({
              id: record.id as string,
              imageUrl: (record.result_url as string) || ((record.parameters as Record<string, string>)?.url ?? ''),
              prompt: record.prompt as string,
              resolution: ((record.parameters as Record<string, string>)?.size ?? '2K') as string,
              ratio: ((record.parameters as Record<string, string>)?.ratio ?? '1:1') as string,
              creditsCost: (record.credits_used as number) || 0,
              createdAt: record.created_at as string,
              status: record.status as string,
            })),
          );
        } else {
          setRecords([]);
        }
      } catch {
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return records;
    }

    return records.filter((record) => record.prompt.toLowerCase().includes(query));
  }, [records, searchQuery]);

  async function deleteRecord(id: string) {
    const response = await fetch(`/api/generations/${id}`, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || '删除失败');
    }

    setRecords((current) => current.filter((record) => record.id !== id));
    setSelectedRecord((current) => (current?.id === id ? null : current));
  }

  async function downloadRecord(record: AssetRecord) {
    const response = await fetch(record.imageUrl);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `asset-${record.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  }

  const stats = useMemo(() => ({
    totalRecords: records.length,
    totalCredits: records.reduce((sum, record) => sum + record.creditsCost, 0),
  }), [records]);

  return {
    loading,
    searchQuery,
    setSearchQuery,
    filteredRecords,
    stats,
    selectedRecord,
    setSelectedRecord,
    deleteRecord,
    downloadRecord,
  };
}
