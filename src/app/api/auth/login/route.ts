import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { verifyPassword } from '@/lib/password';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json({ error: '手机号和密码不能为空' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { phone } });
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: '手机号未注册' }, { status: 401 });
    }

    if (!verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: '密码错误' }, { status: 401 });
    }

    const token = signToken(user.id);
    const response = NextResponse.json({
      success: true,
      userId: user.id,
      nickname: user.nickname,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch {
    return NextResponse.json({ error: '登录失败，请稍后重试' }, { status: 500 });
  }
}
