// Probe m.51baomu.cn to understand URL structure and HTML parsing
// Usage: npx tsx scripts/crawler/probe-51baomu.ts

async function fetchWithEncoding(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'zh-CN,zh;q=0.9',
    },
    signal: AbortSignal.timeout(15000),
  });
  const buf = Buffer.from(await res.arrayBuffer());
  // Try gb2312 first, fall back to utf-8
  try {
    const iconv = await import('iconv-lite');
    return iconv.default.decode(buf, 'gb2312');
  } catch {
    // Try TextDecoder
    try {
      return new TextDecoder('gb2312').decode(buf);
    } catch {
      return new TextDecoder('utf-8').decode(buf);
    }
  }
}

async function main() {
  // Test options to figure out the URL pattern
  // From the format: baomu1-{type}-{subtype}-{ability}-{city}-{exp}-{edu}-{age}-{sort}-{page}-{mode}-{other}.html
  const tests = [
    { label: 'All caregivers page1', url: 'https://m.51baomu.cn/baomu1-6-0-0-0-0-0-0-0-1-0-0.html' },
    { label: 'All caregivers page2', url: 'https://m.51baomu.cn/baomu1-6-0-0-0-0-0-0-0-2-0-0.html' },
    // Try numeric city codes
    { label: 'Shanghai (numeric?)', url: 'https://m.51baomu.cn/baomu1-6-0-0-021-0-0-0-0-1-0-0.html' },
    { label: 'Beijing (numeric?)', url: 'https://m.51baomu.cn/baomu1-6-0-0-010-0-0-0-0-1-0-0.html' },
    // Homepage to find city list
    { label: 'Mobile homepage', url: 'https://m.51baomu.cn/' },
  ];

  for (const t of tests) {
    console.log(`\n=== [${t.label}] ${t.url} ===`);
    try {
      const html = await fetchWithEncoding(t.url);
      console.log(`Length: ${html.length} chars`);

      // Look for city selector / filter area
      const cityMatch = html.match(/city[=:"]/gi);
      if (cityMatch) console.log('  Has city references');

      // Look for caregiver cards - try different patterns
      const cardPatterns = [
        /<li[^>]*baomu[^>]*>/gi,
        /<div[^>]*card[^>]*>/gi,
        /<div[^>]*item[^>]*>/gi,
        /<a[^>]*href[^>]*baomu1-/gi,
        /<a[^>]*href="\/baomu/gi,
      ];
      for (const pat of cardPatterns) {
        const matches = html.match(pat);
        if (matches) console.log(`  Pattern ${pat.source.slice(0, 40)}...: ${matches.length} matches`);
      }

      // Print first 1000 chars
      console.log('\n--- First 1000 chars ---');
      console.log(html.slice(0, 1000));
      console.log('--- end ---');
    } catch (e) {
      console.error(`Error: ${(e as Error).message}`);
    }
  }
}

main();
