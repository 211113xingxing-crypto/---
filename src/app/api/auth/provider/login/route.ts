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

    const account = await db.providerAccount.findUnique({
      where: { phone },
      include: { provider: true },
    });

    if (!account) {
      return NextResponse.json({ error: '该手机号未注册' }, { status: 401 });
    }

    if (!verifyPassword(password, account.passwordHash)) {
      return NextResponse.json({ error: '密码错误' }, { status: 401 });
    }

    if (account.provider.status === 'suspended') {
      return NextResponse.json({ error: '账户已被停用，请联系客服' }, { status: 403 });
    }

    // Update last login
    await db.providerAccount.update({
      where: { id: account.id },
      data: { lastLoginAt: new Date() },
    });

    // Negative userId convention for provider tokens
    const token = signToken(-account.id);
    const response = NextResponse.json({
      success: true,
      providerId: account.providerId,
      providerName: account.provider.name,
      status: account.provider.status,
    });

    response.cookies.set('provider_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch {
    return NextResponse.json({ error: '登录失败，请稍后重试' }, { status: 500 });
  }
}
