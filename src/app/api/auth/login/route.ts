import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

// 登录
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    // 查询用户
    const { data: user, error } = await client
      .from('users')
      .select('id, email, password_hash, nickname, avatar_url, credits, is_active, created_at')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 401 }
      );
    }

    // 检查用户是否激活
    if (!user.is_active) {
      return NextResponse.json(
        { error: '账号已被禁用' },
        { status: 403 }
      );
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      );
    }

    // 更新最后登录时间
    await client
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id);

    // 创建简单的会话 token（实际生产环境应使用 JWT 或 session）
    const sessionToken = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
    
    // 设置 cookie
    const cookieStore = await cookies();
    cookieStore.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7天
      path: '/',
    });

    // 返回用户信息（不包含密码）
    const { password_hash, ...userInfo } = user;

    return NextResponse.json({
      success: true,
      user: userInfo,
      message: '登录成功',
    });
  } catch (error) {
    console.error('登录错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '登录失败' },
      { status: 500 }
    );
  }
}
