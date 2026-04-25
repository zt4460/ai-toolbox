import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 获取当前用户信息
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    // 解析 session token
    const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');

    if (!userId) {
      return NextResponse.json(
        { error: '无效的会话' },
        { status: 401 }
      );
    }

    const client = getSupabaseClient();

    const { data: user, error } = await client
      .from('users')
      .select('id, email, nickname, avatar_url, credits, is_active, created_at, last_login_at')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取用户信息失败' },
      { status: 500 }
    );
  }
}
