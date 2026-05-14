import crypto from 'crypto';

function getTokenSecret(): string {
  const secret = process.env.TOKEN_SECRET;
  if (!secret) throw new Error('Missing required environment variable: TOKEN_SECRET');
  return secret;
}

let _secret: string | null = null;
function secret() {
  if (!_secret) _secret = getTokenSecret();
  return _secret;
}

export function signToken(userId: number): string {
  const payload = `${userId}:${Date.now()}`;
  const sig = crypto.createHmac('sha256', secret()).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64url');
}

export function verifyToken(token: string): number | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return null;
    const [userIdStr, timestamp, sig] = parts;
    const expected = crypto
      .createHmac('sha256', secret())
      .update(`${userIdStr}:${timestamp}`)
      .digest('hex');
    if (sig !== expected) return null;
    return parseInt(userIdStr, 10);
  } catch {
    return null;
  }
}
