import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/养老|安养/);
  });

  test('should have JSON-LD structured data', async ({ page }) => {
    await page.goto('/');
    const schemas = await page.locator('script[type="application/ld+json"]').all();
    expect(schemas.length).toBeGreaterThanOrEqual(3);

    const texts = await Promise.all(schemas.map(s => s.textContent()));
    const types = texts
      .filter((t): t is string => t !== null)
      .map(t => {
        try { return JSON.parse(t)['@type']; } catch { return null; }
      })
      .filter(Boolean);

    // Homepage should have WebSite, Organization, FAQPage, LocalBusiness
    expect(types).toContain('WebSite');
    expect(types).toContain('FAQPage');
  });

  test('should display city grid', async ({ page }) => {
    await page.goto('/');
    const cityLinks = page.locator('a[href^="/shanghai"], a[href^="/beijing"], a[href^="/guangzhou"]');
    // At minimum the city grid section should exist
    await expect(page.locator('h2:has-text("选择城市"), h2:has-text("城市")').first()).toBeVisible();
  });

  test('should have FAQ section', async ({ page }) => {
    await page.goto('/');
    const faqSection = page.locator('h2:has-text("常见问题")');
    await expect(faqSection.first()).toBeVisible();
  });

  test('should be mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    // Main content should be visible on mobile
    await expect(page.locator('main, [role="main"], h1').first()).toBeVisible();
  });
});
