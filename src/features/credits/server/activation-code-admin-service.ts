import { randomBytes } from 'crypto';
import { HttpError } from '@/lib/http/errors';
import { getSupabaseClient } from '@/storage/database/supabase-client';

interface ListActivationCodesFilters {
  status?: 'all' | 'unused' | 'used' | 'disabled';
}

interface CreateActivationCodeInput {
  cardType: string;
  points: number;
  expiresAt?: string | null;
  days?: number;
  price?: number;
  code?: string;
}

interface CreateActivationCodesBatchInput {
  cardType: string;
  points: number;
  count: number;
  expiresAt?: string | null;
  days?: number;
  price?: number;
}

function normalizeCardType(value: string) {
  const cardType = value.trim();
  if (!cardType) {
    throw new HttpError(400, '请输入卡密类型');
  }
  return cardType;
}

function normalizePoints(value: number) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new HttpError(400, '积分必须是大于 0 的整数');
  }
  return value;
}

function normalizeCount(value: number) {
  if (!Number.isInteger(value) || value <= 0 || value > 200) {
    throw new HttpError(400, '批量数量必须在 1 到 200 之间');
  }
  return value;
}

function normalizeOptionalNumber(value: number | undefined) {
  if (value == null) {
    return 0;
  }

  if (!Number.isInteger(value) || value < 0) {
    throw new HttpError(400, '数字字段必须是大于等于 0 的整数');
  }

  return value;
}

function normalizeExpiresAt(value?: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new HttpError(400, '过期时间格式无效');
  }

  return date.toISOString();
}

function generateActivationCode() {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const randomPart = randomBytes(4).toString('hex').toUpperCase();
  return `AI-${datePart}-${randomPart}`;
}

function mapActivationCode(record: Record<string, unknown>) {
  return {
    id: record.id,
    code: record.code,
    cardType: record.card_type,
    points: record.points,
    days: record.days,
    price: record.price,
    isUsed: record.is_used,
    isDisabled: record.is_disabled,
    usedBy: record.used_by,
    usedAt: record.used_at,
    expiresAt: record.expires_at,
    createdAt: record.created_at,
  };
}

export async function listActivationCodes(filters: ListActivationCodesFilters) {
  const client = getSupabaseClient();
  let query = client
    .from('activation_codes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (filters.status === 'unused') {
    query = query.eq('is_used', false).eq('is_disabled', false);
  } else if (filters.status === 'used') {
    query = query.eq('is_used', true);
  } else if (filters.status === 'disabled') {
    query = query.eq('is_disabled', true);
  }

  const { data, error } = await query;
  if (error) {
    throw new HttpError(500, error.message);
  }

  return {
    records: (data || []).map((item) => mapActivationCode(item as Record<string, unknown>)),
  };
}

export async function createActivationCode(input: CreateActivationCodeInput) {
  const client = getSupabaseClient();
  const payload = {
    code: (input.code?.trim().toUpperCase() || generateActivationCode()),
    card_type: normalizeCardType(input.cardType),
    points: normalizePoints(input.points),
    days: normalizeOptionalNumber(input.days),
    price: normalizeOptionalNumber(input.price),
    expires_at: normalizeExpiresAt(input.expiresAt),
    is_used: false,
    is_disabled: false,
  };

  const { data, error } = await client
    .from('activation_codes')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    throw new HttpError(500, error.message);
  }

  return mapActivationCode(data as Record<string, unknown>);
}

export async function createActivationCodesBatch(input: CreateActivationCodesBatchInput) {
  const client = getSupabaseClient();
  const count = normalizeCount(input.count);
  const payload = Array.from({ length: count }, () => ({
    code: generateActivationCode(),
    card_type: normalizeCardType(input.cardType),
    points: normalizePoints(input.points),
    days: normalizeOptionalNumber(input.days),
    price: normalizeOptionalNumber(input.price),
    expires_at: normalizeExpiresAt(input.expiresAt),
    is_used: false,
    is_disabled: false,
  }));

  const { data, error } = await client
    .from('activation_codes')
    .insert(payload)
    .select('*');

  if (error) {
    throw new HttpError(500, error.message);
  }

  return {
    records: (data || []).map((item) => mapActivationCode(item as Record<string, unknown>)),
  };
}

export async function revokeActivationCode(id: string) {
  const client = getSupabaseClient();
  const { data: record, error: fetchError } = await client
    .from('activation_codes')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) {
    throw new HttpError(500, fetchError.message);
  }

  if (!record) {
    throw new HttpError(404, '卡密不存在');
  }

  if (record.is_used) {
    throw new HttpError(400, '已使用卡密不能作废');
  }

  if (record.is_disabled) {
    throw new HttpError(400, '该卡密已作废');
  }

  const { data, error } = await client
    .from('activation_codes')
    .update({ is_disabled: true, expires_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new HttpError(500, error.message);
  }

  return mapActivationCode(data as Record<string, unknown>);
}
