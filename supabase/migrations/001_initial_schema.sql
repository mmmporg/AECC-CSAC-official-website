-- ══════════════════════════════════════════════════════════
-- AECC — Schéma initial + Seed data
-- À exécuter dans le SQL Editor de Supabase
-- ══════════════════════════════════════════════════════════

-- Annonces
CREATE TABLE IF NOT EXISTS announcements (
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
CREATE TABLE IF NOT EXISTS opportunities (
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

-- Événements de la frise chronologique
CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period TEXT NOT NULL,
  title_fr TEXT NOT NULL,
  title_en TEXT,
  description_fr TEXT NOT NULL,
  description_en TEXT,
  color TEXT DEFAULT 'green',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fondateurs
CREATE TABLE IF NOT EXISTS founders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  role_fr TEXT,
  role_en TEXT,
  in_memoriam BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0
);

-- Présidents successifs
CREATE TABLE IF NOT EXISTS presidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  year_start INT NOT NULL,
  year_end INT,
  city TEXT,
  sort_order INT DEFAULT 0
);

-- ──────────────────────────────────────────────────────────
-- Row Level Security
-- ──────────────────────────────────────────────────────────
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE presidents ENABLE ROW LEVEL SECURITY;

-- Lecture publique
CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (is_active = true);
CREATE POLICY "Public read opportunities" ON opportunities FOR SELECT USING (is_active = true);
CREATE POLICY "Public read timeline" ON timeline_events FOR SELECT USING (true);
CREATE POLICY "Public read founders" ON founders FOR SELECT USING (true);
CREATE POLICY "Public read presidents" ON presidents FOR SELECT USING (true);

-- Accès complet pour les admins authentifiés
CREATE POLICY "Admin full access announcements" ON announcements FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access opportunities" ON opportunities FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access timeline" ON timeline_events FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access founders" ON founders FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access presidents" ON presidents FOR ALL USING (auth.uid() IS NOT NULL);

-- ──────────────────────────────────────────────────────────
-- SEED DATA — Frise chronologique (5 événements)
-- ──────────────────────────────────────────────────────────
INSERT INTO timeline_events (period, title_fr, title_en, description_fr, description_en, color, sort_order) VALUES
(
  '1997 – 1998',
  'Issa Rouhaya, première représentante',
  'Issa Rouhaya, first representative',
  'Issa Rouhaya devient la première représentante de l''Amicale des étudiants camerounais, posant les bases d''une future organisation.',
  'Issa Rouhaya becomes the first representative of the Cameroonian students'' association, laying the groundwork for a future organisation.',
  'green',
  1
),
(
  'Septembre 1998',
  'Arrivée de 7 nouveaux étudiants',
  'Arrival of 7 new students',
  'L''arrivée de 7 nouveaux étudiants camerounais dynamise la communauté et renforce le besoin d''une structure formelle.',
  'The arrival of 7 new Cameroonian students strengthens the community and reinforces the need for a formal structure.',
  'yellow',
  2
),
(
  'Juillet 1999',
  '1ère Assemblée Générale à Beijing',
  '1st General Assembly in Beijing',
  'Lors de la première Assemblée Générale à Beijing, l''AECC est officiellement fondée. C''est la naissance officielle de l''association.',
  'At the first General Assembly in Beijing, the AECC is officially founded. This marks the official birth of the association.',
  'green',
  3
),
(
  'Juillet 2001',
  '2ème AG à Shanghai — siège déplaçable',
  '2nd GA in Shanghai — movable headquarters',
  'La 2ème Assemblée Générale à Shanghai instaure un siège déplaçable selon la ville du président en exercice et crée des délégués par ville.',
  'The 2nd General Assembly in Shanghai establishes a movable headquarters based on the sitting president''s city and creates city delegates.',
  'red',
  4
),
(
  '2022',
  '25e anniversaire — Solange Meying présidente',
  '25th anniversary — Solange Meying president',
  'L''AECC célèbre ses 25 ans d''existence avec 19 présidents successifs. Solange Meying prend la présidence pour cette édition anniversaire.',
  'AECC celebrates 25 years of existence with 19 successive presidents. Solange Meying takes over the presidency for this anniversary edition.',
  'gray',
  5
);

-- ──────────────────────────────────────────────────────────
-- SEED DATA — Fondateurs (17 membres)
-- ──────────────────────────────────────────────────────────
INSERT INTO founders (full_name, role_fr, role_en, in_memoriam, sort_order) VALUES
('Issa Rouhaya', '1ère représentante de l''Amicale', '1st representative of the Amicale', false, 1),
('Solange Meying', 'Présidente 2022', 'President 2022', false, 2),
('Alain Nnanga Otto', NULL, NULL, false, 3),
('Aliyou Mana Hamadou', NULL, NULL, false, 4),
('Alexis Nytchoya', NULL, NULL, false, 5),
('Bertrand Ateba', NULL, NULL, false, 6),
('Celestin Lélé', NULL, NULL, false, 7),
('Claude Fouté Nelong', NULL, NULL, false, 8),
('Cyrille Tagne Tamo', NULL, NULL, false, 9),
('Eric Goufo', NULL, NULL, false, 10),
('Frédéric Tavea', NULL, NULL, false, 11),
('Grégoire Kamdjo', NULL, NULL, true, 12),
('Ibrahim Mamadou Bobbo', NULL, NULL, false, 13),
('Lezin Seba', NULL, NULL, false, 14),
('Olivier Obama Etoa', NULL, NULL, false, 15),
('Paul Ebong', NULL, NULL, false, 16),
('Verdo Anutebe', NULL, NULL, false, 17);
