import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 验证码验证
export async function POST(request: NextRequest) {
  try {
    const { identifier, code } = await request.json();

    if (!identifier || !code) {
      return NextResponse.json(
        { error: '请提供验证码' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // 判断账号类型
    const isEmail = identifier.includes('@');
    const isPhone = /^1[3-9]\d{9}$/.test(identifier);

    // 构建查询条件
    let query = supabase
      .from('verification_codes')
      .select('*')
      .eq('code', code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (isEmail) {
      query = query.eq('email', identifier);
    } else if (isPhone) {
      query = query.eq('phone', identifier);
    } else {
      return NextResponse.json(
        { error: '请输入有效的邮箱或手机号' },
        { status: 400 }
      );
    }

    const { data: verifyCode, error: queryError } = await query.single();

    if (queryError || !verifyCode) {
      return NextResponse.json(
        { error: '验证码无效或已过期' },
        { status: 400 }
      );
    }

    // 标记验证码已使用
    await supabase
      .from('verification_codes')
      .update({ used: true })
      .eq('id', verifyCode.id);

    return NextResponse.json({
      success: true,
      message: '验证码验证成功',
    });
  } catch (error) {
    console.error('验证码验证错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
