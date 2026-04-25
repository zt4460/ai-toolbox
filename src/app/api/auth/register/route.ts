import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import bcrypt from 'bcryptjs';

// 注册
export async function POST(request: NextRequest) {
  try {
    const { email, password, nickname } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码至少需要6位' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    // 检查邮箱是否已存在
    const { data: existingUser } = await client
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      );
    }

    // 密码哈希
    const passwordHash = await bcrypt.hash(password, 10);

    // 创建用户
    const { data: newUser, error } = await client
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        nickname: nickname || email.split('@')[0],
        credits: 0,
      })
      .select('id, email, nickname, credits, created_at')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      user: newUser,
      message: '注册成功',
    });
  } catch (error) {
    console.error('注册错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '注册失败' },
      { status: 500 }
    );
  }
}
