# AECC Website

Site officiel de l'AECC (Association des Etudiants Camerounais en Chine), construit avec Next.js 14, TypeScript strict, Supabase, Tailwind CSS et `next-intl`.

## Stack

- Next.js 14 App Router
- TypeScript strict
- Tailwind CSS v3
- Supabase (Postgres, Auth, RLS, Storage)
- next-intl
- Playwright pour les tests e2e

## Prerequis

- Node.js 20+
- npm 10+
- Un projet Supabase configure

## Installation locale

1. Installer les dependances :

```bash
npm install
```

2. Creer `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Demarrer le projet :

```bash
npm run dev
```

## Base de donnees Supabase

Les migrations versionnees sont dans [supabase/migrations](/C:/Users/YOGA/Downloads/AECC/repo/supabase/migrations).

Pour appliquer les migrations sur le projet lie :

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

Migrations actuellement presentes :

- `001_initial_schema.sql`
- `002_v2_annuaire_galerie.sql`
- `003_v2_galerie_images.sql`
- `004_v2_galerie_storage_bucket.sql`
- `006_history_images.sql`

## Scripts utiles

```bash
npm run dev
npm run build
npm run lint
npm run test:e2e
npm run test:ui
```

## Fonctionnalites couvertes

- pages publiques FR / EN
- annonces publiques + details + soumission publique
- opportunites publiques + details
- histoire / fondateurs / presidents
- annuaire public + demande d'inscription
- galerie publique
- espace admin annonces
- espace admin opportunites
- espace admin histoire
- espace admin membres
- espace admin galerie

## Tests

Les tests Playwright sont dans [tests/e2e](/C:/Users/YOGA/Downloads/AECC/repo/tests/e2e).

`npm run test:e2e` demarre maintenant automatiquement le serveur local sur `http://localhost:3000`.

Ils couvrent actuellement :

- accueil
- administration
- historique
- annonces
- opportunites

## CI / CD

Le repo inclut deux workflows GitHub Actions :

- `ci.yml` : installation, lint, build
- `supabase-db-push.yml` : push des migrations Supabase sur `main`

Secrets GitHub requis pour les migrations :

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_ID`
- `SUPABASE_DB_PASSWORD`

## Notes importantes

- `SUPABASE_SERVICE_ROLE_KEY` doit rester strictement cote serveur.
- Les roles admin sont portes par `user_metadata.role` dans Supabase Auth avec deux valeurs supportees : `admin` et `super_admin`.
- La page `/admin/comptes` est reservee aux `super_admin` et permet de creer, promouvoir, retrograder et desactiver temporairement les comptes d'administration.
- Les artefacts locaux de debug et de test (`playwright-report`, `test-results`, logs) sont ignores.
- Avant commit, verifier au minimum :

```bash
npm run build
npx next lint
```
