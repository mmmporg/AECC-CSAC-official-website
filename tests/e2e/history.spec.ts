import { test, expect } from '@playwright/test';

test.describe('History Page', () => {
  test('should display timeline events and founders', async ({ page }) => {
    await page.goto('/fr/histoire');

    // Vérifier la présence de la section Timeline
    // Au minimum un des événements fondateurs : "1997"
    await expect(page.locator('text=/1997/i').first()).toBeVisible();
    await expect(page.locator('text=/1999/i').first()).toBeVisible();

    // Vérifier la présence des fondateurs (ex: Issa Rouhaya)
    await expect(page.locator('text=/Issa Rouhaya/i').first()).toBeVisible();
    
    // Il doit y avoir un titre liés à l'histoire
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
