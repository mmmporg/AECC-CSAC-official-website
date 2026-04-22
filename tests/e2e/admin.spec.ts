import { test, expect } from '@playwright/test';

test.describe('Admin Protected Routes', () => {
  test('should redirect unauthenticated users from /admin/dashboard to /admin/login', async ({ page }) => {
    await page.goto('/admin/dashboard');

    await page.waitForURL(/\/admin\/login/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should also protect /admin/unauthorized when unauthenticated', async ({ page }) => {
    await page.goto('/admin/unauthorized');

    await page.waitForURL(/\/admin\/login/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should protect /admin/comptes when unauthenticated', async ({ page }) => {
    await page.goto('/admin/comptes');

    await page.waitForURL(/\/admin\/login/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});
