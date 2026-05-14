// Use Playwright to probe caregiver sites that block simple HTTP requests
// Usage: npx tsx scripts/crawler/probe-playwright.ts
import { chromium } from 'playwright';

async function probe51baomu(page: any) {
  console.log('\n=== m.51baomu.cn (Playwright) ===');

  // First try the mobile homepage
  try {
    await page.goto('https://m.51baomu.cn/', { waitUntil: 'networkidle', timeout: 30000 });
    const title = await page.title();
    console.log(`Title: ${title}`);
    const text = await page.textContent('body');
    console.log(`Body text (first 500): ${text?.slice(0, 500)}`);

    // Screenshot for debugging
    await page.screenshot({ path: 'scripts/crawler/probe-51baomu-home.png' });
    console.log('Saved screenshot');

    // Try to find caregiver listing links
    const links = await page.evaluate(() => {
      const as = document.querySelectorAll('a[href]');
      return Array.from(as).slice(0, 20).map(a => ({
        text: a.textContent?.trim()?.slice(0, 30) || '',
        href: (a as HTMLAnchorElement).href?.slice(0, 80) || '',
      }));
    });
    console.log('Links:', JSON.stringify(links, null, 2));
  } catch (e) {
    console.error(`Error: ${(e as Error).message}`);
  }
}

async function probe58jiazheng(page: any) {
  console.log('\n=== 58到家 (Playwright) ===');
  try {
    await page.goto('https://jiazheng.58.com/baomu/', { waitUntil: 'networkidle', timeout: 30000 });
    const title = await page.title();
    console.log(`Title: ${title}`);
    const text = await page.textContent('body');
    console.log(`Body text (first 500): ${text?.slice(0, 500)}`);
    await page.screenshot({ path: 'scripts/crawler/probe-58jiazheng.png' });
    console.log('Saved screenshot');
  } catch (e) {
    console.error(`Error: ${(e as Error).message}`);
  }
}

async function probeBeijinBaomu(page: any) {
  console.log('\n=== beijingbaomu.com (Playwright) ===');
  try {
    await page.goto('https://www.beijingbaomu.com/baomuku/', { waitUntil: 'networkidle', timeout: 30000 });
    const title = await page.title();
    console.log(`Title: ${title}`);
    // Check if verification is still needed
    const hasVerify = await page.evaluate(() => document.body.textContent?.includes('验证'));
    console.log(`Has verification: ${hasVerify}`);

    if (hasVerify) {
      // Try to fill in the verification code
      const codeHint = await page.evaluate(() => {
        const font = document.querySelector('font[color="red"]');
        return font?.textContent?.trim() || '';
      });
      console.log(`Code hint: "${codeHint}"`);

      if (codeHint) {
        // Fill the form
        await page.fill('input[name="checkcode"]', codeHint);
        await page.click('input[type="submit"], button[type="submit"]');
        await page.waitForTimeout(3000);

        const newTitle = await page.title();
        console.log(`After submit title: ${newTitle}`);
        const newText = await page.textContent('body');
        console.log(`After submit body (first 500): ${newText?.slice(0, 500)}`);
      }
    }

    await page.screenshot({ path: 'scripts/crawler/probe-bjbaomu.png' });
    console.log('Saved screenshot');
  } catch (e) {
    console.error(`Error: ${(e as Error).message}`);
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      viewport: { width: 390, height: 844 },
      locale: 'zh-CN',
    });

    const page = await context.newPage();

    await probe51baomu(page);
    // await probe58jiazheng(page);
    // await probeBeijinBaomu(page);
  } finally {
    await browser.close();
  }
}

main();
