// Deep probe beijingbaomu.com caregiver listing structure
// Usage: npx tsx scripts/crawler/probe-beijingbaomu.ts
import * as cheerio from 'cheerio';

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9',
    },
    signal: AbortSignal.timeout(15000),
  });
  const buf = Buffer.from(await res.arrayBuffer());
  return buf.toString('utf-8');
}

async function main() {
  // Check the baomuku listing page
  console.log('=== /baomuku/ listing page ===');
  const html = await fetchPage('https://www.beijingbaomu.com/baomuku/');
  const $ = cheerio.load(html);
  console.log(`Title: ${$('title').text().trim()}`);
  console.log(`Length: ${html.length} chars`);

  // Find the main content area
  // Look for table rows, list items, or card divs
  const tables = $('table');
  console.log(`Tables: ${tables.length}`);

  // Check for common listing patterns
  const trs = $('tr');
  console.log(`<tr> count: ${trs.length}`);

  // Print a sample of the listing to understand structure
  const bodyText = $('body').text().trim();
  console.log(`\nBody text (first 500): ${bodyText.slice(0, 500)}`);

  // Find pagination
  const pageLinks = $('a[href*="page"], a[href*="baomuku"]');
  console.log(`\nPage/listing links:`);
  pageLinks.each((_, a) => {
    const href = $(a).attr('href') || '';
    const text = $(a).text().trim();
    if (text && href) console.log(`  ${text} -> ${href}`);
  });

  // Print HTML around the listing area
  const mainContent = $('.main, .content, .list, .baomuku, #main, #content');
  if (mainContent.length > 0) {
    console.log(`\n--- Main content HTML (first 2000 chars) ---`);
    console.log(mainContent.first().html()?.slice(0, 2000));
  } else {
    // Try to find the listing by looking for repeated patterns
    const html2 = $.html();
    // Find where baomu names appear
    const nameIdx = html2.indexOf('阿姨');
    if (nameIdx > 0) {
      console.log(`\n--- HTML around first '阿姨' mention ---`);
      console.log(html2.slice(Math.max(0, nameIdx - 300), nameIdx + 500));
    }
  }

  // Also check if there's a detail page for a specific caregiver
  console.log(`\n\n=== Detail page probe ===`);
  // Try a common URL pattern
  const detailUrl = $('a[href*="baomu"]').first().attr('href');
  if (detailUrl) {
    console.log(`First caregiver link: ${detailUrl}`);
    try {
      const detailHtml = await fetchPage(detailUrl.startsWith('http') ? detailUrl : `https://www.beijingbaomu.com${detailUrl}`);
      const d$ = cheerio.load(detailHtml);
      console.log(`Detail title: ${d$('title').text().trim()}`);
      // Print key fields
      const detailText = d$('body').text().trim().slice(0, 800);
      console.log(`Detail text: ${detailText}`);
    } catch (e) {
      console.error(`Detail fetch error: ${(e as Error).message}`);
    }
  }
}

main();
