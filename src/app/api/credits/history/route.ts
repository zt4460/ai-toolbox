import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 获取积分记录
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');

    if (!userId) {
      return NextResponse.json(
        { error: '无效的会话' },
        { status: 401 }
      );
    }

    const client = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const { data: transactions, error, count } = await client
      .from('credit_transactions')
      .select('id, type, amount, balance_before, balance_after, source, description, created_at', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      throw new Error(error.message);
    }

    // 获取用户当前积分
    const { data: user } = await client
      .from('users')
      .select('credits')
      .eq('id', userId)
      .maybeSingle();

    return NextResponse.json({
      success: true,
      transactions: transactions || [],
      total: count || 0,
      page,
      pageSize,
      credits: user?.credits || 0,
    });
  } catch (error) {
    console.error('获取积分记录错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取失败' },
      { status: 500 }
    );
  }
}
