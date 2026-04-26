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
    const type = searchParams.get('type'); // image/video/digital_human/lip_sync
    const status = searchParams.get('status'); // pending/succeeded/failed
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const client = getSupabaseClient();
    
    let query = client
      .from('generations')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (type) {
      query = query.eq('type', type);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data: records, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      records: records || [],
      total: count || 0,
      page,
      limit
    });
  } catch (error) {
    console.error('获取生成记录错误:', error);
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
    const { type, prompt, parameters, result_url, status, credits_used } = body;

    if (!type || !prompt) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    const { data: record, error } = await client
      .from('generations')
      .insert({
        user_id: userId,
        type,
        prompt,
        parameters: parameters || {},
        result_url: result_url || null,
        status: status || 'pending',
        credits_used: credits_used || 0
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      record
    });
  } catch (error) {
    console.error('创建生成记录错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: 500 }
    );
  }
}
