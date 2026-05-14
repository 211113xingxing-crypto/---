import { test, expect } from '@playwright/test';

test.describe('Admin', () => {
  test('should show login page for unauthenticated users', async ({ page }) => {
    await page.goto('/admin');
    // Should redirect to login or show login form
    const loginText = page.getByText('登录');
    await expect(loginText.first()).toBeVisible({ timeout: 5000 });
  });

  test('should render login form with required fields', async ({ page }) => {
    await page.goto('/admin/login');
    // Should have username and password inputs
    const usernameInput = page.getByLabel('用户名');
    const passwordInput = page.getByLabel('密码');
    await expect(usernameInput).toBeVisible({ timeout: 5000 });
    await expect(passwordInput).toBeVisible();

    // Should have submit button
    const submitBtn = page.getByRole('button', { name: /登录/ });
    await expect(submitBtn).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByLabel('用户名').fill('wrong-user');
    await page.getByLabel('密码').fill('wrong-password');
    await page.getByRole('button', { name: /登录/ }).click();

    // Should show error message
    const errorEl = page.locator('.text-red-500, [role="alert"]').first();
    await expect(errorEl).toBeVisible({ timeout: 5000 });
  });

  test('login page should not have indexed meta', async ({ page }) => {
    await page.goto('/admin/login');
    const robotsMeta = page.locator('meta[name="robots"]');
    const content = await robotsMeta.getAttribute('content');
    expect(content).toBe('noindex');
  });
});
