import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { cookies } from 'next/headers';

// 获取用户积分历史记录
export async function GET(request: NextRequest) {
  try {
    // 获取当前用户
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    // 从 session token 中解析用户ID
    const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8');
    const userId = decoded.split(':')[0];

    if (!userId) {
      return NextResponse.json(
        { error: '无效的会话' },
        { status: 401 }
      );
    }

    const client = getSupabaseClient();

    // 获取用户积分余额
    const { data: user, error: userError } = await client
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 获取积分变动记录
    const { data: transactions, error: txError } = await client
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (txError) {
      throw new Error(txError.message);
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // 按类型过滤
    let filteredTransactions = transactions || [];
    if (type && type !== 'all') {
      if (type === 'recharge') {
        filteredTransactions = filteredTransactions.filter(t => 
          ['recharge', 'activation'].includes(t.type)
        );
      } else if (type === 'consume') {
        filteredTransactions = filteredTransactions.filter(t => t.type === 'consume');
      } else if (type === 'gift') {
        filteredTransactions = filteredTransactions.filter(t => t.type === 'refund');
      }
    }

    // 格式化返回数据
    const formattedTransactions = filteredTransactions.map(tx => ({
      id: tx.id,
      type: tx.type,
      amount: tx.amount,
      balance_before: tx.balance_before,
      balance_after: tx.balance_after,
      description: tx.description || getDefaultDescription(tx.type),
      created_at: tx.created_at,
    }));

    return NextResponse.json({
      success: true,
      balance: user.credits,
      transactions: formattedTransactions,
    });
  } catch (error) {
    console.error('获取积分历史错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取失败' },
      { status: 500 }
    );
  }
}

// 获取默认描述
function getDefaultDescription(type: string): string {
  const descriptions: Record<string, string> = {
    recharge: '积分充值',
    consume: '图片生成消耗',
    refund: '积分退还',
    activation: '激活码赠送',
  };
  return descriptions[type] || '积分变动';
}
