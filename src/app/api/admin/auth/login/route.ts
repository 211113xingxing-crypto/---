import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;
    if (!adminUser || !adminPass) {
      return NextResponse.json({ error: '管理员账户未配置' }, { status: 500 });
    }

    if (username !== adminUser || password !== adminPass) {
      return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
    }

    const token = signToken(0); // admin userId = 0
    const response = NextResponse.json({ success: true });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch {
    return NextResponse.json({ error: '请求无效' }, { status: 400 });
  }
}
