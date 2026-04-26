import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8');
    const [id, timestamp] = decoded.split(':');
    const sessionTime = parseInt(timestamp);

    if (Date.now() - sessionTime > 7 * 24 * 60 * 60 * 1000) {
      return NextResponse.json({ error: '会话已过期' }, { status: 401 });
    }

    const client = getSupabaseClient();
    const { data: user, error } = await client
      .from('users')
      .select('credits')
      .eq('id', id)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      credits: user.credits || 0
    });
  } catch (error) {
    console.error('查询余额错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
