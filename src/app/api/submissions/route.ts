import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 提交需求
export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;

    // 允许未登录用户提交，但记录联系方式
    let userId = null;
    if (sessionToken) {
      const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8');
      [userId] = decoded.split(':');
    }

    const { title, description, category, priority, contact } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: '标题和描述不能为空' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    const { data: submission, error } = await client
      .from('submissions')
      .insert({
        user_id: userId,
        title,
        description,
        category: category || 'other',
        priority: priority || 'normal',
        contact: contact || '',
        status: 'pending',
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      submission,
      message: '提交成功，感谢您的反馈！',
    });
  } catch (error) {
    console.error('提交需求错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '提交失败' },
      { status: 500 }
    );
  }
}

// 获取我的投稿列表
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
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    const { data: submissions, error, count } = await client
      .from('submissions')
      .select('id, title, category, priority, status, admin_reply, created_at, replied_at', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      submissions: submissions || [],
      total: count || 0,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('获取投稿列表错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取失败' },
      { status: 500 }
    );
  }
}
