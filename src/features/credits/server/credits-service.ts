import { getSupabaseClient } from '@/storage/database/supabase-client';
import { HttpError } from '@/lib/http/errors';

export async function getCreditBalance(userId: string) {
  const client = getSupabaseClient();
  const { data: user, error } = await client
    .from('users')
    .select('credits')
    .eq('id', userId)
    .single();

  if (error || !user) {
    throw new HttpError(404, '用户不存在');
  }

  return user.credits || 0;
}

export async function getCreditHistory(userId: string, type?: string | null) {
  const client = getSupabaseClient();

  const { data: user, error: userError } = await client
    .from('users')
    .select('credits')
    .eq('id', userId)
    .single();

  if (userError || !user) {
    throw new HttpError(404, '用户不存在');
  }

  const { data: transactions, error: txError } = await client
    .from('credit_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100);

  if (txError) {
    throw new HttpError(500, txError.message);
  }

  let filtered = transactions || [];
  if (type && type !== 'all') {
    if (type === 'recharge') {
      filtered = filtered.filter((item) => ['recharge', 'activation'].includes(item.type));
    } else if (type === 'consume') {
      filtered = filtered.filter((item) => item.type === 'consume');
    } else if (type === 'gift') {
      filtered = filtered.filter((item) => item.type === 'refund');
    }
  }

  return {
    balance: user.credits,
    transactions: filtered.map((tx) => ({
      id: tx.id,
      type: tx.type,
      amount: tx.amount,
      balance_before: tx.balance_before,
      balance_after: tx.balance_after,
      description: tx.description || getDefaultDescription(tx.type),
      created_at: tx.created_at,
    })),
  };
}

export async function activateCredits(userId: string, code: string) {
  if (!code) {
    throw new HttpError(400, '请输入卡密');
  }

  const client = getSupabaseClient();
  const normalizedCode = code.toUpperCase();

  const { data: activationCode, error: findError } = await client
    .from('activation_codes')
    .select('*')
    .eq('code', normalizedCode)
    .maybeSingle();

  if (findError) {
    throw new HttpError(500, findError.message);
  }

  if (!activationCode) {
    throw new HttpError(404, '卡密不存在');
  }

  if (activationCode.is_used) {
    throw new HttpError(400, '该卡密已被使用');
  }

  if (activationCode.is_disabled) {
    throw new HttpError(400, '该卡密已作废');
  }

  if (activationCode.expires_at && new Date(activationCode.expires_at) < new Date()) {
    throw new HttpError(400, '该卡密已过期');
  }

  const { data: user, error: userError } = await client
    .from('users')
    .select('credits')
    .eq('id', userId)
    .maybeSingle();

  if (userError) {
    throw new HttpError(500, userError.message);
  }

  const currentCredits = user?.credits || 0;
  const addedPoints = activationCode.points || 0;
  const newCredits = currentCredits + addedPoints;

  const { error: updateUserError } = await client.from('users').update({ credits: newCredits }).eq('id', userId);
  if (updateUserError) {
    throw new HttpError(500, updateUserError.message);
  }

  const { error: updateCodeError } = await client
    .from('activation_codes')
    .update({ is_used: true, used_by: userId, used_at: new Date().toISOString() })
    .eq('id', activationCode.id);

  if (updateCodeError) {
    throw new HttpError(500, updateCodeError.message);
  }

  await client.from('credit_transactions').insert({
    user_id: userId,
    type: 'activation',
    amount: addedPoints,
    balance_before: currentCredits,
    balance_after: newCredits,
    source: 'activation_code',
    related_id: activationCode.id,
    description: `激活卡密: ${normalizedCode}`,
  });

  return {
    credits: newCredits,
    addedPoints,
    message: '卡密激活成功',
  };
}

function getDefaultDescription(type: string) {
  const descriptions: Record<string, string> = {
    recharge: '积分充值',
    consume: '图片生成消耗',
    refund: '积分退还',
    activation: '激活码赠送',
  };

  return descriptions[type] || '积分变动';
}
