import { test, expect } from '@playwright/test';

test.describe('History Page', () => {
  test('should display timeline events and founders', async ({ page }) => {
    await page.goto('/fr/histoire');

    await expect(page.locator('text=/1997/i').first()).toBeVisible();
    await expect(page.locator('text=/Issa Rouhaya/i').first()).toBeVisible();
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
