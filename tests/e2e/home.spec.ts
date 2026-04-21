import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display home page in French by default', async ({ page }) => {
    // Naviguer vers la racine (qui devrait rediriger vers /fr)
    await page.goto('/');
    
    // Attendre la redirection du middleware
    await page.waitForURL(/\/fr/);

    // Vérifier la présence d'éléments spécifiques au Français (ex. texte "Rejoindre")
    await expect(page.locator('text=/Rejoindre/i').first()).toBeVisible();
    await expect(page.locator('text=/Association des/i').first()).toBeVisible();
  });

  test('should switch to English when clicking language switcher', async ({ page }) => {
    await page.goto('/fr');
    
    // Trouver le selecteur de langue et cliquer sur "EN"
    // Supposons que le language switcher a la valeur 'en'
    const langSelect = page.locator('select[name="language-switcher"]');
    if (await langSelect.count() > 0) {
      await langSelect.selectOption('en');
    } else {
      // Si c'est un bouton "EN"
      const enBtn = page.locator('button', { hasText: 'EN' }).first();
      if (await enBtn.count() > 0) {
        await enBtn.click();
      }
    }

    // Attendre la redirection vers /en
    await page.waitForURL(/\/en/);

    // Verifier le texte en anglais
    await expect(page.locator('text=/Join/i').first()).toBeVisible();
    await expect(page.locator('text=/Cameroonian/i').first()).toBeVisible();
  });
});
