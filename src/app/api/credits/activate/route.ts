import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 激活卡密
export async function POST(request: NextRequest) {
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

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: '请输入卡密' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    // 查找卡密
    const { data: activationCode, error: findError } = await client
      .from('activation_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .maybeSingle();

    if (findError) {
      throw new Error(findError.message);
    }

    if (!activationCode) {
      return NextResponse.json(
        { error: '卡密不存在' },
        { status: 404 }
      );
    }

    // 检查是否已使用
    if (activationCode.is_used) {
      return NextResponse.json(
        { error: '该卡密已被使用' },
        { status: 400 }
      );
    }

    // 检查是否过期
    if (activationCode.expires_at && new Date(activationCode.expires_at) < new Date()) {
      return NextResponse.json(
        { error: '该卡密已过期' },
        { status: 400 }
      );
    }

    // 获取用户当前积分
    const { data: user, error: userError } = await client
      .from('users')
      .select('credits')
      .eq('id', userId)
      .maybeSingle();

    if (userError) {
      throw new Error(userError.message);
    }

    const newCredits = (user?.credits || 0) + (activationCode.points || 0);

    // 事务：更新用户积分 + 标记卡密已使用
    // 先更新用户积分
    const { error: updateUserError } = await client
      .from('users')
      .update({ credits: newCredits })
      .eq('id', userId);

    if (updateUserError) {
      throw new Error(updateUserError.message);
    }

    // 标记卡密已使用
    const { error: updateCodeError } = await client
      .from('activation_codes')
      .update({
        is_used: true,
        used_by: userId,
        used_at: new Date().toISOString(),
      })
      .eq('id', activationCode.id);

    if (updateCodeError) {
      throw new Error(updateCodeError.message);
    }

    // 添加积分记录
    const { error: recordError } = await client
      .from('credit_transactions')
      .insert({
        user_id: userId,
        type: 'activation',
        amount: activationCode.points || 0,
        balance_before: user?.credits || 0,
        balance_after: newCredits,
        source: 'activation_code',
        related_id: activationCode.id,
        description: `激活卡密: ${code}`,
      });

    if (recordError) {
      console.error('添加积分记录失败:', recordError);
    }

    return NextResponse.json({
      success: true,
      message: '卡密激活成功',
      credits: newCredits,
      addedPoints: activationCode.points || 0,
    });
  } catch (error) {
    console.error('激活卡密错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '激活失败' },
      { status: 500 }
    );
  }
}
