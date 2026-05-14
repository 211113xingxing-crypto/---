// Rate-limited HTTP fetcher with retry and backoff
import * as https from 'node:https';
import * as http from 'node:http';
import { config } from '../config';

let lastRequestTime = 0;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function get(
  url: string,
  redirectCount = 0,
  signal?: AbortSignal
): Promise<{ status: number; text: string }> {
  const maxRedirects = 5;
  const parsed = new URL(url);

  return new Promise((resolve, reject) => {
    const transport = parsed.protocol === 'https:' ? https : http;
    const req = transport.get(
      url,
      {
        headers: { 'User-Agent': config.userAgent },
        rejectUnauthorized: false,
        timeout: 15000,
        signal,
      },
      (res) => {
        // Follow redirects
        if ([301, 302, 307, 308].includes(res.statusCode ?? 0) && redirectCount < maxRedirects) {
          const location = res.headers.location;
          if (location) {
            const nextUrl = new URL(location, url).href;
            get(nextUrl, redirectCount + 1, signal).then(resolve, reject);
            return;
          }
        }

        const chunks: Buffer[] = [];
        res.on('data', (c: Buffer) => chunks.push(c));
        res.on('end', () => {
          resolve({
            status: res.statusCode ?? 0,
            text: Buffer.concat(chunks).toString('utf-8'),
          });
        });
      }
    );
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.on('error', reject);
  });
}

export async function fetchPage(url: string, retries = config.maxRetries): Promise<string> {
  // Enforce rate limit
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < config.requestDelayMs) {
    await delay(config.requestDelayMs - elapsed);
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      lastRequestTime = Date.now();
      const ac = new AbortController();
      const timer = setTimeout(() => ac.abort(), 15000);
      const res = await get(url, 0, ac.signal);
      clearTimeout(timer);

      if (res.status === 429) {
        const wait = Math.pow(2, attempt + 1) * 1000;
        console.warn(`  429 on ${url}, waiting ${wait / 1000}s`);
        await delay(wait);
        continue;
      }

      if (res.status >= 400) {
        if (attempt < retries) {
          await delay(Math.pow(2, attempt) * 1000);
          continue;
        }
        console.error(`  HTTP ${res.status} on ${url}`);
        return '';
      }

      return res.text;
    } catch (e) {
      if (attempt < retries) {
        await delay(Math.pow(2, attempt) * 1000);
        continue;
      }
      console.error(`  Fetch failed: ${url} — ${(e as Error).message}`);
      return '';
    }
  }

  return '';
}
