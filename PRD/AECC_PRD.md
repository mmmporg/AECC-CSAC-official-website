# PRD — Site Web AECC (Association des Étudiants Camerounais en Chine)

**Version :** 1.0  
**Date :** Avril 2026  
**Stack :** Next.js 14 · TypeScript · Supabase · Tailwind CSS · Vercel  
**Langues :** Français (primaire) · Anglais (secondaire)

---

## 1. Vue d'ensemble

### 1.1 Contexte

L'AECC (Association des Étudiants Camerounais en Chine) est fondée en juillet 1999 à Beijing. Elle regroupe les étudiants camerounais résidant en Chine. À ce jour, l'association compte 25 ans d'existence, 19 présidents successifs et des membres répartis sur tous les continents. Elle ne dispose pas encore de présence web officielle.

### 1.2 Objectif du produit

Créer un site web bilingue (FR/EN) qui serve à la fois de vitrine institutionnelle, de mémoire historique et de plateforme communautaire vivante permettant aux admins de publier des annonces et opportunités sans intervention technique.

### 1.3 Utilisateurs cibles

| Profil | Description | Besoin principal |
|--------|-------------|-----------------|
| Étudiant camerounais en Chine | Nouvel arrivant ou membre actif | Trouver des ressources, annonces, contacts |
| Ancien membre / diaspora | Ex-étudiant maintenant à l'étranger | Rester connecté, consulter l'histoire |
| Administrateur AECC | Bureau en place (président, SG, etc.) | Publier annonces et opportunités |
| Visiteur extérieur | Partenaire, ambassade, journaliste | Comprendre l'association |

---

## 2. Périmètre fonctionnel

### 2.1 Site public (accessible à tous)

#### Page d'accueil
- Hero section avec nom, slogan bilingue, chiffres clés (1997, 1999, 19 présidents, 25 ans)
- Résumé de la mission de l'AECC
- Liens vers les 3 sections principales : Histoire, Annonces, Opportunités
- Appel à action : « Rejoindre la communauté »

#### Section Histoire & Mémoire
- Frise chronologique interactive avec les étapes clés :
  - 1997–1998 : Issa Rouhaya, première représentante
  - Septembre 1998 : Arrivée de 7 nouveaux étudiants
  - Juillet 1999 : 1ère AG à Beijing — naissance officielle de l'AECC
  - Juillet 2001 : 2ème AG à Shanghai — siège déplaçable, délégués par ville
  - 2022 : 25e anniversaire, Solange Meying présidente
- Section « Pères & Mères Fondateurs » : liste des 17 membres avec nom, mentions spéciales (1ère représentante, in memoriam, président/e)
- Section « Présidents successifs » : liste chronologique des 19 présidents

#### Section Annonces
- Liste paginée des annonces publiées par les admins
- Filtres : ville (Beijing, Shanghai, Guangzhou, etc.), catégorie, date
- Catégories :
  - Logement (colocation, sous-location)
  - Vente / don d'objets entre étudiants
  - Entraide (transport, traducteur, démarches)
  - Événements communautaires
- Fiche annonce détaillée : titre, description, contact, date de publication, ville, catégorie
- Badge « Nouveau » sur les annonces de moins de 7 jours

#### Section Opportunités
- Liste paginée des opportunités
- Filtres : type, domaine, date limite
- Catégories :
  - Bourses d'études (gouvernement chinois, camerounais, privées)
  - Stages et emplois (entreprises sino-africaines, ONG, ambassades)
  - Appels à candidatures (organisations internationales)
  - Formations et conférences
- Fiche opportunité : titre, organisme, description, lien externe, date limite, date de publication

#### Section À propos
- Mission et valeurs de l'AECC
- Structure organisationnelle (bureau actuel si renseigné par les admins)
- Informations de contact

### 2.2 Panel d'administration (accès restreint)

#### Authentification
- Page de connexion `/admin/login` avec email + mot de passe
- Gestion via Supabase Auth
- Session persistante (JWT)
- Plusieurs comptes admins possibles (gérés par un super-admin)
- Redirection automatique vers `/admin/dashboard` après connexion
- Déconnexion sécurisée

#### Dashboard admin
- Vue d'ensemble : nombre d'annonces actives, opportunités actives, dernières publications
- Accès rapide : boutons « Nouvelle annonce » et « Nouvelle opportunité »
- Liste des contenus récents avec actions rapides (éditer, archiver, supprimer)

#### Gestion des annonces (CRUD complet)
- Créer une annonce : titre, description (rich text simple), ville, catégorie, contact, date d'expiration optionnelle
- Modifier une annonce existante
- Archiver / désarchiver une annonce (n'apparaît plus en public mais reste en base)
- Supprimer définitivement
- Prévisualisation avant publication

#### Gestion des opportunités (CRUD complet)
- Créer une opportunité : titre, organisme, description, lien externe, catégorie, date limite, date de publication
- Modifier, archiver, supprimer
- Prévisualisation avant publication

#### Gestion du contenu historique
- Modifier les textes de la frise chronologique
- Ajouter / modifier / supprimer un fondateur
- Ajouter / modifier un président dans la liste

---

## 3. Architecture technique

### 3.1 Stack

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| Framework | Next.js 14 (App Router) | SSR/SSG, routing, performance |
| Langage | TypeScript strict | Fiabilité, autocomplétion Codex |
| Base de données | Supabase (PostgreSQL) | Gratuit, auth intégré, realtime |
| ORM / client | Supabase JS client v2 | Typage automatique depuis schema |
| Styles | Tailwind CSS v3 | Utility-first, rapide |
| Hébergement | Vercel | Déploiement automatique, gratuit |
| Internationalisation | next-intl | Routing FR/EN, fichiers de traduction |

### 3.2 Structure des dossiers

```
aecc-website/
├── app/
│   ├── [locale]/               # Routing i18n (fr, en)
│   │   ├── page.tsx            # Page d'accueil
│   │   ├── histoire/page.tsx
│   │   ├── annonces/
│   │   │   ├── page.tsx        # Liste annonces
│   │   │   └── [id]/page.tsx   # Détail annonce
│   │   ├── opportunites/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── a-propos/page.tsx
│   └── admin/
│       ├── login/page.tsx
│       ├── dashboard/page.tsx
│       ├── annonces/
│       │   ├── page.tsx        # Liste admin
│       │   ├── new/page.tsx
│       │   └── [id]/edit/page.tsx
│       └── opportunites/
│           ├── page.tsx
│           ├── new/page.tsx
│           └── [id]/edit/page.tsx
├── components/
│   ├── public/                 # Composants site public
│   │   ├── Timeline.tsx
│   │   ├── AnnouncementCard.tsx
│   │   ├── OpportunityCard.tsx
│   │   ├── FounderCard.tsx
│   │   └── FilterBar.tsx
│   ├── admin/                  # Composants panel admin
│   │   ├── AdminSidebar.tsx
│   │   ├── AnnouncementForm.tsx
│   │   └── OpportunityForm.tsx
│   └── ui/                     # Composants UI génériques
│       ├── Badge.tsx
│       ├── Button.tsx
│       └── LanguageSwitcher.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Client Supabase browser
│   │   ├── server.ts           # Client Supabase server (SSR)
│   │   └── types.ts            # Types générés depuis Supabase
│   └── utils.ts
├── messages/
│   ├── fr.json                 # Traductions françaises
│   └── en.json                 # Traductions anglaises
├── middleware.ts               # Auth guard + i18n routing
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql
```

### 3.3 Schéma de base de données

```sql
-- Annonces
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_fr TEXT NOT NULL,
  title_en TEXT,
  description_fr TEXT NOT NULL,
  description_en TEXT,
  category TEXT NOT NULL CHECK (category IN ('logement', 'vente', 'entraide', 'evenement')),
  city TEXT NOT NULL,
  contact TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Opportunités
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_fr TEXT NOT NULL,
  title_en TEXT,
  description_fr TEXT NOT NULL,
  description_en TEXT,
  category TEXT NOT NULL CHECK (category IN ('bourse', 'stage_emploi', 'candidature', 'formation')),
  organization TEXT NOT NULL,
  external_link TEXT,
  deadline TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Événements historiques (frise)
CREATE TABLE timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period TEXT NOT NULL,           -- ex: "1997 – 1998"
  title_fr TEXT NOT NULL,
  title_en TEXT,
  description_fr TEXT NOT NULL,
  description_en TEXT,
  color TEXT DEFAULT 'green',     -- green | yellow | red | gray
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fondateurs
CREATE TABLE founders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  role_fr TEXT,                   -- ex: "1ère représentante"
  role_en TEXT,
  in_memoriam BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0
);

-- Présidents
CREATE TABLE presidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  year_start INT NOT NULL,
  year_end INT,
  city TEXT,                      -- Ville où ils ont présidé
  sort_order INT DEFAULT 0
);

-- Row Level Security
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE presidents ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour tout
CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (is_active = true);
CREATE POLICY "Public read opportunities" ON opportunities FOR SELECT USING (is_active = true);
CREATE POLICY "Public read timeline" ON timeline_events FOR SELECT USING (true);
CREATE POLICY "Public read founders" ON founders FOR SELECT USING (true);
CREATE POLICY "Public read presidents" ON presidents FOR SELECT USING (true);

-- Écriture réservée aux admins authentifiés
CREATE POLICY "Admin full access announcements" ON announcements FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access opportunities" ON opportunities FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access timeline" ON timeline_events FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access founders" ON founders FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access presidents" ON presidents FOR ALL USING (auth.uid() IS NOT NULL);
```

---

## 4. Internationalisation (i18n)

- Routing basé sur le préfixe de locale : `/fr/...` et `/en/...`
- Redirection automatique selon la langue du navigateur
- Switcher de langue visible dans le header sur toutes les pages
- Tous les champs de contenu dynamique (annonces, opportunités, etc.) ont un champ `_fr` et `_en`
- Si `_en` est vide, afficher le texte français par défaut
- Fichiers de traduction : `messages/fr.json` et `messages/en.json` pour tous les textes statiques

---

## 5. Authentification & Sécurité

- Supabase Auth avec email/password uniquement (pas d'OAuth pour V1)
- Le middleware Next.js protège toutes les routes `/admin/*`
- Si non authentifié → redirection vers `/admin/login`
- Row Level Security (RLS) activé sur toutes les tables Supabase
- Les variables d'environnement sensibles via `.env.local` :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (serveur uniquement)
- Pas de signup public — les comptes admins sont créés manuellement via le dashboard Supabase

---

## 6. Design & UI

### 6.1 Identité visuelle

- Couleurs principales : vert (#1D9E75, vert AECC), blanc, noir
- Couleur secondaire : or/amber (#EF9F27) pour les accents
- Police : Inter ou Geist (Next.js default)
- Ton : professionnel mais chaleureux, communautaire

### 6.2 Responsive

- Mobile-first obligatoire (beaucoup d'utilisateurs sur téléphone en Chine)
- Breakpoints Tailwind standard : sm (640px), md (768px), lg (1024px)
- Navigation mobile : menu hamburger

### 6.3 Composants clés

| Composant | Description |
|-----------|-------------|
| `Timeline` | Frise verticale avec blocs colorés par période |
| `AnnouncementCard` | Carte avec titre, ville, catégorie, badge « Nouveau » |
| `OpportunityCard` | Carte avec organisme, date limite, type |
| `FounderCard` | Nom + mention spéciale (in memoriam, rôle) |
| `FilterBar` | Filtres par catégorie et ville (chips cliquables) |
| `LanguageSwitcher` | Toggle FR / EN dans le header |
| `AdminSidebar` | Navigation latérale du panel admin |
| `AnnouncementForm` | Formulaire de création/édition d'annonce |

---

## 7. Données initiales (seed)

Les données suivantes doivent être insérées automatiquement via un script de seed Supabase :

### Événements de la frise
1. 1997–1998 — Issa Rouhaya, première représentante de l'Amicale
2. Septembre 1998 — Arrivée de 7 étudiants, dynamisation de la communauté
3. Juillet 1999 — 1ère AG à Beijing, naissance officielle de l'AECC
4. Juillet 2001 — 2ème AG à Shanghai, siège déplaçable, création de délégués par ville
5. 2022 — 25e anniversaire, Solange Meying présidente, 19 présidents en 25 ans

### Fondateurs (17 membres)
Alain Nnanga Otto, Aliyou Mana Hamadou, Alexis Nytchoya, Bertrand Ateba, Celestin Lélé, Claude Fouté Nelong, Cyrille Tagne Tamo, Eric Goufo, Frédéric Tavea, Grégoire Kamdjo (in memoriam), Ibrahim Mamadou Bobbo, Issa Rouhaya (1ère représentante), Lezin Seba, Olivier Obama Etoa, Paul Ebong, Solange Meying (Présidente 2022), Verdo Anutebe

---

## 8. Périmètre V1 vs V2

### V1 — Ce projet

- Site public complet (histoire, annonces, opportunités, à propos)
- Panel admin avec CRUD annonces + opportunités + contenu historique
- Authentification email/password
- Bilingue FR/EN
- Responsive mobile
- Déploiement Vercel + Supabase

### V2 — Évolutions futures (hors scope)

- Formulaire de soumission d'annonce par les membres (avec modération)
- Notifications email lors d'une nouvelle annonce (Resend ou Sendgrid)
- Galerie photos des événements
- Annuaire des membres avec profils
- Carte des membres par ville/pays
- Statistiques de visite (Plausible ou Umami)
- Domaine personnalisé (aecc.org ou aecc-china.com)

---

## 9. Critères d'acceptation

### Site public
- [ ] La page d'accueil s'affiche en FR par défaut et en EN après switch
- [ ] La frise chronologique affiche les 5 événements dans l'ordre
- [ ] Les 17 fondateurs sont affichés avec leurs mentions spéciales
- [ ] Les annonces actives s'affichent, les archivées n'apparaissent pas
- [ ] Le filtre par ville et catégorie fonctionne
- [ ] Le site est lisible sur mobile (iPhone SE minimum)

### Panel admin
- [ ] L'accès à `/admin/dashboard` sans connexion redirige vers `/admin/login`
- [ ] Un admin peut se connecter avec email + mot de passe
- [ ] Un admin peut créer une annonce qui apparaît immédiatement en public
- [ ] Un admin peut archiver une annonce (disparaît du public, reste en base)
- [ ] Un admin peut créer/modifier/supprimer une opportunité
- [ ] La déconnexion fonctionne et redirige vers `/admin/login`

### Performance
- [ ] Score Lighthouse ≥ 85 sur mobile
- [ ] First Contentful Paint < 2s sur connexion standard

---

## 10. Variables d'environnement requises

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Ne jamais exposer côté client
NEXT_PUBLIC_SITE_URL=https://aecc.vercel.app
```

---

## 11. Instructions pour Codex

### Commandes de démarrage

```bash
npx create-next-app@latest aecc-website --typescript --tailwind --app --use-npm
cd aecc-website
npm install @supabase/supabase-js @supabase/ssr next-intl
```

### Ordre d'implémentation recommandé

1. Setup Next.js + TypeScript + Tailwind
2. Configuration Supabase (client browser + server)
3. Schema SQL + seed data
4. Middleware auth + i18n routing
5. Layout global + header + footer + language switcher
6. Page d'accueil
7. Section Histoire (timeline + fondateurs)
8. Section Annonces (liste + détail + filtres)
9. Section Opportunités (liste + détail + filtres)
10. Panel admin : login
11. Panel admin : dashboard
12. Panel admin : CRUD annonces
13. Panel admin : CRUD opportunités
14. Panel admin : gestion contenu historique
15. Tests d'acceptation + Lighthouse audit

### Conventions de code

- Tous les composants en TypeScript strict (pas de `any`)
- Props typées avec `interface` (pas `type` pour les objets)
- Fetch server-side via les Server Components Next.js (pas de `useEffect` pour les données initiales)
- Mutations via Server Actions Next.js 14
- Nommage : `camelCase` pour les variables, `PascalCase` pour les composants, `kebab-case` pour les fichiers de routes
- Commentaires en français pour les logiques métier complexes

