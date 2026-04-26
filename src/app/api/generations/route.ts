import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 获取用户的生成记录
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;
    
    if (!sessionToken) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }
    
    // 从 session token 中解析用户ID
    const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8');
    const userId = decoded.split(':')[0];

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const client = getSupabaseClient();

    // 查询生成记录
    const { data: records, error } = await client
      .from('generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      throw new Error(error.message);
    }

    // 获取总数
    const { count } = await client
      .from('generations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    return NextResponse.json({
      success: true,
      records: records || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error('获取生成记录失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取失败' },
      { status: 500 }
    );
  }
}
