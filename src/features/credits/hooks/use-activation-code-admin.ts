import { useCallback, useEffect, useState } from 'react';

export interface ActivationCodeRecord {
  id: string;
  code: string;
  cardType: string;
  points: number;
  days: number;
  price: number;
  isUsed: boolean;
  isDisabled: boolean;
  usedBy: string | null;
  usedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

interface CreateSinglePayload {
  code: string;
  cardType: string;
  points: number;
  days: number;
  price: number;
  expiresAt: string;
}

interface CreateBatchPayload {
  cardType: string;
  points: number;
  count: number;
  days: number;
  price: number;
  expiresAt: string;
}

function formatStatus(record: ActivationCodeRecord) {
  if (record.isDisabled) return '已作废';
  if (record.isUsed) return '已使用';
  if (record.expiresAt && new Date(record.expiresAt).getTime() < Date.now()) return '已过期';
  return '未使用';
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function useActivationCodeAdmin() {
  const [records, setRecords] = useState<ActivationCodeRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'unused' | 'used' | 'disabled'>('all');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });

  const loadRecords = useCallback(async (status = statusFilter) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/activation-codes?status=${status}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '加载卡密失败');
      }
      setRecords(data.records || []);
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : '加载卡密失败' });
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadRecords(statusFilter);
  }, [loadRecords, statusFilter]);

  const createSingle = async (payload: CreateSinglePayload) => {
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await fetch('/api/admin/activation-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '创建卡密失败');
      }
      setMessage({ type: 'success', text: `已创建卡密：${data.record.code}` });
      await loadRecords(statusFilter);
      return data.record as ActivationCodeRecord;
    } finally {
      setSubmitting(false);
    }
  };

  const createBatch = async (payload: CreateBatchPayload) => {
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await fetch('/api/admin/activation-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, mode: 'batch' }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '批量生成失败');
      }
      setMessage({ type: 'success', text: `已生成 ${data.records?.length || 0} 条卡密` });
      await loadRecords(statusFilter);
      return (data.records || []) as ActivationCodeRecord[];
    } finally {
      setSubmitting(false);
    }
  };

  const revoke = async (id: string) => {
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await fetch(`/api/admin/activation-codes/${id}`, {
        method: 'PATCH',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '作废失败');
      }
      setMessage({ type: 'success', text: data.message || '卡密已作废' });
      await loadRecords(statusFilter);
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setMessage({ type: 'success', text: `已复制卡密：${code}` });
  };

  const copyCurrentRecords = async () => {
    const content = records.map((record) => record.code).join('\n');
    await navigator.clipboard.writeText(content);
    setMessage({ type: 'success', text: `已复制 ${records.length} 条当前列表卡密` });
  };

  const exportCurrentRecords = () => {
    const lines = records.map((record) => [record.code, record.points, record.cardType, formatStatus(record)].join('\t'));
    const filename = `activation-codes-${new Date().toISOString().slice(0, 10)}.txt`;
    downloadTextFile(filename, lines.join('\n'));
    setMessage({ type: 'success', text: '已导出当前列表' });
  };

  return {
    records,
    statusFilter,
    setStatusFilter,
    loading,
    submitting,
    message,
    createSingle,
    createBatch,
    revoke,
    copyCode,
    copyCurrentRecords,
    exportCurrentRecords,
    refresh: () => loadRecords(statusFilter),
  };
}
