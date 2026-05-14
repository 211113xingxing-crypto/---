// Probe 58同城 家政板块 for caregiver listings
// Usage: npx tsx scripts/crawler/probe-58jiazheng.ts
import * as cheerio from 'cheerio';

async function fetchText(url: string, referer?: string): Promise<string> {
  const headers: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9',
  };
  if (referer) headers['Referer'] = referer;
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
  return await res.text();
}

async function main() {
  const tests = [
    // 58到家 家政服务 - try various city subdomains
    { url: 'https://jiazheng.58.com/', label: '58家政 homepage' },
    { url: 'https://jiazheng.58.com/baomu/', label: '58家政 baomu' },
    { url: 'https://jiazheng.58.com/yuesao/', label: '58家政 yuesao' },
    // Try city-specific jiazheng pages
    { url: 'https://sh.58.com/baomu/', label: 'Shanghai 58 baomu' },
    { url: 'https://bj.58.com/baomu/', label: 'Beijing 58 baomu' },
    // Try m.58.com (mobile)
    { url: 'https://m.58.com/bj/baomu/', label: '58 mobile Beijing baomu' },
    // Try daojia.com (天鹅到家)
    { url: 'https://www.daojia.com/', label: 'daojia.com' },
    // Try daojia.com beijing baomu
    { url: 'https://www.daojia.com/beijing/baomu/', label: 'daojia beijing baomu' },
    // Try other caregiver platforms
    { url: 'https://www.ayibang.com/', label: 'ayibang.com' },
    { url: 'https://www.jiazheng114.com/', label: 'jiazheng114.com' },
    // Try regional caregiver sites
    { url: 'https://www.shanghaibaomu.com/', label: 'shanghaibaomu.com' },
    { url: 'https://www.guangzhoubaomu.com/', label: 'guangzhoubaomu.com' },
    { url: 'https://www.chengdubaomu.com/', label: 'chengdubaomu.com' },
  ];

  for (const t of tests) {
    try {
      const html = await fetchText(t.url);
      const $ = cheerio.load(html);
      const title = $('title').text().trim();
      const bodyLen = html.length;
      // Check if it seems like a real listing page
      const hasListings = html.includes('阿姨') || html.includes('保姆') || html.includes('护工');
      const isBlocked = html.includes('验证') || html.includes('403') || html.includes('Forbidden');
      const status = isBlocked ? 'BLOCKED' : hasListings ? 'HAS CONTENT' : 'LOADED';
      console.log(`[${status}] ${t.label}: ${title.slice(0, 60)} (${bodyLen} chars)`);
      if (hasListings && !isBlocked) {
        // Print a snippet
        const idx = html.indexOf('阿姨');
        if (idx > 0) console.log(`  Snippet: ...${html.slice(Math.max(0, idx - 50), idx + 100).replace(/\s+/g, ' ')}...`);
      }
    } catch (e) {
      console.log(`[ERROR] ${t.label}: ${(e as Error).message}`);
    }
  }
}

main();
