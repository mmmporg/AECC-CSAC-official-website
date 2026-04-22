import { test, expect } from '@playwright/test';

test.describe('Announcements Page', () => {
  test('should load announcements and expose public filters', async ({ page }) => {
    await page.goto('/fr/annonces');

    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('select[name="category"]')).toBeVisible();
    await expect(page.locator('input[name="city"]')).toBeVisible();
    await expect(page.locator('input[name="date"]')).toBeVisible();
  });
});
