import { test, expect } from '@playwright/test';

test.describe('Opportunities Page', () => {
  test('should load opportunities and expose the new filters', async ({ page }) => {
    await page.goto('/fr/opportunites');

    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('select[name="category"]')).toBeVisible();
    await expect(page.locator('input[name="domain"]')).toBeVisible();
    await expect(page.locator('input[name="deadline"]')).toBeVisible();
  });
});
