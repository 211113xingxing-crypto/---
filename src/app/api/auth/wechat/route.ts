import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { signToken } from '@/lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const wechatAppId = process.env.WECHAT_APPID || '';
const wechatSecret = process.env.WECHAT_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Missing code' }, { status: 400 });
    }

    if (!wechatAppId || !wechatSecret) {
      return NextResponse.json({ error: 'WeChat not configured' }, { status: 500 });
    }

    // Exchange code for openid via WeChat API
    const wxRes = await fetch(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${wechatAppId}&secret=${wechatSecret}&js_code=${code}&grant_type=authorization_code`
    );
    const wxData = await wxRes.json();

    if (wxData.errcode) {
      return NextResponse.json({ error: `WeChat error: ${wxData.errmsg}` }, { status: 400 });
    }

    const { openid } = wxData;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find existing user by openid
    const { data: existing } = await supabase
      .from('user')
      .select('id, nickname, avatar_url')
      .eq('openid', openid)
      .single();

    let userId: number;
    let nickname: string | null = null;
    let avatarUrl: string | null = null;

    if (existing) {
      userId = existing.id;
      nickname = existing.nickname;
      avatarUrl = existing.avatar_url;
    } else {
      // Create new user
      const { data: created } = await supabase
        .from('user')
        .insert({
          openid,
          nickname: `用户${Date.now().toString(36).slice(-6)}`,
          registered_at: new Date().toISOString(),
        })
        .select('id, nickname, avatar_url')
        .single();

      if (!created) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
      }
      userId = created.id;
      nickname = created.nickname;
      avatarUrl = created.avatar_url;
    }

    const token = signToken(userId);

    return NextResponse.json({
      token,
      user: {
        id: userId,
        nickname,
        avatarUrl,
      },
    });
  } catch (e) {
    console.error('WeChat auth error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
