import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import bcrypt from 'bcryptjs';

// 注册
export async function POST(request: NextRequest) {
  try {
    const { identifier, password, code } = await request.json();

    if (!identifier || !password || !code) {
      return NextResponse.json(
        { error: '账号、验证码和密码不能为空' },
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

    // 判断账号类型
    const isEmail = identifier.includes('@');
    const isPhone = /^1[3-9]\d{9}$/.test(identifier);
    const username = isEmail ? null : isPhone ? null : identifier;

    // 验证验证码
    const { data: codeRecord, error: codeError } = await client
      .from('verification_codes')
      .select('*')
      .eq('code', code)
      .eq('identifier', identifier)
      .eq('is_used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (codeError) {
      throw new Error(codeError.message);
    }

    if (!codeRecord) {
      return NextResponse.json(
        { error: '验证码无效或已过期' },
        { status: 400 }
      );
    }

    // 检查验证码是否过期（10分钟）
    const codeTime = new Date(codeRecord.created_at).getTime();
    const now = Date.now();
    if (now - codeTime > 10 * 60 * 1000) {
      return NextResponse.json(
        { error: '验证码已过期，请重新获取' },
        { status: 400 }
      );
    }

    // 标记验证码已使用
    await client
      .from('verification_codes')
      .update({ is_used: true })
      .eq('id', codeRecord.id);

    // 检查账号是否已存在
    let query = client.from('users').select('id');
    if (isEmail) {
      query = query.eq('email', identifier);
    } else if (isPhone) {
      query = query.eq('phone', identifier);
    } else {
      query = query.eq('username', identifier);
    }
    
    const { data: existingUser } = await query.maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { error: '该账号已被注册' },
        { status: 400 }
      );
    }

    // 密码哈希
    const passwordHash = await bcrypt.hash(password, 10);

    // 创建用户
    const insertData: Record<string, string | number> = {
      password_hash: passwordHash,
      credits: 100, // 新用户赠送100积分
    };

    if (isEmail) {
      insertData.email = identifier;
      insertData.nickname = identifier.split('@')[0];
    } else if (isPhone) {
      insertData.phone = identifier;
      insertData.nickname = identifier.slice(-4);
    } else {
      insertData.username = username!;
      insertData.nickname = username!;
    }

    const { data: newUser, error: insertError } = await client
      .from('users')
      .insert(insertData)
      .select('id, username, email, phone, nickname, credits, created_at')
      .single();

    if (insertError) {
      throw new Error(insertError.message);
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
