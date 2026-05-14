// Probe multiple caregiver data sources for scrapeability
// Usage: npx tsx scripts/crawler/probe-sources.ts
import * as cheerio from 'cheerio';

async function fetchPage(url: string, referer?: string): Promise<{ text: string; status: number }> {
  const headers: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  };
  if (referer) headers['Referer'] = referer;

  try {
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(15000), redirect: 'follow' });
    const buf = Buffer.from(await res.arrayBuffer());
    let text = buf.toString('utf-8');
    // Detect if it's actually gb2312/gbk
    if (text.includes('�') || text.includes('锘�')) {
      try {
        text = new TextDecoder('gbk').decode(buf);
      } catch { /* keep utf-8 */ }
    }
    return { text, status: res.status };
  } catch (e) {
    return { text: '', status: 0 };
  }
}

async function probe(url: string, label: string) {
  console.log(`\n=== ${label} ===`);
  console.log(`URL: ${url}`);
  const { text, status } = await fetchPage(url);
  console.log(`Status: ${status}, Length: ${text.length}`);

  if (text.length < 500) {
    console.log('Content:', text.slice(0, 500));
    return;
  }

  const $ = cheerio.load(text);

  // Detect what kind of site this is
  const title = $('title').text().trim();
  console.log(`Title: ${title}`);

  // Look for links/listing patterns
  const links = $('a[href]');
  const listingLinks: string[] = [];
  links.each((_, el) => {
    const href = $(el).attr('href') || '';
    const text2 = $(el).text().trim();
    if (href.includes('baomu') || href.includes('yuangong') || href.includes('detail') || href.includes('info')) {
      listingLinks.push(`${text2.slice(0, 20)} -> ${href.slice(0, 80)}`);
    }
  });

  if (listingLinks.length > 0) {
    console.log(`Listing links (${listingLinks.length}):`);
    for (const l of listingLinks.slice(0, 10)) console.log(`  ${l}`);
  }

  // Look for list items
  const lis = $('li');
  const divs = $('div[class]');
  console.log(`  <li> count: ${lis.length}, <div[class]> count: ${divs.length}`);

  // Print first 500 chars of body text
  const bodyText = $('body').text().trim().slice(0, 300);
  if (bodyText) console.log(`Body: ${bodyText}...`);
}

async function main() {
  // 1. Try www.51baomu.cn (desktop) instead of mobile
  await probe('https://www.51baomu.cn/', '51baomu desktop');

  // 2. Try a known working URL pattern for 51baomu
  await probe('https://www.51baomu.cn/baomu/', '51baomu /baomu/ directory');

  // 3. Try beijingbaomu.com
  await probe('https://www.beijingbaomu.com/', 'beijingbaomu.com');

  // 4. Try beijingbaomu.com caregiver list
  await probe('https://www.beijingbaomu.com/baomu/', 'beijingbaomu /baomu/');

  // 5. Try anyangbang.com (another nursing home site)
  await probe('https://www.anyangbang.com/', 'anyangbang.com');

  // 6. Try lianlao.com for nursing homes
  await probe('https://www.lianlao.com/', 'lianlao.com');

  // 7. Try to access 51baomu with a specific caregiver profile URL
  await probe('https://www.51baomu.cn/baomu/1.html', '51baomu profile page');

  // 8. Try 家政服务平台 alternatives
  await probe('https://www.jiazheng.com/', 'jiazheng.com');

  // 9. Try 养老网 individual caregiver section
  await probe('https://www.yanglao.com.cn/hugong/', 'yanglao hugong section');

  // 10. Try 58到家 caregiver page
  await probe('https://dao.58.com/baomu/', '58到家 保姆 page');
}

main();
