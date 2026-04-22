import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should redirect root to a localized home page', async ({ page }) => {
    await page.goto('/');

    await page.waitForURL(/\/(fr|en)$/);

    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('nav').first()).toBeVisible();
  });

  test('should switch to English when clicking language switcher', async ({ page }) => {
    await page.goto('/fr');

    await page.getByRole('link', { name: 'en' }).click();
    await page.waitForURL(/\/en/);

    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('text=/Cameroonian/i').first()).toBeVisible();
  });
});
