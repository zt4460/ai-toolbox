import { getSupabaseClient } from '@/storage/database/supabase-client';
import { HttpError } from '@/lib/http/errors';

export interface GenerationRecord {
  id: string;
  prompt: string;
  result_url: string | null;
  type: string;
  status: string;
  parameters: Record<string, unknown>;
  credits_used: number;
  created_at: string;
}

export async function listGenerationRecords(userId: string, params: { type?: string | null; status?: string | null; page: number; limit: number; }) {
  const client = getSupabaseClient();
  let query = client
    .from('generations')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range((params.page - 1) * params.limit, params.page * params.limit - 1);

  if (params.type) {
    query = query.eq('type', params.type);
  }

  if (params.status) {
    query = query.eq('status', params.status);
  }

  const { data, error, count } = await query;
  if (error) {
    throw new HttpError(500, error.message);
  }

  return {
    records: (data || []) as GenerationRecord[],
    total: count || 0,
    page: params.page,
    limit: params.limit,
  };
}

export async function createGenerationRecord(userId: string, input: {
  type: string;
  prompt: string;
  parameters?: Record<string, unknown>;
  result_url?: string | null;
  status?: string;
  credits_used?: number;
}) {
  if (!input.type || !input.prompt) {
    throw new HttpError(400, '缺少必填字段');
  }

  const client = getSupabaseClient();
  const { data, error } = await client
    .from('generations')
    .insert({
      user_id: userId,
      type: input.type,
      prompt: input.prompt,
      parameters: input.parameters || {},
      result_url: input.result_url || null,
      status: input.status || 'pending',
      credits_used: input.credits_used || 0,
    })
    .select()
    .single();

  if (error) {
    throw new HttpError(500, error.message);
  }

  return data as GenerationRecord;
}

export async function getGenerationRecord(userId: string, id: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('generations')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    throw new HttpError(404, '记录不存在');
  }

  return data as GenerationRecord;
}

export async function deleteGenerationRecord(userId: string, id: string) {
  const client = getSupabaseClient();
  const { error } = await client
    .from('generations')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    throw new HttpError(500, error.message);
  }
}
