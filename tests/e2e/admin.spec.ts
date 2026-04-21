import { test, expect } from '@playwright/test';

test.describe('Admin Protected Routes', () => {
  test('should redirect unauthenticated users from /admin/dashboard to /admin/login', async ({ page }) => {
    await page.goto('/admin/dashboard');

    // Mettre une regex qui vérifie que l'URL locale comprend /admin/login
    await page.waitForURL(/\/admin\/login/);

    // Vérifier la présence d'un champ de connexion
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });
});
