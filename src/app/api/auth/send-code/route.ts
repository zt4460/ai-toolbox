import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 发送验证码
export async function POST(request: NextRequest) {
  try {
    const { identifier } = await request.json();

    if (!identifier) {
      return NextResponse.json(
        { error: '请提供账号' },
        { status: 400 }
      );
    }

    // 判断账号类型
    const isEmail = identifier.includes('@');
    const isPhone = /^1[3-9]\d{9}$/.test(identifier);

    if (!isEmail && !isPhone) {
      return NextResponse.json(
        { error: '请输入有效的邮箱或手机号' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    // 生成6位数字验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 10分钟后过期
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // 保存验证码
    const insertData: Record<string, string> = {
      code,
      type: 'register',
      expires_at: expiresAt,
    };

    if (isEmail) {
      insertData.email = identifier;
    } else {
      insertData.phone = identifier;
    }

    const { error: insertError } = await supabase
      .from('verification_codes')
      .insert(insertData);

    if (insertError) {
      console.error('保存验证码失败:', insertError);
      throw new Error(insertError.message);
    }

    // 发送邮件/短信（模拟，实际需要接入邮件/短信服务）
    if (isEmail) {
      // 模拟发送邮件
      console.log(`[模拟邮件] 发送给 ${identifier}，验证码: ${code}`);
    } else {
      // 模拟发送短信
      console.log(`[模拟短信] 发送给 ${identifier}，验证码: ${code}`);
    }

    // 开发环境下返回验证码，方便测试
    const isDev = process.env.COZE_PROJECT_ENV === 'DEV';
    if (isDev) {
      return NextResponse.json({
        success: true,
        message: '验证码已发送（开发模式：验证码会在控制台输出）',
        devCode: code, // 仅开发环境
      });
    }

    return NextResponse.json({
      success: true,
      message: '验证码已发送',
    });
  } catch (error) {
    console.error('发送验证码错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
