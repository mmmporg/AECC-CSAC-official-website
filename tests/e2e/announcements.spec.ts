import { test, expect } from '@playwright/test';

test.describe('Announcements Page', () => {
  test('should load announcements and have filters', async ({ page }) => {
    await page.goto('/fr/annonces');

    // Vérifier la présence du titre
    await expect(page.locator('h1').first()).toBeVisible();

    // Vérifier la présence des filtres
    // Ex. "Toutes les villes", "Toutes les catégories" etc.
    // Ou au moins que la barre de filtrage est présente
    const selectCity = page.locator('select').first();
    await expect(selectCity).toBeVisible();

    // S'il y a des annonces affichées, s'assurer que c'est bien la liste 
    // Sinon, au minimum vérifier l'UI
  });
});
