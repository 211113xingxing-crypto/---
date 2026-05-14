// Try to bypass beijingbaomu.com verification wall
// Usage: npx tsx scripts/crawler/probe-bypass.ts
import * as cheerio from 'cheerio';

async function main() {
  // Step 1: Get the verification page and extract form fields
  const res1 = await fetch('https://www.beijingbaomu.com/baomuku/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9',
    },
  });
  const cookies = res1.headers.getSetCookie?.() ?? res1.headers.get('set-cookie') ?? '';
  console.log('Cookies from first request:', cookies);

  const html = await res1.text();
  const $ = cheerio.load(html);

  // Extract form fields
  const formAction = $('form').attr('action') || '';
  const codeHint = $('font[color="red"]').text().trim();
  console.log(`Form action: ${formAction}`);
  console.log(`Verification code hint: "${codeHint}"`);

  // Get all hidden inputs
  const formData = new URLSearchParams();
  $('input[type="hidden"]').each((_, el) => {
    const name = $(el).attr('name');
    const value = $(el).attr('value');
    if (name) formData.append(name, value ?? '');
  });
  // Add the verification code
  formData.append('checkcode', codeHint || '找保姆就到北京保姆网');
  console.log(`Form data: ${formData.toString()}`);

  // Step 2: Submit the form
  const actionUrl = formAction.startsWith('http')
    ? formAction
    : `https://www.beijingbaomu.com${formAction || '/baomuku/'}`;

  const cookieHeader = Array.isArray(cookies) ? cookies.join('; ') : cookies;

  const res2 = await fetch(actionUrl, {
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookieHeader,
    },
    body: formData.toString(),
    redirect: 'manual',
  });

  console.log(`\nSubmit status: ${res2.status}`);
  const newCookies = res2.headers.getSetCookie?.() ?? res2.headers.get('set-cookie') ?? '';
  console.log(`New cookies: ${newCookies}`);

  const resultHtml = await res2.text();
  console.log(`Result length: ${resultHtml.length}`);
  console.log(`Result title: ${cheerio.load(resultHtml)('title').text().trim()}`);

  if (resultHtml.includes('验证')) {
    console.log('Still showing verification page - bypass failed');
  } else {
    console.log('SUCCESS - passed verification!');
    // Print first 1000 chars of actual content
    console.log('\n--- Content preview ---');
    const bodyText = cheerio.load(resultHtml)('body').text().trim().slice(0, 800);
    console.log(bodyText);
  }
}

main();
