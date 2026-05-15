import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { hashPassword } from '@/lib/password';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { phone, password, nickname } = await req.json();

    if (!phone || !password) {
      return NextResponse.json({ error: '手机号和密码不能为空' }, { status: 400 });
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: '手机号格式不正确' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: '密码至少6位' }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { phone } });
    if (existing) {
      return NextResponse.json({ error: '该手机号已注册' }, { status: 409 });
    }

    const passwordHash = hashPassword(password);
    const user = await db.user.create({
      data: {
        phone,
        passwordHash,
        nickname: nickname || `用户${Date.now().toString(36).slice(-6)}`,
      },
    });

    const token = signToken(user.id);
    const response = NextResponse.json({ success: true, userId: user.id });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (e) {
    console.error('Register error:', e instanceof Error ? e.message : String(e));
    return NextResponse.json({ error: `注册失败: ${e instanceof Error ? e.message : '未知错误'}` }, { status: 500 });
  }
}
