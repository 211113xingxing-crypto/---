import { test, expect } from '@playwright/test';

test.describe('City and district navigation', () => {
  test('should render city page with district links', async ({ page }) => {
    await page.goto('/shanghai');
    await expect(page).toHaveTitle(/上海/);

    // Should have breadcrumbs
    const breadcrumb = page.locator('nav[aria-label="面包屑"], nav[aria-label="Breadcrumb"], .breadcrumbs');
    await expect(breadcrumb.first()).toBeVisible({ timeout: 5000 });

    // Should have district links or service type links
    const links = page.locator('a[href^="/shanghai/"]');
    await expect(links.first()).toBeVisible({ timeout: 5000 });
  });

  test('should render district page with providers', async ({ page }) => {
    await page.goto('/shanghai/pudong');
    await expect(page).toHaveTitle(/上海|浦东/);

    // District page should show providers or an empty state
    const content = page.locator('main, [role="main"]');
    await expect(content.first()).toBeVisible({ timeout: 5000 });
  });

  test('should render service type page', async ({ page }) => {
    await page.goto('/shanghai/jujia-huli');
    await expect(page).toHaveTitle(/居家护理|上海/);

    const content = page.locator('main, [role="main"]');
    await expect(content.first()).toBeVisible({ timeout: 5000 });
  });

  test('should render subSlug page (district + service type)', async ({ page }) => {
    await page.goto('/shanghai/pudong/jujia-huli');
    await expect(page).toHaveTitle(/居家护理|上海|浦东/);

    // Should have FAQ schema
    const schemas = page.locator('script[type="application/ld+json"]');
    const count = await schemas.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('should have breadcrumb navigation on all pages', async ({ page }) => {
    const pages = ['/guide/zhaohugong', '/guide/jiage', '/guide/xuanze', '/help'];
    for (const url of pages) {
      await page.goto(url);
      await expect(page.locator('nav[aria-label="面包屑"], .breadcrumbs, a[href="/"]').first()).toBeVisible({ timeout: 5000 });
    }
  });
});
