# Setup Local AECC

Cette documentation décrit la procédure réellement nécessaire pour installer, configurer et lancer le projet AECC en local.

Elle est pensée pour un collaborateur qui récupère le repo pour la première fois.

## 1. Pré-requis

À installer avant toute chose :

- `Node.js 20.x`
- `npm 10+`
- un projet `Supabase` accessible
- optionnel mais recommandé : `Supabase CLI`

Vérification rapide :

```bash
node -v
npm -v
supabase --version
```

## 2. Cloner le repo

```bash
git clone <repo-url>
cd repo
```

## 3. Installer les dépendances

```bash
npm install
```

## 4. Configurer les variables d’environnement

Copier le fichier d’exemple :

```bash
cp .env.example .env.local
```

Sous Windows PowerShell :

```powershell
Copy-Item .env.example .env.local
```

Puis remplir `.env.local` avec de vraies valeurs :

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 5. À quoi servent ces variables

- `NEXT_PUBLIC_SUPABASE_URL`
  URL du projet Supabase.

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  Clé publique utilisée côté client et côté serveur pour les sessions standard.

- `SUPABASE_SERVICE_ROLE_KEY`
  Clé serveur obligatoire pour :
  - certaines actions admin
  - la gestion des comptes admin
  - certains traitements serveur
  - les smoke tests

- `NEXT_PUBLIC_SITE_URL`
  URL locale du site. Garder `http://localhost:3000` sauf besoin spécifique.

## 6. Initialiser la base Supabase

Le repo ne dépend pas d’un Supabase local Dockerisé. Le chemin recommandé est de pointer vers un projet Supabase existant.

Les migrations SQL sont dans [supabase/migrations](/C:/Users/YOGA/Downloads/AECC/repo/supabase/migrations).

### Option recommandée : Supabase CLI

Lier le repo au projet :

```bash
supabase link --project-ref <project-ref>
```

Appliquer les migrations :

```bash
supabase db push
```

### Si vous n’utilisez pas la CLI

Vous pouvez exécuter les fichiers SQL dans le SQL Editor Supabase, dans cet ordre :

1. `001_initial_schema.sql`
2. `002_v2_annuaire_galerie.sql`
3. `003_v2_galerie_images.sql`
4. `004_v2_galerie_storage_bucket.sql`
5. `005_members_email_wechat.sql`
6. `005_v2_galerie_table.sql`
7. `006_history_images.sql`

## 7. Important sur les données initiales

Après application des migrations, la base contient déjà une partie des données métier de départ.

À ce jour, ce bootstrap couvre notamment :

- la frise historique
- les fondateurs
- une partie des présidents

Si vous devez vérifier la conformité métier complète, utilisez le PRD et les données réellement présentes dans Supabase.

## 8. Créer le premier compte admin

Le premier `admin` ou `super_admin` ne peut pas être créé depuis l’interface tant qu’aucun `super_admin` n’existe.

Il faut donc bootstrapper le premier compte dans Supabase.

### Méthode recommandée : Dashboard Supabase

1. Ouvrir `Authentication > Users`
2. Créer un utilisateur avec email + mot de passe
3. Confirmer l’email si nécessaire
4. Ajouter dans `user_metadata` :

```json
{
  "role": "super_admin"
}
```

Les rôles supportés par l’application sont :

- `admin`
- `super_admin`

Comportement actuel :

- `/admin/*` redirige vers `/admin/login` si aucune session n’existe
- un utilisateur authentifié sans rôle valide est redirigé vers `/admin/unauthorized`
- `/admin/comptes` est réservé aux `super_admin`

## 9. Démarrer le projet en local

Commande standard :

```bash
npm run dev
```

Le site sera disponible sur :

```text
http://localhost:3000
```

## 10. Vérifications de base après démarrage

Routes minimales à tester :

- `/fr`
- `/en`
- `/fr/histoire`
- `/fr/annonces`
- `/fr/opportunites`
- `/admin/login`

## 11. Vérifications recommandées avant de pousser

### Build

```bash
npm run build
```

### Lint

```bash
npx next lint
```

### Smoke tests

```bash
npm run test:e2e
```

Important :

- `npm run test:e2e` lance en réalité les smoke tests du projet
- ce n’est plus la suite Playwright principale
- ces smoke tests lancent un build de prod puis un `next start`
- ils ont besoin de `SUPABASE_SERVICE_ROLE_KEY`
- ils créent puis nettoient des données temporaires dans Supabase

### Playwright

Playwright est encore présent, mais ce n’est plus la stratégie de validation par défaut.

Commandes disponibles :

```bash
npm run test:playwright
npm run test:ui
```

## 12. Problèmes fréquents

### 1. `/admin/login` fonctionne mais l’accès admin échoue

Cause probable :

- l’utilisateur existe dans Supabase Auth
- mais il n’a pas `user_metadata.role = admin` ou `super_admin`

### 2. Les pages publiques chargent mais certaines actions admin plantent

Cause probable :

- `SUPABASE_SERVICE_ROLE_KEY` absent, invalide ou expiré

### 3. `next dev` casse avec des erreurs du type :

- `Cannot find module './8948.js'`
- `entryCSSFiles`
- 404 sur des chunks `/_next/static/...`

Cause probable :

- cache `.next` corrompu en mode dev, surtout sous Windows

Procédure :

```powershell
Remove-Item .next -Recurse -Force
npm run dev
```

Si le port `3000` est déjà pris :

```powershell
npx next dev --hostname localhost --port 3001
```

Puis mettre à jour temporairement l’URL utilisée dans le navigateur.

### 4. Le build passe mais l’environnement local reste incohérent

Faire dans cet ordre :

```bash
npm install
npm run build
npm run test:e2e
```

Si nécessaire :

```powershell
Remove-Item .next -Recurse -Force
```

## 13. Fichiers utiles

- [README.md](/C:/Users/YOGA/Downloads/AECC/repo/README.md)
- [docs/v1-checklist.md](/C:/Users/YOGA/Downloads/AECC/repo/docs/v1-checklist.md)
- [PRD/AECC_PRD.md](/C:/Users/YOGA/Downloads/AECC/repo/PRD/AECC_PRD.md)
- [supabase/migrations](/C:/Users/YOGA/Downloads/AECC/repo/supabase/migrations)
- [scripts/smoke-tests.mjs](/C:/Users/YOGA/Downloads/AECC/repo/scripts/smoke-tests.mjs)

## 14. Checklist d’onboarding rapide

1. Installer `Node 20` et `npm`
2. Cloner le repo
3. Faire `npm install`
4. Créer `.env.local`
5. Lier Supabase et appliquer les migrations
6. Créer un premier `super_admin` dans Supabase Auth
7. Lancer `npm run dev`
8. Vérifier `/fr`, `/en`, `/fr/histoire`, `/admin/login`
9. Valider `npm run build`
10. Valider `npm run test:e2e`
