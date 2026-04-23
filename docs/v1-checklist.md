# Checklist V1 AECC

## 1. Donnees PRD
- [ ] Completer le seed SQL des 19 presidents successifs
- [x] Verifier que le seed SQL contient bien les 5 evenements de frise
- [x] Verifier que le seed SQL contient bien les 17 fondateurs
- [ ] Verifier que l'ordre d'affichage des presidents correspond au PRD

Notes:
- `supabase/migrations/001_initial_schema.sql` contient bien 5 evenements et 17 fondateurs.
- La base Supabase actuelle ne contient que 2 presidents (`Issa Rouhaya`, `Solange Meying`).
- Le point presidents est volontairement laisse hors cloture V1 tant que la liste exacte des 19 n'est pas fournie ou retrouvee depuis une source fiable.

## 2. Critères d'acceptation fonctionnels
- [x] `next build` passe sans erreur
- [x] Les routes publiques principales repondent en production
- [x] Les routes admin protegees redirigent vers `/admin/login`
- [x] Les filtres publics annonces sont exposes (`city`, `category`, `date`)
- [x] Les filtres publics opportunites sont exposes (`domain`, `category`, `deadline`)
- [x] Verifier le fallback FR si EN est absent sur les fiches annonces et opportunites
- [x] Verifier la coherence du rendu rich text public sur les fiches annonces et opportunites
- [x] Valider le scenario metier creation annonce -> visibilite publique
- [x] Valider le scenario metier archivage annonce -> disparition publique dans la liste publique
- [x] Valider un scenario CRUD opportunite complet au niveau donnees + rendu public
- [ ] Valider le scenario logout -> redirection `/admin/login`

## 3. Mobile et performance
- [ ] Passer une QA explicite sur viewport iPhone SE
- [ ] Lancer Lighthouse mobile sur accueil
- [ ] Lancer Lighthouse mobile sur annonces
- [ ] Lancer Lighthouse mobile sur opportunites
- [ ] Corriger les regressions majeures si score ou FCP ne tiennent pas la cible PRD

## 4. Nettoyage final
- [x] Remplacer les tests Playwright instables par un smoke runner robuste
- [x] Verifier `npm run test:e2e` via smoke tests
- [ ] Nettoyer les derniers textes ou contenus encore mal encodes hors zones deja corrigees
- [ ] Faire une passe finale de validation V1 ligne par ligne contre le PRD

## Commandes de validation
- Build: `npm run build`
- Smoke tests release: `npm run test:e2e`
