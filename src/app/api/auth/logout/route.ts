import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// 登出
export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('session_token');

    return NextResponse.json({
      success: true,
      message: '已退出登录',
    });
  } catch (error) {
    console.error('登出错误:', error);
    return NextResponse.json(
      { error: '登出失败' },
      { status: 500 }
    );
  }
}
