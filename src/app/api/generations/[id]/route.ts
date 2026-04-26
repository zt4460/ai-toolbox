import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 获取单个生成记录
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;
    const { id } = await params;
    
    if (!sessionToken) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }
    
    // 从 session token 中解析用户ID
    const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8');
    const userId = decoded.split(':')[0];

    const client = getSupabaseClient();

    const { data: record, error } = await client
      .from('generations')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!record) {
      return NextResponse.json(
        { error: '记录不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      record,
    });
  } catch (error) {
    console.error('获取生成记录失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取失败' },
      { status: 500 }
    );
  }
}

// 删除生成记录
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;
    const { id } = await params;
    
    if (!sessionToken) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }
    
    // 从 session token 中解析用户ID
    const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8');
    const userId = decoded.split(':')[0];

    const client = getSupabaseClient();

    const { error } = await client
      .from('generations')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除生成记录失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '删除失败' },
      { status: 500 }
    );
  }
}
