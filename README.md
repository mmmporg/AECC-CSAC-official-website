# AECC Website

Site officiel de l'AECC, construit avec Next.js 14, TypeScript, Supabase, Tailwind CSS et `next-intl`.

## Stack

- Next.js 14 App Router
- TypeScript strict
- Tailwind CSS v3
- Supabase
- next-intl
- smoke tests Node pour la validation release
- Playwright disponible en complément

## Prérequis

- Node.js 20+
- npm 10+
- un projet Supabase configuré

## Setup local

La procédure complète de setup est ici :

- [docs/setup-local.md](/C:/Users/YOGA/Downloads/AECC/repo/docs/setup-local.md)

Elle couvre :

- installation locale
- variables d’environnement
- initialisation Supabase
- création du premier `super_admin`
- lancement du projet
- smoke tests
- problèmes fréquents sous Windows

## Commandes utiles

```bash
npm install
npm run dev
npm run build
npx next lint
npm run test:e2e
npm run test:playwright
npm run test:ui
```

## Base de données Supabase

Les migrations sont dans [supabase/migrations](/C:/Users/YOGA/Downloads/AECC/repo/supabase/migrations).

Commande recommandée :

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

## Tests

`npm run test:e2e` exécute les smoke tests du projet :

- build de production
- démarrage de `next start`
- vérifications fonctionnelles critiques
- création puis nettoyage de données temporaires Supabase

Playwright reste disponible mais n’est plus la voie principale de validation locale.

## Notes importantes

- `SUPABASE_SERVICE_ROLE_KEY` doit rester strictement côté serveur.
- Les rôles admin sont portés par `user_metadata.role` avec deux valeurs supportées :
  - `admin`
  - `super_admin`
- `/admin/comptes` est réservé aux `super_admin`.
- En cas de corruption de `.next` en mode dev sous Windows, supprimer `.next` puis relancer `npm run dev`.
