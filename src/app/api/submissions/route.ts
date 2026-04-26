import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { cookies } from 'next/headers';

function getUserIdFromSession(sessionToken: string): string | null {
  try {
    const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8');
    const [id, timestamp] = decoded.split(':');
    const sessionTime = parseInt(timestamp);
    
    if (Date.now() - sessionTime > 7 * 24 * 60 * 60 * 1000) {
      return null;
    }
    return id;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const userId = getUserIdFromSession(sessionToken);
    if (!userId) {
      return NextResponse.json({ error: '会话已过期' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const client = getSupabaseClient();
    
    let query = client
      .from('submissions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: records, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      submissions: records || [],
      total: count || 0,
      page,
      limit
    });
  } catch (error) {
    console.error('获取投稿记录错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const userId = getUserIdFromSession(sessionToken);
    if (!userId) {
      return NextResponse.json({ error: '会话已过期' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, priority } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: '标题和描述不能为空' },
        { status: 400 }
      );
    }

    if (!['feature', 'improvement', 'bug', 'other'].includes(category)) {
      return NextResponse.json(
        { error: '无效的类型' },
        { status: 400 }
      );
    }

    if (!['low', 'normal', 'high', 'urgent'].includes(priority)) {
      return NextResponse.json(
        { error: '无效的优先级' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    const { data: record, error } = await client
      .from('submissions')
      .insert({
        user_id: userId,
        title,
        description,
        category,
        priority,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      submission: record,
      message: '投稿成功'
    });
  } catch (error) {
    console.error('创建投稿错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: 500 }
    );
  }
}
